import mongoose from "mongoose"
import bcrypt from "bcrypt"
import { expect } from "chai"
import { UserDocType, User } from "../data/models"
import { authenticateUser } from "./authenticateUser"
import { normalizeUserRole } from "./normalizeUserRole.js"
import { normalizeLegacyUserRoles } from "../data/normalizeLegacyUserRoles.js"
import { verifyAccessToken } from "../middlewares/authentication.js"
import jwt from "jsonwebtoken"
import { errors } from "com"

const { CredentialsError } = errors


describe("authenticateUser", () => {
    before(() => mongoose.connect(process.env.MONGO_URL_TEST!))

    beforeEach(() => User.deleteMany({}))

    it("verifies regular and admin access tokens", () => {
        const secret = "test-only-signing-secret"
        const userId = "0123456789abcdef01234567"

        for (const role of ["regular", "admin"]) {
            const token = jwt.sign({ sub: userId, role }, secret, { algorithm: "HS256" })
            expect(verifyAccessToken(token, secret)).to.deep.equal({ userId, role })
        }
    })

    it("normalizes legacy access tokens and rejects invalid tokens", () => {
        const secret = "test-only-signing-secret"
        const userId = "0123456789abcdef01234567"
        const legacyToken = jwt.sign({ sub: userId, role: "seller" }, secret)
        const expiredToken = jwt.sign({ sub: userId, role: "regular" }, secret, { expiresIn: -1 })
        const invalidClaims = jwt.sign({ sub: "not-an-id", role: "regular" }, secret)
        const invalidRole = jwt.sign({ sub: userId, role: "superuser" }, secret)
        const wrongAlgorithm = jwt.sign({ sub: userId, role: "regular" }, secret, { algorithm: "HS512" })
        const validToken = jwt.sign({ sub: userId, role: "regular" }, secret)

        expect(verifyAccessToken(legacyToken, secret)).to.deep.equal({ userId, role: "regular" })
        expect(() => verifyAccessToken("invalid", secret)).to.throw(CredentialsError)
        expect(() => verifyAccessToken(expiredToken, secret)).to.throw(CredentialsError)
        expect(() => verifyAccessToken(invalidClaims, secret)).to.throw(CredentialsError)
        expect(() => verifyAccessToken(invalidRole, secret)).to.throw(CredentialsError)
        expect(() => verifyAccessToken(wrongAlgorithm, secret)).to.throw(CredentialsError)
        expect(() => verifyAccessToken(validToken, "different-secret")).to.throw(CredentialsError)
    })

    it("authenticates a user", () => {
        let user: UserDocType | null, userId: { id: string; role: string }

        return User.create({ name: "pepito", birthdate: new Date("1970-05-07"), email: "pepito@gmail.com", username: "pepito", password: bcrypt.hashSync("123123123", 10) })
            .then(_user => (user = _user))
            .then(() => authenticateUser("pepito", "123123123"))
            .then((_userId) => { userId = _userId })
            .finally(() => {
                expect(userId).to.deep.equal({ id: user?._id.toString(), role: user?.role })
            })
    })

    it("authenticates an admin", () => {
        return User.create({
            name: "admin",
            birthdate: new Date("1970-05-07"),
            email: "admin@gmail.com",
            username: "admin",
            password: bcrypt.hashSync("123123123", 10),
            role: "admin",
        })
            .then(() => authenticateUser("admin", "123123123"))
            .then(user => expect(user.role).to.equal("admin"))
    })

    it("maps legacy roles to regular", () => {
        expect(normalizeUserRole("seller")).to.equal("regular")
        expect(normalizeUserRole("buyer")).to.equal("regular")
    })

    it("migrates persisted legacy roles before future user updates", async () => {
        const collection = mongoose.connection.collection("users")
        await collection.insertMany([
            {
                name: "legacy buyer",
                birthdate: new Date("1970-05-07"),
                email: "legacy-buyer@gmail.com",
                username: "legacy-buyer",
                password: "hashed-password",
                role: "buyer",
                saved: [],
            },
            {
                name: "legacy seller",
                birthdate: new Date("1970-05-07"),
                email: "legacy-seller@gmail.com",
                username: "legacy-seller",
                password: "hashed-password",
                role: "seller",
                saved: [],
            },
        ])

        const migratedCount = await normalizeLegacyUserRoles()
        const migratedUsers = await collection.find({
            username: { $in: ["legacy-buyer", "legacy-seller"] },
        }).toArray()

        expect(migratedCount).to.equal(2)
        expect(migratedUsers.map(user => user.role)).to.deep.equal(["regular", "regular"])
    })

    it("returns generic credentials error when user is not found", () => {
        let error: Error
        return authenticateUser("pepito", "123123123")
            .catch(_error => (error = _error))
            .finally(() => {
                expect(error).to.be.an.instanceOf(CredentialsError)
                expect(error.message).to.equal("wrong credentials")
            })
    })

    it("wrong credentials", () => {
        let error: Error
        let user: UserDocType | null

        return User.create({ name: "pepito", birthdate: new Date("1970-05-07"), email: "pepito@gmail.com", username: "pepito", password: bcrypt.hashSync("123123123", 10) })
            .then(_user => (user = _user))
            .then(() => authenticateUser("pepito", "1231231235959"))
            .catch(_error => (error = _error))
            .finally(() => {
                expect(error).to.be.an.instanceOf(CredentialsError)
                expect(error.message).to.equal("wrong credentials")
            })
    })

    after(() => mongoose.disconnect())

    afterEach(() => User.deleteMany({}))
})
