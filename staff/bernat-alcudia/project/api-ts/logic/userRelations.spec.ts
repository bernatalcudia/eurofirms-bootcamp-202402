import mongoose from "mongoose"
import { expect } from "chai"
import { errors } from "com"
import { Chat, Product, User, UserRelation } from "../data/models"
import {
    createChatOffer,
    respondToChatOffer,
    retrieveChat,
    retrieveChats,
    sendChatMessage,
    startChat,
} from "./chat"
import { createOfferCheckout } from "./payments"
import {
    blockUser,
    followUser,
    retrieveBlockedUsers,
    retrievePublicProfile,
    unblockUser,
} from "./userRelations"

describe("user relationships", function () {
    let sellerId: string
    let buyerId: string
    let productId: string
    let chatId: string
    let connected = false

    before(async function () {
        this.timeout(10000)
        const mongoUrl = process.env.MONGO_URL_TEST
        if (!mongoUrl) throw new Error("MONGO_URL_TEST is required for relationship integration tests")
        await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 5000, connectTimeoutMS: 5000 })
        connected = true
    })

    beforeEach(async () => {
        const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`
        const [seller, buyer] = await User.create([
            {
                name: "Relationship seller",
                birthdate: new Date("1980-01-01"),
                email: `relationship-seller-${suffix}@example.test`,
                username: `relation-seller-${suffix}`,
                password: "test-password",
            },
            {
                name: "Relationship buyer",
                birthdate: new Date("1981-01-01"),
                email: `relationship-buyer-${suffix}@example.test`,
                username: `relation-buyer-${suffix}`,
                password: "test-password",
            },
        ])
        sellerId = seller._id.toString()
        buyerId = buyer._id.toString()
        const product = await Product.create({
            author: sellerId,
            images: ["image-data"],
            title: "Relationship product",
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
        await UserRelation.deleteMany({ $or: [{ from: sellerId }, { to: sellerId }, { from: buyerId }, { to: buyerId }] })
        await Product.deleteMany({ _id: productId })
        await User.deleteMany({ _id: { $in: [sellerId, buyerId] } })
    })

    it("stores follows and exposes only public profile details", async () => {
        await followUser(buyerId, sellerId)
        await followUser(sellerId, buyerId)
        const profile = await retrievePublicProfile(buyerId, sellerId)
        expect(profile.isFollowing).to.equal(true)
        expect(profile.followersCount).to.equal(1)
        expect(profile.followingCount).to.equal(1)
        expect(profile).not.to.have.property("email")
        expect(profile).not.to.have.property("role")
    })

    it("blocks both directions without deleting products or conversation history", async () => {
        await followUser(buyerId, sellerId)
        await followUser(sellerId, buyerId)
        const proposed = await createChatOffer(buyerId, chatId, 20)
        const accepted = await respondToChatOffer(sellerId, chatId, proposed.offers[0].id, "accept")
        await blockUser(sellerId, buyerId)
        expect(await UserRelation.countDocuments({ kind: "follow", $or: [
            { from: sellerId, to: buyerId },
            { from: buyerId, to: sellerId },
        ] })).to.equal(0)
        expect((await retrieveBlockedUsers(sellerId)).map(user => user.id)).to.include(buyerId)
        expect(await Product.exists({ _id: productId })).to.exist
        expect(await Chat.exists({ _id: chatId })).to.exist
        expect(await retrieveChats(buyerId)).to.have.length(0)

        for (const action of [
            () => retrieveChat(buyerId, chatId),
            () => sendChatMessage(buyerId, chatId, "Blocked message"),
            () => createChatOffer(buyerId, chatId, 20),
            () => createOfferCheckout(buyerId, chatId, accepted.offers[0].id),
            () => startChat(buyerId, productId),
        ]) {
            let error: unknown
            try {
                await action()
            } catch (caught) {
                error = caught
            }
            expect(error).to.be.instanceOf(errors.NotFoundError)
        }

        await unblockUser(sellerId, buyerId)
        expect((await retrieveChat(buyerId, chatId)).id).to.equal(chatId)
        expect(await retrieveBlockedUsers(sellerId)).to.have.length(0)
    })

    it("does not allow following oneself", async () => {
        let error: unknown
        try {
            await followUser(buyerId, buyerId)
        } catch (caught) {
            error = caught
        }
        expect(error).to.be.instanceOf(errors.OwnershipError)
    })

    after(async () => {
        if (connected) await mongoose.disconnect()
    })
})
