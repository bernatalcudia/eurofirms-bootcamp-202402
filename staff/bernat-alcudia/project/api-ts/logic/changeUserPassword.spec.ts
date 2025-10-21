import mongoose from "mongoose"
import bcrypt from "bcrypt"
import { expect } from "chai"
import { UserDocType, User } from "../data/models"
import { changeUserPassword } from "./changeUserPassword"
import { errors } from "com"

const { NotFoundError, CredentialsError, ValidationError } = errors


describe("changeUserPassword", () => {


    before(() => mongoose.connect(process.env.MONGO_URL_TEST!))

    beforeEach(() => User.deleteMany({}))

    it("changes password", () => {
        let user: UserDocType | null
        const testDate = new Date("1970-05-07")
        const testPassword = "123123123"
        return bcrypt.hash(testPassword, 10)
            .catch(error => { throw new Error(error.message) })
            .then(hashedPassword => {
                const newUser = { name: "pepito", birthdate: testDate, email: "pepito@gmail.com", username: "pepito", password: hashedPassword }
                return bcrypt.compare(testPassword, hashedPassword)
                    .catch(error => { throw new Error(error.message) })
                    .then(matchPassword => {
                        return User.create(newUser)
                            .then(_user => (user = _user))
                            .then(() => changeUserPassword(user?._id?.toString() as string, testPassword, "234234234", "234234234"))
                            .then(() => User.findOne({}).lean())
                            .then((_user) => (user = _user!))
                            .finally(() => {
                                expect(matchPassword).to.be.true
                            })
                    })
            })
    })

    it("user not found", () => {
        let error: Error
        let user: UserDocType | null
        const testPassword = "123123123"

        return changeUserPassword("68c2e427cbfeb33bb36e1e85", testPassword, "234234234", "234234234")
            .catch(_error => (error = _error))
            .finally(() => {
                expect(error).to.be.an.instanceOf(NotFoundError)
                expect(error.message).to.equal("user not found")
            })

    })

    it("wrong credentials", () => {
        let error: Error
        let user: UserDocType | null
        const testDate = new Date("1970-05-07")
        const testPassword = "123123123"
        return bcrypt.hash(testPassword, 10)
            .catch(error => { throw new Error(error.message) })
            .then(hashedPassword => {
                const newUser = { name: "pepito", birthdate: testDate, email: "pepito@mail.com", username: "pepito", password: hashedPassword }
                return bcrypt.compare(testPassword, hashedPassword)
                    .catch(error => { throw new Error(error.message) })
                    .then(matchPassword => {
                        return User.create(newUser)
                            .then(_user => (user = _user))
                            .then(() => changeUserPassword(user?._id?.toString() as string, "12312323", "234234234", "234234234"))
                            .catch(_error => (error = _error))
                            .finally(() => {
                                expect(error).to.be.an.instanceOf(CredentialsError)
                                expect(error.message).to.equal("wrong credentials")
                            })
                    })
            })
    })

    it("new password does not match password repeat", () => {
        let error: Error
        let user: UserDocType | null
        const testDate = new Date("1970-05-07")
        return User.create({ name: "pepito", birthdate: testDate, email: "pepito@gmail.com", username: "pepito", password: bcrypt.hashSync("123123123", 10) })
            .then(_user => (user = _user))
            .then(() => changeUserPassword(user?._id?.toString() as string, "123123123", "234234234", "234234235"))
            .catch(_error => (error = _error))
            .finally(() => {
                expect(error).to.be.an.instanceOf(ValidationError)
                expect(error.message).to.equal("new password does not match password repeat")
            })
    })

    after(() => mongoose.disconnect())

    afterEach(() => User.deleteMany({}))
})



