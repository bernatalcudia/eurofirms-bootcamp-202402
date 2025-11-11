import mongoose from "mongoose"
import bcrypt from "bcrypt"
import { expect } from "chai"
import { UserDocType, User } from "../data/models"
import { authenticateUser } from "./authenticateUser"
import { errors } from "com"

const { NotFoundError, CredentialsError } = errors


describe("authenticateUser", () => {
    before(() => mongoose.connect(process.env.MONGO_URL_TEST!))

    beforeEach(() => User.deleteMany({}))

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

    it("user not found", () => {
        let error: Error
        return authenticateUser("pepito", "123123123")
            .catch(_error => (error = _error))
            .finally(() => {
                expect(error).to.be.an.instanceOf(NotFoundError)
                expect(error.message).to.equal("user not found")
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

