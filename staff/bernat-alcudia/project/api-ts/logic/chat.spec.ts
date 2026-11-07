import mongoose from "mongoose"
import { expect } from "chai"
import { Chat, Product, User } from "../data/models"
import { errors } from "com"
import {
    createChatOffer,
    respondToChatOffer,
    retrieveChat,
    sendChatMessage,
    startChat,
} from "./chat"

describe("chat and offers", function () {
    let sellerId: string
    let buyerId: string
    let productId: string
    let chatId: string
    let connected = false

    before(async function () {
        this.timeout(10000)
        const mongoUrl = process.env.MONGO_URL_TEST
        if (!mongoUrl) throw new Error("MONGO_URL_TEST is required for chat integration tests")
        await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 5000, connectTimeoutMS: 5000 })
        connected = true
    })

    beforeEach(async () => {
        const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`
        const [seller, buyer] = await User.create([
            {
                name: "Chat seller",
                birthdate: new Date("1980-01-01"),
                email: `seller-${suffix}@example.test`,
                username: `seller-${suffix}`,
                password: "test-password",
            },
            {
                name: "Chat buyer",
                birthdate: new Date("1981-01-01"),
                email: `buyer-${suffix}@example.test`,
                username: `buyer-${suffix}`,
                password: "test-password",
            },
        ])
        sellerId = seller._id.toString()
        buyerId = buyer._id.toString()
        const product = await Product.create({
            author: sellerId,
            images: ["image-data"],
            title: "Test product",
            description: "",
            brand: "Test",
            price: 25,
            state: "new",
            stock: 3,
        })
        productId = product._id.toString()
        chatId = (await startChat(buyerId, productId)).id
    })

    afterEach(async () => {
        await Chat.deleteMany({ _id: chatId })
        await Product.deleteMany({ _id: productId })
        await User.deleteMany({ _id: { $in: [sellerId, buyerId] } })
    })

    it("reuses the product conversation and permits only its participants", async () => {
        const repeated = await startChat(buyerId, productId)
        expect(repeated.id).to.equal(chatId)
        let error: unknown
        try {
            await retrieveChat(new mongoose.Types.ObjectId().toString(), chatId)
        } catch (caught) {
            error = caught
        }
        expect(error).to.be.instanceOf(errors.NotFoundError)
    })

    it("stores messages and trims surrounding whitespace", async () => {
        const updated = await sendChatMessage(buyerId, chatId, "  Is this available?  ")
        expect(updated.messages).to.have.length(1)
        expect(updated.messages[0].text).to.equal("Is this available?")
        expect(updated.messages[0].from).to.equal(buyerId)
    })

    it("requires the other participant to accept and does not change stock", async () => {
        const proposed = await createChatOffer(buyerId, chatId, 20)
        const offer = proposed.offers[0]
        expect(offer.status).to.equal("pending")

        let ownOfferError: unknown
        try {
            await respondToChatOffer(buyerId, chatId, offer.id, "accept")
        } catch (caught) {
            ownOfferError = caught
        }
        expect(ownOfferError).to.be.instanceOf(errors.OwnershipError)

        const accepted = await respondToChatOffer(sellerId, chatId, offer.id, "accept")
        expect(accepted.offers[0].status).to.equal("accepted")
        expect(accepted.offers[0].respondedBy).to.equal(sellerId)
        let followUpError: unknown
        try {
            await createChatOffer(sellerId, chatId, 22)
        } catch (caught) {
            followUpError = caught
        }
        expect(followUpError).to.be.instanceOf(errors.DuplicityError)
        const product = await Product.findById(productId)
        expect(product?.stock).to.equal(3)
    })

    it("allows only one unanswered offer at a time", async () => {
        await createChatOffer(buyerId, chatId, 20)
        let error: unknown
        try {
            await createChatOffer(sellerId, chatId, 22)
        } catch (caught) {
            error = caught
        }
        expect(error).to.be.instanceOf(errors.DuplicityError)
    })

    after(async () => {
        if (connected) await mongoose.disconnect()
    })
})
