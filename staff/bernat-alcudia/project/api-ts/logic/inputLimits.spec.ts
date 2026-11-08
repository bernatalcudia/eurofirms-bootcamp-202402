import mongoose from "mongoose"
import bcrypt from "bcrypt"
import { expect } from "chai"
import { errors } from "com"
import { Product, User } from "../data/models"
import { authenticateUser } from "./authenticateUser"
import { createProduct } from "./createProduct"
import { searchProduct } from "./searchProduct"

describe("input limits and search hardening", function () {
    let userId: string
    let connected = false
    const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`

    before(async function () {
        this.timeout(10000)
        const mongoUrl = process.env.MONGO_URL_TEST
        if (!mongoUrl) throw new Error("MONGO_URL_TEST is required for hardening integration tests")
        await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 5000, connectTimeoutMS: 5000 })
        connected = true
        const user = await User.create({
            name: "Hardening user",
            birthdate: new Date("1980-01-01"),
            email: `hardening-${suffix}@example.test`,
            username: `hardening-${suffix}`,
            password: await bcrypt.hash("correct-password", 4),
        })
        userId = user._id.toString()
    })

    afterEach(async () => {
        await Product.deleteMany({ author: userId })
    })

    after(async () => {
        await User.deleteMany({ _id: userId })
        if (connected) await mongoose.disconnect()
    })

    const validProduct = { title: "Vase", description: "A vase", brand: "Brand", price: 10, state: "new", stock: 1 }
    const create = async (overrides: Partial<{ images: string[], title: string, description: string, brand: string }> = {}) =>
        createProduct(userId, overrides.images ?? ["image-data"], overrides.title ?? validProduct.title,
            overrides.description ?? validProduct.description, overrides.brand ?? validProduct.brand,
            validProduct.price, validProduct.state, validProduct.stock)

    it("rejects products with too many or oversized images and overlong text", async () => {
        const failures = await Promise.allSettled([
            create({ images: Array(11).fill("image-data") }),
            create({ images: ["a".repeat(1_200_001)] }),
            create({ title: "t".repeat(121) }),
            create({ brand: "b".repeat(121) }),
            create({ description: "d".repeat(2001) }),
        ])
        for (const result of failures) {
            expect(result.status).to.equal("rejected")
            expect((result as PromiseRejectedResult).reason).to.be.instanceOf(errors.ValidationError)
        }
        expect(await Product.countDocuments({ author: userId })).to.equal(0)
    })

    it("accepts products at the documented limits", async () => {
        await create({ images: Array(10).fill("a".repeat(1_200_000)), title: "t".repeat(120), description: "d".repeat(2000) })
        expect(await Product.countDocuments({ author: userId })).to.equal(1)
    })

    it("treats search text literally instead of as a regular expression", async () => {
        await create({ title: "A+B special" })
        await create({ title: "AAB special" })
        const literal = await searchProduct(userId, "A+B")
        expect(literal.map(product => product.title)).to.deep.equal(["A+B special"])
        expect(await searchProduct(userId, ".*")).to.have.length(0)
        expect(await searchProduct(userId, "(")).to.have.length(0)
    })

    it("rejects overlong search text", async () => {
        let error: unknown
        try {
            await searchProduct(userId, "a".repeat(101))
        } catch (caught) {
            error = caught
        }
        expect(error).to.be.instanceOf(errors.ValidationError)
    })

    it("still rejects wrong credentials for unknown and known users alike", async () => {
        for (const username of [`hardening-${suffix}`, `missing-${suffix}`]) {
            let error: unknown
            try {
                await authenticateUser(username, "wrong-password")
            } catch (caught) {
                error = caught
            }
            expect(error).to.be.instanceOf(errors.CredentialsError)
        }
        expect(await authenticateUser(`hardening-${suffix}`, "correct-password")).to.have.property("id", userId)
    })
})
