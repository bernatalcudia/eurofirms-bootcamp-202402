import mongoose from "mongoose"
import { expect } from "chai"
import { UserDocType, User } from "../data/models"
import { retrieveUser } from "./retrieveUser.js"
import { errors } from "com"

const { NotFoundError } = errors


describe("retrieveUser", () => {
    before(() => mongoose.connect(process.env.MONGO_URL_TEST!))

    beforeEach(() => User.deleteMany({}))

    it("retrieves a user", () => {
        let user: UserDocType | null, userParams: { id: string; name: string; username: string; email: string; }
        const testDate = new Date("1970-05-07")
        const testPassword = "123123123"
        const newUser = { name: "pepito", birthdate: testDate, email: "pepito@gmail.com", username: "pepito", password: testPassword }
        return User.create(newUser)
            .then((_user) => (user = _user))
            .catch(error => console.error(error))
            .then(() => retrieveUser(user?._id?.toString() as string, user?._id.toString() as string))
            .then((_userParams) => (userParams = _userParams))

            .finally(() => {
                expect(userParams).to.deep.equal({
                    id: userParams.id,
                    name: userParams.name,
                    username: userParams.username,
                    email: userParams.email
                })
            })
    })

    it("user not found", () => {
        let error: Error
        return retrieveUser("68c2ddc482b6126b82947b39", "68c2e427cbfeb33bb36e1e85")
            .catch(_error => (error = _error))
            .finally(() => {
                expect(error).to.be.an.instanceOf(NotFoundError)
                expect(error.message).to.equal("user not found")
            })
    })
    afterEach(() => User.deleteMany({}))

    after(() => mongoose.disconnect())
})


