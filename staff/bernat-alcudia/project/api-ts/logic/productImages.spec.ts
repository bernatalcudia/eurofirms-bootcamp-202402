import mongoose from "mongoose"
import { expect } from "chai"
import { Product, User } from "../data/models"
import { retrieveProducts } from "./retrieveProducts"
import { retrieveProductDetails } from "./retrieveProductDetails"
import { retrieveSavedProducts } from "./retrieveSavedProducts"
import { searchProduct } from "./searchProduct"

describe("product image payloads", function () {
    const images = ["first-image", "second-image", "third-image"]
    let userId: string
    let productId: string
    let connected = false

    before(async function () {
        this.timeout(10000)
        const mongoUrl = process.env.MONGO_URL_TEST
        if (!mongoUrl) throw new Error("MONGO_URL_TEST is required for image integration tests")
        await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 5000, connectTimeoutMS: 5000 })
        connected = true
        const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`
        const user = await User.create({
            name: "Image user",
            birthdate: new Date("1980-01-01"),
            email: `images-${suffix}@example.test`,
            username: `images-${suffix}`,
            password: "test-password",
        })
        userId = user._id.toString()
        const product = await Product.create({
            author: userId,
            images,
            title: "Gallery lamp",
            description: "",
            brand: "Brand",
            price: 10,
            state: "new",
            stock: 1,
        })
        productId = product._id.toString()
        await User.updateOne({ _id: userId }, { $push: { saved: productId } })
    })

    after(async () => {
        await Product.deleteMany({ author: userId })
        await User.deleteMany({ _id: userId })
        if (connected) await mongoose.disconnect()
    })

    it("sends only the cover image in the catalog, search and saved lists", async () => {
        const [catalog, found, saved] = await Promise.all([
            retrieveProducts(userId),
            searchProduct(userId, "lamp"),
            retrieveSavedProducts(userId),
        ])
        for (const list of [catalog, found, saved]) {
            expect(list).to.have.length(1)
            expect(list[0].images).to.deep.equal(["first-image"])
        }
    })

    it("still sends every image in the product details", async () => {
        const details = await retrieveProductDetails(userId, productId)
        expect(details.images).to.deep.equal(images)
    })
})
