import mongoose from "mongoose"
import bcrypt from "bcrypt"
import { expect } from "chai"
import { UserDocType, User } from "../data/models"
import { registerUser } from "./registerUser"
import { errors } from "com"

const { DuplicityError } = errors


describe("registerUser", () => {
    before(() => mongoose.connect(process.env.MONGO_URL_TEST!))

    beforeEach(() => User.deleteMany({}))

    it("register a new user", () => {
        let value: void, user: UserDocType | null

        const testPassword = "123123123"
        return bcrypt.hash(testPassword, 10)
            .catch(error => { throw new Error(error.message) })
            .then(hashedPassword => {
                const newUser = { name: "pepito", birthdate: new Date("1970-05-07"), email: "pepito@gmail.com", username: "pepito", password: hashedPassword }
                return bcrypt.compare(testPassword, hashedPassword)
                    .catch(error => { throw new Error(error.message) })
                    .then(matchPassword => {
                        return registerUser(newUser.name, newUser.birthdate, newUser.email, newUser.username, newUser.password)
                            .then((_value) => (value = _value))
                            .then(() => User.findOne({}).lean())
                            .then((_user) => (user = _user!))
                            .finally(() => {
                                expect(value).to.be.undefined
                                expect(matchPassword).to.be.true
                                expect(user).to.exist
                                expect(user?.name).to.equal("pepito")
                                expect(user?.email).to.equal("pepito@gmail.com")
                                expect(user?.username).to.equal("pepito")
                                expect(user?.birthdate.toISOString()).to.equal(newUser.birthdate.toISOString())
                            })
                    })
            })
    })

    it("user already exists", () => {
        let error: Error

        return registerUser("pepito", new Date("1970-05-07"), "pepito@gmail.com", "pepito", "123123123")
            .then(() => registerUser("pepito", new Date("1970-05-07"), "pepito@gmail.com", "pepito", "123123123"))
            .catch(_error => (error = _error))
            .finally(() => {
                expect(error).to.be.an.instanceOf(DuplicityError)
                expect(error.message).to.equal("user already exists")
            })
    })

    afterEach(() => User.deleteMany({}))

    after(() => mongoose.disconnect())


})