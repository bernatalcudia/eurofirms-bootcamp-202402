import { Types } from "mongoose"
import { errors, validate } from "com"
import { Chat, Product, User } from "../data/models.js"
import type {
    ChatMessageType,
    ChatOfferType,
    ChatSummaryType,
    ChatType,
    CreateChatOffer,
    RespondToChatOffer,
    RetrieveChat,
    RetrieveChats,
    SendChatMessage,
    StartChat,
} from "./types.js"

const { DuplicityError, NotFoundError, OwnershipError, SystemError, ValidationError } = errors

function mapMessage(message: {
    _id: Types.ObjectId
    from: Types.ObjectId
    text: string
    date: Date
}): ChatMessageType {
    return {
        id: message._id.toString(),
        from: message.from.toString(),
        text: message.text,
        date: message.date,
    }
}

function mapOffer(offer: {
    _id: Types.ObjectId
    amount: number
    offeredBy: Types.ObjectId
    status: "pending" | "accepted" | "rejected"
    date: Date
    respondedBy?: Types.ObjectId
    respondedAt?: Date
}): ChatOfferType {
    return {
        id: offer._id.toString(),
        amount: offer.amount,
        offeredBy: offer.offeredBy.toString(),
        status: offer.status,
        date: offer.date,
        ...(offer.respondedBy ? { respondedBy: offer.respondedBy.toString() } : {}),
        ...(offer.respondedAt ? { respondedAt: offer.respondedAt } : {}),
    }
}

async function findChat(userId: string, chatId: string) {
    validate.id(userId, "userId")
    validate.id(chatId, "chatId")

    const chat = await Chat.findOne({ _id: chatId, participants: userId })
        .catch(error => { throw new SystemError(error.message) })
    if (!chat) throw new NotFoundError("chat not found")
    return chat
}

type ChatDocument = Awaited<ReturnType<typeof findChat>>

async function mapChats(userId: string, chats: ChatDocument[]): Promise<ChatType[]> {
    if (!chats.length) return []

    const productIds = [...new Set(chats.map(chat => chat.product.toString()))]
    const participantIds = [...new Set(chats.flatMap(chat => chat.participants.map(id => id.toString())))]
    const [product, users] = await Promise.all([
        Product.find({ _id: { $in: productIds } })
            .select({ title: 1, price: 1, images: { $slice: 1 } })
            .lean()
            .catch(error => { throw new SystemError(error.message) }),
        User.find({ _id: { $in: participantIds } }).select("username").lean()
            .catch(error => { throw new SystemError(error.message) }),
    ])
    const productsById = new Map(product.map(item => [item._id.toString(), item]))
    const usersById = new Map(users.map(user => [user._id.toString(), user]))

    return chats.map(chat => {
        const otherParticipant = chat.participants.find(participant => participant.toString() !== userId)
        if (!otherParticipant) throw new SystemError("chat has no other participant")
        const otherParticipantId = otherParticipant.toString()
        const relatedProduct = productsById.get(chat.product.toString())
        const otherUser = usersById.get(otherParticipantId)
        const lastMessage = chat.messages.at(-1) ?? null

        return {
            id: chat._id.toString(),
            product: relatedProduct ? {
                id: relatedProduct._id.toString(),
                title: relatedProduct.title,
                images: relatedProduct.images,
                price: relatedProduct.price,
            } : null,
            otherUser: {
                id: otherParticipantId,
                username: otherUser?.username ?? "user",
            },
            lastMessage: lastMessage ? mapMessage(lastMessage) : null,
            updatedAt: chat.updatedAt,
            messages: chat.messages.map(mapMessage),
            offers: chat.offers.map(mapOffer),
        }
    })
}

export const startChat: StartChat = async (userId, productId) => {
    validate.id(userId, "userId")
    validate.id(productId, "productId")

    const [user, product] = await Promise.all([
        User.findById(userId).catch(error => { throw new SystemError(error.message) }),
        Product.findById(productId).catch(error => { throw new SystemError(error.message) }),
    ])
    if (!user) throw new NotFoundError("user not found")
    if (!product) throw new NotFoundError("product not found")
    if (product.author.toString() === userId) throw new OwnershipError("cannot start a chat with yourself")

    const participants = [userId, product.author.toString()].sort()
    const key = `${productId}:${participants.join(":")}`
    const chat = await Chat.findOneAndUpdate(
        { key },
        { $setOnInsert: { key, product: productId, participants } },
        { upsert: true, new: true, setDefaultsOnInsert: true },
    ).catch(async error => {
        const existingChat = await Chat.findOne({ key })
            .catch(lookupError => { throw new SystemError(lookupError.message) })
        if (existingChat) return existingChat
        throw new SystemError(error.message)
    })
    if (!chat) throw new SystemError("chat could not be created")
    const [mappedChat] = await mapChats(userId, [chat])
    if (!mappedChat) throw new SystemError("chat could not be mapped")
    return mappedChat
}

export const retrieveChats: RetrieveChats = async userId => {
    validate.id(userId, "userId")

    const chats = await Chat.find({ participants: userId }).sort({ updatedAt: -1 })
        .catch(error => { throw new SystemError(error.message) })

    const mappedChats = await mapChats(userId, chats)
    return mappedChats.map(mapped => {
        const { messages: _messages, offers: _offers, ...summary } = mapped
        return summary satisfies ChatSummaryType
    })
}

export const retrieveChat: RetrieveChat = async (userId, chatId) => {
    const [mappedChat] = await mapChats(userId, [await findChat(userId, chatId)])
    if (!mappedChat) throw new SystemError("chat could not be mapped")
    return mappedChat
}

export const sendChatMessage: SendChatMessage = async (userId, chatId, text) => {
    validate.id(userId, "userId")
    validate.id(chatId, "chatId")
    validate.string(text, "text")
    const normalizedText = text.trim()
    if (!normalizedText || normalizedText.length > 2000) {
        throw new ValidationError("message must contain 1 to 2000 characters")
    }

    const chat = await findChat(userId, chatId)
    const date = new Date()
    await Chat.updateOne(
        { _id: chat._id, participants: userId },
        { $push: { messages: {
            _id: new Types.ObjectId(),
            from: new Types.ObjectId(userId),
            text: normalizedText,
            date,
        } }, $set: { updatedAt: date } },
    ).catch(error => { throw new SystemError(error.message) })
    return retrieveChat(userId, chatId)
}

export const createChatOffer: CreateChatOffer = async (userId, chatId, amount) => {
    validate.id(userId, "userId")
    validate.id(chatId, "chatId")
    validate.number(amount, "amount")
    if (!Number.isFinite(amount) || amount <= 0) throw new ValidationError("offer must be greater than zero")

    const chat = await findChat(userId, chatId)
    if (chat.offers.some(offer => offer.status === "accepted")) {
        throw new DuplicityError("an offer has already been accepted for this product")
    }
    if (chat.offers.some(offer => offer.status === "pending")) {
        throw new DuplicityError("respond to the pending offer before making another offer")
    }
    const product = await Product.findById(chat.product).select("stock")
        .catch(error => { throw new SystemError(error.message) })
    if (!product || product.stock <= 0) throw new NotFoundError("product is no longer available")

    const date = new Date()
    const result = await Chat.updateOne(
        {
            _id: chat._id,
            participants: userId,
            offers: { $not: { $elemMatch: { status: { $in: ["pending", "accepted"] } } } },
        },
        { $push: { offers: {
            _id: new Types.ObjectId(),
            amount,
            offeredBy: new Types.ObjectId(userId),
            status: "pending",
            date,
        } }, $set: { updatedAt: date } },
    ).catch(error => { throw new SystemError(error.message) })
    if (!result.modifiedCount) {
        throw new DuplicityError("another offer was submitted or accepted")
    }
    return retrieveChat(userId, chatId)
}

export const respondToChatOffer: RespondToChatOffer = async (userId, chatId, offerId, decision) => {
    validate.id(userId, "userId")
    validate.id(chatId, "chatId")
    validate.id(offerId, "offerId")
    if (decision !== "accept" && decision !== "reject") {
        throw new ValidationError("decision must be accept or reject")
    }

    const chat = await findChat(userId, chatId)
    const offer = chat.offers.find(item => item._id.toString() === offerId)
    if (!offer) throw new NotFoundError("offer not found")
    if (offer.offeredBy.toString() === userId) {
        throw new OwnershipError("only the other participant can respond to an offer")
    }
    if (offer.status !== "pending") throw new DuplicityError("offer has already been answered")

    if (decision === "accept") {
        const product = await Product.findById(chat.product).select("stock")
            .catch(error => { throw new SystemError(error.message) })
        if (!product || product.stock <= 0) throw new NotFoundError("product is no longer available")
    }

    const date = new Date()
    const result = await Chat.updateOne(
        {
            _id: chat._id,
            participants: userId,
            offers: {
                $elemMatch: {
                    _id: offer._id,
                    status: "pending",
                    offeredBy: { $ne: new Types.ObjectId(userId) },
                },
            },
        },
        {
            $set: {
                "offers.$.status": decision === "accept" ? "accepted" : "rejected",
                "offers.$.respondedBy": new Types.ObjectId(userId),
                "offers.$.respondedAt": date,
                updatedAt: date,
            },
        },
    ).catch(error => { throw new SystemError(error.message) })
    if (!result.modifiedCount) throw new DuplicityError("offer has already been answered")
    return retrieveChat(userId, chatId)
}
