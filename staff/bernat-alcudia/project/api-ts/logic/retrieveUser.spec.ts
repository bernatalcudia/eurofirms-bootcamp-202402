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
        let user: UserDocType | null, targetUser: UserDocType | null
        let userParams: { id: string; name: string; username: string; email: string; role: "seller" | "buyer"; saved: string[] } | null
        const testDate = new Date("1970-05-07")
        return User.create({
            name: "caller",
            birthdate: testDate,
            email: "caller@gmail.com",
            username: "caller",
            password: "123123123",
            role: "buyer",
        })
            .then((_user) => (user = _user))
            .then(() => User.create({
                name: "seller",
                birthdate: testDate,
                email: "seller@gmail.com",
                username: "seller",
                password: "123123123",
                role: "seller",
                saved: [new mongoose.Types.ObjectId()],
            }))
            .then((_user) => (targetUser = _user))
            .then(() => retrieveUser(user!._id.toString(), targetUser!._id.toString()))
            .then((_userParams) => (userParams = _userParams))
            .then(() => {
                expect(userParams).to.deep.equal({
                    id: targetUser!._id.toString(),
                    name: "seller",
                    username: "seller",
                    email: "seller@gmail.com",
                    role: "seller",
                    saved: targetUser!.saved.map(id => id.toString()),
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

