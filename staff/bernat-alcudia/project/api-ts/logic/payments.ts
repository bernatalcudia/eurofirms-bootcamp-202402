import mongoose, { Types } from "mongoose"
import Stripe from "stripe"
import { errors, validate } from "com"
import { Chat, Product } from "../data/models.js"
import { ensureUsersNotBlocked } from "./userRelations.js"
import type { CreateOfferCheckout, HandleStripeWebhook } from "./types.js"

const { DuplicityError, NotFoundError, SystemError, ValidationError } = errors

type CheckoutMetadata = {
    chatId?: string
    offerId?: string
    buyerId?: string
    attemptId?: string
}

export function toStripeAmount(amount: number): number {
    if (!Number.isFinite(amount) || amount <= 0) {
        throw new ValidationError("payment amount must be greater than zero")
    }
    const cents = Math.round(amount * 100)
    if (!Number.isSafeInteger(cents) || cents < 1 || cents > 99_999_999) {
        throw new ValidationError("payment amount is outside the supported range")
    }
    return cents
}

function getStripe(): Stripe {
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) throw new SystemError("Stripe payments are not configured")
    return new Stripe(secretKey)
}

function getWebhookSecret(): string {
    const secret = process.env.STRIPE_WEBHOOK_SECRET
    if (!secret) throw new SystemError("Stripe webhook is not configured")
    return secret
}

function getReturnUrls(chatId: string, offerId: string): { successUrl: string; cancelUrl: string } {
    const configuredUrl = process.env.PAYMENT_RETURN_URL
    if (!configuredUrl) throw new SystemError("Payment return URL is not configured")
    let returnUrl: URL
    try {
        returnUrl = new URL(configuredUrl)
    } catch {
        throw new SystemError("Payment return URL is invalid")
    }
    const localHttp = returnUrl.protocol === "http:" &&
        (returnUrl.hostname === "localhost" || returnUrl.hostname === "127.0.0.1")
    if ((returnUrl.protocol !== "https:" && !localHttp) || returnUrl.username || returnUrl.password) {
        throw new SystemError("Payment return URL must use HTTPS")
    }
    const makeUrl = (status: "success" | "cancel") => {
        const url = new URL(returnUrl)
        url.searchParams.set("payment", status)
        url.searchParams.set("chat_id", chatId)
        url.searchParams.set("offer_id", offerId)
        if (status === "success") url.searchParams.set("session_id", "{CHECKOUT_SESSION_ID}")
        return url.toString()
    }
    return { successUrl: makeUrl("success"), cancelUrl: makeUrl("cancel") }
}

async function reserveInventory(
    userId: string,
    chatId: string,
    offerId: string,
): Promise<{ amount: number; productTitle: string; attemptId: string }> {
    const session = await mongoose.startSession()
    try {
        let reservation: { amount: number; productTitle: string; attemptId: string } | undefined
        await session.withTransaction(async () => {
            const chat = await Chat.findOne({ _id: chatId, participants: userId }).session(session)
            if (!chat) throw new NotFoundError("chat not found")
            const offer = chat.offers.find(item => item._id.toString() === offerId)
            if (!offer || offer.status !== "accepted") throw new DuplicityError("only accepted offers can be paid")

            const product = await Product.findById(chat.product).select("title author").session(session)
            if (!product) throw new NotFoundError("product not found")
            if (product.author.toString() === userId) throw new DuplicityError("the seller cannot pay their own offer")
            if (offer.paymentStatus === "paid") throw new DuplicityError("this offer has already been paid")
            if (offer.paymentStatus === "pending") {
                if (!offer.inventoryReserved || !offer.checkoutAttemptId) {
                    throw new SystemError("pending checkout reservation is inconsistent")
                }
                reservation = {
                    amount: offer.amount,
                    productTitle: product.title,
                    attemptId: offer.checkoutAttemptId,
                }
                return
            }
            if (offer.paymentStatus === "creating") {
                if (!offer.inventoryReserved || !offer.checkoutAttemptId) {
                    throw new SystemError("checkout reservation is inconsistent")
                }
                reservation = { amount: offer.amount, productTitle: product.title, attemptId: offer.checkoutAttemptId }
                return
            }

            const stockReservation = await Product.updateOne(
                { _id: product._id, stock: { $gt: 0 } },
                { $inc: { stock: -1 } },
                { session },
            )
            if (!stockReservation.modifiedCount) throw new NotFoundError("product is no longer available")

            const attemptId = new Types.ObjectId().toString()
            offer.paymentStatus = "creating"
            offer.inventoryReserved = true
            offer.checkoutAttemptId = attemptId
            offer.checkoutSessionId = undefined
            offer.checkoutUrl = undefined
            await chat.save({ session })
            reservation = { amount: offer.amount, productTitle: product.title, attemptId }
        })
        if (!reservation) throw new SystemError("checkout reservation could not be created")
        return reservation
    } catch (error) {
        if (error instanceof errors.SystemError || error instanceof errors.ValidationError ||
            error instanceof errors.NotFoundError || error instanceof errors.DuplicityError) {
            throw error
        }
        throw new SystemError(error instanceof Error ? error.message : "checkout reservation failed")
    } finally {
        await session.endSession()
    }
}

export const createOfferCheckout: CreateOfferCheckout = async (userId, chatId, offerId) => {
    validate.id(userId, "userId")
    validate.id(chatId, "chatId")
    validate.id(offerId, "offerId")

    const chat = await Chat.findOne({ _id: chatId, participants: userId })
        .catch(error => { throw new SystemError(error.message) })
    if (!chat) throw new NotFoundError("chat not found")
    const otherParticipant = chat.participants.find(participant => participant.toString() !== userId)
    if (otherParticipant) await ensureUsersNotBlocked(userId, otherParticipant.toString())
    const offer = chat.offers.find(item => item._id.toString() === offerId)
    if (!offer || offer.status !== "accepted") throw new DuplicityError("only accepted offers can be paid")
    if (offer.paymentStatus === "paid") throw new DuplicityError("this offer has already been paid")

    const stripe = getStripe()
    if (offer.paymentStatus === "pending" && offer.checkoutSessionId && offer.checkoutUrl) {
        const existingSession = await stripe.checkout.sessions.retrieve(offer.checkoutSessionId)
            .catch(error => { throw new SystemError(error.message) })
        if (existingSession.status === "open") return { url: offer.checkoutUrl }
        throw new DuplicityError("checkout is no longer available; refresh the conversation")
    }

    const amount = toStripeAmount(offer.amount)
    const { successUrl, cancelUrl } = getReturnUrls(chatId, offerId)
    const reservation = await reserveInventory(userId, chatId, offerId)
    const metadata = { chatId, offerId, buyerId: userId, attemptId: reservation.attemptId }
    let checkout: Stripe.Checkout.Session
    try {
        checkout = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items: [{
                quantity: 1,
                price_data: {
                    currency: "eur",
                    unit_amount: amount,
                    product_data: { name: reservation.productTitle },
                },
            }],
            success_url: successUrl,
            cancel_url: cancelUrl,
            expires_at: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
            metadata,
        }, { idempotencyKey: `offer-${offerId}-${reservation.attemptId}` })
    } catch (error) {
        await releaseCheckoutReservation(undefined, metadata, "failed")
        throw new SystemError(error instanceof Error ? error.message : "Stripe checkout session could not be created")
    }
    if (!checkout.url) {
        await releaseCheckoutReservation(undefined, metadata, "failed")
        throw new SystemError("Stripe did not return a checkout URL")
    }

    try {
        await Chat.updateOne(
            {
                _id: chatId,
                participants: userId,
                offers: {
                    $elemMatch: {
                        _id: offerId,
                        paymentStatus: "creating",
                        checkoutAttemptId: reservation.attemptId,
                        inventoryReserved: true,
                    },
                },
            },
            {
                $set: {
                    "offers.$.paymentStatus": "pending",
                    "offers.$.checkoutSessionId": checkout.id,
                    "offers.$.checkoutUrl": checkout.url,
                },
            },
        )
    } catch (error) {
        await releaseCheckoutReservation(undefined, metadata, "failed")
        throw new SystemError(error instanceof Error ? error.message : "checkout session could not be saved")
    }
    return { url: checkout.url }
}

function parseMetadata(metadata: CheckoutMetadata | null): Required<CheckoutMetadata> {
    if (!metadata?.chatId || !metadata.offerId || !metadata.buyerId || !metadata.attemptId) {
        throw new ValidationError("Stripe checkout metadata is incomplete")
    }
    validate.id(metadata.chatId, "chatId")
    validate.id(metadata.offerId, "offerId")
    validate.id(metadata.buyerId, "buyerId")
    validate.id(metadata.attemptId, "attemptId")
    return {
        chatId: metadata.chatId,
        offerId: metadata.offerId,
        buyerId: metadata.buyerId,
        attemptId: metadata.attemptId,
    }
}

function isCheckoutSession(value: Stripe.Event.Data.Object): value is Stripe.Checkout.Session {
    return typeof value === "object" &&
        value !== null &&
        "object" in value &&
        value.object === "checkout.session" &&
        "id" in value &&
        typeof value.id === "string" &&
        "mode" in value &&
        value.mode === "payment" &&
        "payment_status" in value &&
        typeof value.payment_status === "string" &&
        "metadata" in value &&
        (value.metadata === null || typeof value.metadata === "object")
}

async function updatePaidCheckout(stripeSession: Stripe.Checkout.Session, metadata: Required<CheckoutMetadata>): Promise<void> {
    if (stripeSession.payment_status !== "paid" || stripeSession.currency !== "eur") {
        throw new ValidationError("Stripe checkout is not a paid EUR session")
    }
    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const chat = await Chat.findOne({ _id: metadata.chatId, participants: metadata.buyerId }).session(session)
            const offer = chat?.offers.find(item => item._id.toString() === metadata.offerId)
            if (!chat || !offer) throw new NotFoundError("offer not found")
            if (offer.paymentStatus === "paid" && offer.checkoutSessionId === stripeSession.id) return
            if (!["creating", "pending"].includes(offer.paymentStatus) ||
                offer.checkoutAttemptId !== metadata.attemptId ||
                !offer.inventoryReserved ||
                (offer.checkoutSessionId && offer.checkoutSessionId !== stripeSession.id)) {
                throw new DuplicityError("checkout is no longer active")
            }
            if (stripeSession.amount_total !== toStripeAmount(offer.amount)) {
                throw new ValidationError("Stripe checkout amount does not match the accepted offer")
            }
            const product = await Product.findById(chat.product).select("author").session(session)
            if (!product || product.author.toString() === metadata.buyerId) {
                throw new ValidationError("checkout buyer or product is invalid")
            }
            offer.paymentStatus = "paid"
            offer.checkoutSessionId = stripeSession.id
            await chat.save({ session })
        })
    } catch (error) {
        if (error instanceof errors.SystemError || error instanceof errors.ValidationError ||
            error instanceof errors.NotFoundError || error instanceof errors.DuplicityError) {
            throw error
        }
        throw new SystemError(error instanceof Error ? error.message : "payment confirmation failed")
    } finally {
        await session.endSession()
    }
}

async function releaseCheckoutReservation(
    checkoutSessionId: string | undefined,
    metadata: Required<CheckoutMetadata>,
    status: "expired" | "failed",
): Promise<void> {
    const session = await mongoose.startSession()
    try {
        await session.withTransaction(async () => {
            const chat = await Chat.findOne({ _id: metadata.chatId, participants: metadata.buyerId }).session(session)
            const offer = chat?.offers.find(item => item._id.toString() === metadata.offerId)
            if (!chat || !offer) return
            if (offer.checkoutAttemptId !== metadata.attemptId ||
                !["creating", "pending"].includes(offer.paymentStatus) ||
                (offer.checkoutSessionId && offer.checkoutSessionId !== checkoutSessionId) ||
                (!checkoutSessionId && offer.checkoutSessionId)) {
                return
            }
            if (offer.inventoryReserved) {
                const stockRestore = await Product.updateOne(
                    { _id: chat.product },
                    { $inc: { stock: 1 } },
                    { session },
                )
                if (!stockRestore.modifiedCount) throw new SystemError("reserved product could not be restored")
                offer.inventoryReserved = false
            }
            offer.paymentStatus = status
            if (checkoutSessionId) offer.checkoutSessionId = checkoutSessionId
            offer.checkoutUrl = undefined
            await chat.save({ session })
        })
    } catch (error) {
        if (error instanceof errors.SystemError || error instanceof errors.ValidationError ||
            error instanceof errors.NotFoundError || error instanceof errors.DuplicityError) {
            throw error
        }
        throw new SystemError(error instanceof Error ? error.message : "checkout reservation release failed")
    } finally {
        await session.endSession()
    }
}

export const handleStripeWebhook: HandleStripeWebhook = async (rawBody, signature) => {
    if (!Buffer.isBuffer(rawBody)) throw new ValidationError("Stripe webhook body must be raw bytes")
    validate.string(signature, "Stripe signature")
    const stripe = getStripe()
    const webhookSecret = getWebhookSecret()
    let event: Stripe.Event
    try {
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
    } catch {
        throw new ValidationError("invalid Stripe webhook signature")
    }

    if (
        event.type !== "checkout.session.completed" &&
        event.type !== "checkout.session.async_payment_succeeded" &&
        event.type !== "checkout.session.expired" &&
        event.type !== "checkout.session.async_payment_failed"
    ) return

    if (!isCheckoutSession(event.data.object)) {
        throw new ValidationError("Stripe event does not contain a Checkout session")
    }
    const stripeSession = event.data.object
    const metadata = parseMetadata(stripeSession.metadata)
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
        if (stripeSession.payment_status === "paid") await updatePaidCheckout(stripeSession, metadata)
        return
    }
    await releaseCheckoutReservation(
        stripeSession.id,
        metadata,
        event.type === "checkout.session.expired" ? "expired" : "failed",
    )
}
