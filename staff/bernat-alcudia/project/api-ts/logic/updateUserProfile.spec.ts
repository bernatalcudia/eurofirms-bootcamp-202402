import bcrypt from "bcrypt"
import mongoose from "mongoose"
import { expect } from "chai"
import { errors } from "com"
import { User } from "../data/models"
import { updateUserProfile } from "./updateUserProfile"
import { retrievePublicProfile } from "./userRelations"

describe("update user profile", function () {
    let userId: string
    let connected = false

    before(async function () {
        this.timeout(10000)
        const mongoUrl = process.env.MONGO_URL_TEST
        if (!mongoUrl) throw new Error("MONGO_URL_TEST is required for profile integration tests")
        await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 5000, connectTimeoutMS: 5000 })
        connected = true
    })

    beforeEach(async () => {
        const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`
        const password = await bcrypt.hash("valid-test-password", 4)
        const user = await User.create({
            name: "Original name",
            birthdate: new Date("1980-01-01"),
            email: `profile-${suffix}@example.test`,
            username: `profile-${suffix}`,
            password,
            role: "regular",
        })
        userId = user._id.toString()
    })

    afterEach(async () => {
        await User.deleteMany({ _id: userId })
    })

    it("updates editable details but never changes role or password", async () => {
        const updated = await updateUserProfile(userId, {
            name: "  Updated name ",
            username: "updated-user",
            birthdate: "1985-01-02",
        })
        expect(updated.name).to.equal("Updated name")
        expect(updated.username).to.equal("updated-user")
        expect(updated.role).to.equal("regular")
        const stored = await User.findById(userId).select("password")
        expect(await bcrypt.compare("valid-test-password", stored!.password)).to.equal(true)
    })

    it("requires the current password to change email", async () => {
        let error: unknown
        try {
            await updateUserProfile(userId, { email: "new-email@example.test" })
        } catch (caught) {
            error = caught
        }
        expect(error).to.be.instanceOf(errors.ValidationError)

        const updated = await updateUserProfile(userId, {
            email: "  NEW-EMAIL@example.test ",
            currentPassword: "valid-test-password",
        })
        expect(updated.email).to.equal("new-email@example.test")
    })

    it("rejects attempts to edit protected account fields", async () => {
        let error: unknown
        try {
            await updateUserProfile(userId, { role: "admin" })
        } catch (caught) {
            error = caught
        }
        expect(error).to.be.instanceOf(errors.ValidationError)
        expect((await User.findById(userId))?.role).to.equal("regular")
    })

    it("stores, exposes and removes a profile photo", async () => {
        const photo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l2kAAAAASUVORK5CYII="
        const updated = await updateUserProfile(userId, { photo })
        expect(updated.photo).to.equal(photo)
        expect((await retrievePublicProfile(userId, userId)).photo).to.equal(photo)
        expect((await updateUserProfile(userId, { photo: null })).photo).to.equal(null)
        expect((await retrievePublicProfile(userId, userId)).photo).to.equal(null)
    })

    it("rejects invalid and oversized profile photos", async () => {
        for (const photo of [
            "https://example.test/photo.png",
            "data:image/png;base64,ZmFrZQ==",
            "data:image/svg+xml;base64,PHN2Zz4=",
            `data:image/png;base64,${"A".repeat(512_000)}`,
        ]) {
            let error: unknown
            try {
                await updateUserProfile(userId, { photo })
            } catch (caught) {
                error = caught
            }
            expect(error).to.be.instanceOf(errors.ValidationError)
        }
        expect((await User.findById(userId))?.photo).to.equal(null)
    })

    after(async () => {
        if (connected) await mongoose.disconnect()
    })
})
