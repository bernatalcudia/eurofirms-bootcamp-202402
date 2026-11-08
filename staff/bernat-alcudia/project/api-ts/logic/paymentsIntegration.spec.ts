import mongoose, { Types } from "mongoose"
import Stripe from "stripe"
import { expect } from "chai"
import { errors } from "com"
import { Chat, Product, User, UserRelation } from "../data/models"
import { createChatOffer, respondToChatOffer, startChat } from "./chat"
import { handleStripeWebhook } from "./payments"
import { removeProduct } from "./removeProduct"

const webhookSecret = "whsec_cGF5bWVudF90ZXN0X3NlY3JldA=="

describe("Stripe payment webhook integration", function () {
    let sellerId: string
    let buyerId: string
    let productId: string
    let chatId: string
    let offerId: string
    let attemptId: string
    let sessionId: string
    let connected = false
    let previousStripeSecret: string | undefined
    let previousWebhookSecret: string | undefined

    before(async function () {
        this.timeout(10000)
        const mongoUrl = process.env.MONGO_URL_TEST
        if (!mongoUrl) throw new Error("MONGO_URL_TEST is required for payment integration tests")
        await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 5000, connectTimeoutMS: 5000 })
        connected = true
    })

    beforeEach(async () => {
        previousStripeSecret = process.env.STRIPE_SECRET_KEY
        previousWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET
        process.env.STRIPE_SECRET_KEY = "sk_test_payment_integration"
        process.env.STRIPE_WEBHOOK_SECRET = webhookSecret

        const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`
        const [seller, buyer] = await User.create([
            {
                name: "Payment seller",
                birthdate: new Date("1980-01-01"),
                email: `payment-seller-${suffix}@example.test`,
                username: `payment-seller-${suffix}`,
                password: "test-password",
            },
            {
                name: "Payment buyer",
                birthdate: new Date("1981-01-01"),
                email: `payment-buyer-${suffix}@example.test`,
                username: `payment-buyer-${suffix}`,
                password: "test-password",
            },
        ])
        sellerId = seller._id.toString()
        buyerId = buyer._id.toString()
        const product = await Product.create({
            author: sellerId,
            images: ["image-data"],
            title: "Payment product",
            description: "",
            brand: "Test",
            price: 25,
            state: "new",
            stock: 3,
        })
        productId = product._id.toString()
        chatId = (await startChat(buyerId, productId)).id
        const proposed = await createChatOffer(buyerId, chatId, 10)
        offerId = proposed.offers[0].id
        await respondToChatOffer(sellerId, chatId, offerId, "accept")
        attemptId = new Types.ObjectId().toString()
        sessionId = `cs_test_${attemptId}`
        await Product.updateOne({ _id: productId }, { $inc: { stock: -1 } })
        await Chat.updateOne(
            { _id: chatId, "offers._id": offerId },
            { $set: {
                "offers.$.paymentStatus": "pending",
                "offers.$.checkoutAttemptId": attemptId,
                "offers.$.checkoutSessionId": sessionId,
                "offers.$.checkoutUrl": "https://checkout.stripe.com/c/pay/cs_test",
                "offers.$.inventoryReserved": true,
            } },
        )
    })

    afterEach(async () => {
        await Chat.deleteMany({ _id: chatId })
        await UserRelation.deleteMany({ $or: [{ from: sellerId }, { to: sellerId }, { from: buyerId }, { to: buyerId }] })
        await Product.deleteMany({ _id: productId })
        await User.deleteMany({ _id: { $in: [sellerId, buyerId] } })
        if (previousStripeSecret === undefined) delete process.env.STRIPE_SECRET_KEY
        else process.env.STRIPE_SECRET_KEY = previousStripeSecret
        if (previousWebhookSecret === undefined) delete process.env.STRIPE_WEBHOOK_SECRET
        else process.env.STRIPE_WEBHOOK_SECRET = previousWebhookSecret
    })

    function signedEvent(type: string, paymentStatus: string, amountTotal = 1000): { body: Buffer; signature: string } {
        const event = {
            id: `evt_${new Types.ObjectId().toString()}`,
            object: "event",
            api_version: "2024-06-20",
            created: Math.floor(Date.now() / 1000),
            data: {
                object: {
                    id: sessionId,
                    object: "checkout.session",
                    mode: "payment",
                    amount_total: amountTotal,
                    currency: "eur",
                    payment_status: paymentStatus,
                    metadata: { chatId, offerId, buyerId, attemptId },
                },
            },
            livemode: false,
            pending_webhooks: 1,
            type,
        }
        const body = Buffer.from(JSON.stringify(event))
        const signature = Stripe.webhooks.generateTestHeaderString({
            payload: body.toString("utf8"),
            secret: webhookSecret,
        })
        return { body, signature }
    }

    it("confirms payment only from a signed webhook and handles duplicate delivery once", async () => {
        const { body, signature } = signedEvent("checkout.session.completed", "paid")
        await handleStripeWebhook(body, signature)
        await handleStripeWebhook(body, signature)

        const chat = await Chat.findById(chatId)
        const offer = chat?.offers.find(item => item._id.toString() === offerId)
        expect(offer?.paymentStatus).to.equal("paid")
        expect(offer?.inventoryReserved).to.equal(true)
        expect((await Product.findById(productId))?.stock).to.equal(2)
    })

    it("releases reserved stock once when checkout expires", async () => {
        const { body, signature } = signedEvent("checkout.session.expired", "unpaid")
        await handleStripeWebhook(body, signature)
        await handleStripeWebhook(body, signature)

        const chat = await Chat.findById(chatId)
        const offer = chat?.offers.find(item => item._id.toString() === offerId)
        expect(offer?.paymentStatus).to.equal("expired")
        expect(offer?.inventoryReserved).to.equal(false)
        expect((await Product.findById(productId))?.stock).to.equal(3)
    })

    it("rejects a signed payment whose amount differs from the accepted offer", async () => {
        const { body, signature } = signedEvent("checkout.session.completed", "paid", 999)
        let error: unknown
        try {
            await handleStripeWebhook(body, signature)
        } catch (caught) {
            error = caught
        }
        expect(error).to.be.instanceOf(errors.ValidationError)
        expect((await Chat.findById(chatId))?.offers[0].paymentStatus).to.equal("pending")
        expect((await Product.findById(productId))?.stock).to.equal(2)
    })

    it("prevents deleting a product while a checkout has reserved its stock", async () => {
        let error: unknown
        try {
            await removeProduct(sellerId, productId)
        } catch (caught) {
            error = caught
        }
        expect(error).to.be.instanceOf(errors.DuplicityError)
        expect(await Product.exists({ _id: productId })).to.exist
    })

    after(async () => {
        if (connected) await mongoose.disconnect()
    })
})
