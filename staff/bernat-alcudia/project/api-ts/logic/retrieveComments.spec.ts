import mongoose from "mongoose"
import { expect } from "chai"
import bcrypt from "bcrypt"
import { CommentType } from "./types"
import { User, UserDocType, ProductDocType, Product, CommentDocType, Comment } from "../data/models"
import { retrieveComments } from "./retrieveComments"
import { errors } from "com"

const { NotFoundError } = errors

describe("retrieveComments", () => {
    before(() => mongoose.connect(process.env.MONGO_URL_TEST!))

    beforeEach(() => Promise.all([User.deleteMany({}), Product.deleteMany({}), Comment.deleteMany({})]))

    it("retrieves comments for a product", () => {
        let user: UserDocType | null, product: ProductDocType | null, comment: CommentDocType | null, comments: CommentType[] | null

        const images = ["https://content.nationalgeographic.com.es/medio/2022/08/07/el-sol_e26b22b0_1200x720.jpg", "https://static.nationalgeographic.es/files/styles/image_3200/public/goes-r_suvi_december_15_2019_levels-1.png?w=1600&h=900"]

        return User.create({
            name: "pepito",
            birthdate: new Date("1970-05-07"),
            email: "pepito@gmail.com",
            username: "pepito",
            password: bcrypt.hashSync("123123123", 10)
        })
            .then(_user => (user = _user))
            .then(() => Product.create({
                author: user!._id.toString(),
                images: images,
                title: "suns",
                description: "suns galaxy",
                brand: "galaxy",
                price: 525252512565156,
                state: "new",
                stock: 5,
                likes: [],
            }))
            .then(_product => (product = _product))
            .then(() => Comment.create({
                author: user!._id.toString(),
                product: product!._id.toString(),
                text: "this is a comment"
            }))
            .then(_comment => (comment = _comment))
            .then(() => retrieveComments(user!._id.toString(), product!._id.toString()))
            .then(_comments => (comments = _comments))
            .finally(() => {
                expect(comments).to.exist
                expect(comments?.length).to.equal(1)
                expect(comments?.[0].text).to.equal("this is a comment")
            })
    })

    it("should retrieve empty comments for a product with no comments", () => {
        let user: UserDocType | null, product: ProductDocType | null, comments: CommentType[] | null

        const images = ["https://content.nationalgeographic.com.es/medio/2022/08/07/el-sol_e26b22b0_1200x720.jpg", "https://static.nationalgeographic.es/files/styles/image_3200/public/goes-r_suvi_december_15_2019_levels-1.png?w=1600&h=900"]

        return User.create({ name: "pepito", birthdate: new Date("1970-05-07"), email: "pepito@gmail.com", username: "pepito", password: bcrypt.hashSync("123123123", 10) })
            .then(_user => (user = _user))
            .then(() => Product.create({
                author: user!._id.toString(),
                images: images,
                title: "suns",
                description: "suns galaxy",
                brand: "galaxy",
                price: 525252512565156,
                state: "new",
                stock: 5,
                likes: [],
            }))
            .then(_product => (product = _product))
            .then(() => retrieveComments(user!._id.toString(), product!._id.toString()))
            .then(_comments => (comments = _comments))
            .finally(() => {
                expect(comments).to.exist
                expect(comments?.length).to.equal(0)
            })
    })

    it("user not found", () => {
        let error: Error
        return retrieveComments("68c2e427cbfeb33bb36e1e85", "68c2e427cbfeb33bb36e1e85")
            .catch(_error => (error = _error))
            .finally(() => {
                expect(error).to.be.an.instanceOf(NotFoundError)
                expect(error.message).to.equal("user not found")
            })
    })

    it("product not found", () => {
        let error: Error, user: UserDocType | null
        return User.create({ name: "pepito", birthdate: new Date("1970-05-07"), email: "pepito@gmail.com", username: "pepito", password: bcrypt.hashSync("123123123", 10) })
            .then(_user => (user = _user))
            .then(() => retrieveComments(user!._id.toString(), "68c2e427cbfeb33bb36e1e85"))
            .catch(_error => (error = _error))
            .finally(() => {
                expect(error).to.be.an.instanceOf(NotFoundError)
                expect(error.message).to.equal("product not found")
            })
    })

    afterEach(() => Promise.all([User.deleteMany({}), Product.deleteMany({}), Comment.deleteMany({})]))
    after(() => mongoose.disconnect())

})