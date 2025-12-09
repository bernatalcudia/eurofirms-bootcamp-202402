import mongoose from "mongoose"
import { expect } from "chai"
import bcrypt from "bcrypt"
import { User, UserDocType, ProductDocType, Product, CommentDocType, Comment } from "../data/models"
import { removeComment } from "./removeComment"
import { errors } from "com"
import { modifyComment } from "./modifyComment"
import { OwnershipError } from "com/errors"

const { NotFoundError } = errors

describe("removeComment", () => {
    before(() => mongoose.connect(process.env.MONGO_URL_TEST!))

    beforeEach(() => Comment.deleteMany({}))


    it("removes a comment", () => {
        let user: UserDocType | null, product: ProductDocType | null, comment: CommentDocType | null, value: void

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
            .then(() => removeComment(user!._id.toString(), product!._id.toString(), comment!._id.toString()))
            .then(_value => (value = _value))
            .finally(() => {
                expect(value).to.be.undefined
                expect(comment).to.exist
                expect(comment?.author.toString()).to.equal(user!._id.toString())
                expect(comment?.product.toString()).to.equal(product!._id.toString())
                expect(comment?.text).to.equal("this is a comment")
            })
    })

    it("comment not found", () => {
        let error: Error, user: UserDocType | null, product: ProductDocType | null

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
            .then(() => removeComment(user!._id.toString(), product!._id.toString(), "68c2e427cbfeb33bb36e1e85"))
            .catch(_error => (error = _error))
            .finally(() => {
                expect(error).to.be.an.instanceOf(NotFoundError)
                expect(error.message).to.equal("comment not found")

            })
    })

    it("product not found", () => {
        let error: Error, user: UserDocType | null
        return User.create({ name: "pepito", birthdate: new Date("1970-05-07"), email: "pepito@gmail.com", username: "pepito", password: bcrypt.hashSync("123123123", 10) })
            .then(_user => (user = _user))
            .then(() => removeComment(user!._id.toString(), "68c2e427cbfeb33bb36e1e85", "68c2e427cbfeb33bb36e1e85"))
            .catch(_error => (error = _error))
            .finally(() => {
                expect(error).to.be.an.instanceOf(NotFoundError)
                expect(error.message).to.equal("product not found")
            })
    })

    it("user not found", () => {
        let error: Error
        return removeComment("663ccaeac792d77a1492d494", "68c2e427cbfeb33bb36e1e85", "68c2e427cbfeb33bb36e1e85")
            .catch(_error => (error = _error))
            .finally(() => {
                expect(error).to.be.an.instanceOf(NotFoundError)
                expect(error.message).to.equal("user not found")
            })
    })

    it("comment does not belongs to user", () => {
        let error: Error, user: UserDocType | null, product: ProductDocType | null, user2: UserDocType | null

        const images = ["https://content.nationalgeographic.com.es/medio/2022/08/07/el-sol_e26b22b0_1200x720.jpg", "https://static.nationalgeographic.es/files/styles/image_3200/public/goes-r_suvi_december_15_2019_levels-1.png?w=1600&h=900"]

        return User.create({
            name: "pepito",
            birthdate: new Date("1970-05-07"),
            email: "pepito@gmail.com",
            username: "pepito",
            password: bcrypt.hashSync("123123123", 10)
        })
            .then(_user2 => {
                user2 = _user2

                return User.create({
                    name: "campanilla",
                    birthdate: new Date("1970-05-07"),
                    email: "campanilla@gmail.com",
                    username: "campanilla",
                    password: bcrypt.hashSync("123123123", 10)
                })
                    .then(_user => {
                        user = _user
                        return Product.create({
                            author: user._id.toString(),
                            images,
                            title: "suns",
                            description: "suns galaxy",
                            brand: "galaxy",
                            price: 525252512565156,
                            state: "new",
                            stock: 5
                        })
                    })
                    .then(_product => (product = _product!))
                    .then(() => Comment.create({
                        author: user2!._id.toString(),
                        product: product!._id.toString(),
                        text: "this is a comment"
                    }))
                    .then(_comment => removeComment(user2!._id.toString(), product!._id.toString(), _comment._id.toString()))
                    .catch(_error => (error = _error))
                    .finally(() => {
                        expect(error).to.be.an.instanceOf(OwnershipError)
                        expect(error.message).to.equal("product does not belong user")
                    })
            })
    })

    it("user not match", () => {
        let error: Error, user: UserDocType | null, product: ProductDocType | null, user2: UserDocType | null

        const images = ["https://content.nationalgeographic.com.es/medio/2022/08/07/el-sol_e26b22b0_1200x720.jpg", "https://static.nationalgeographic.es/files/styles/image_3200/public/goes-r_suvi_december_15_2019_levels-1.png?w=1600&h=900"]

        return User.create({
            name: "pepito",
            birthdate: new Date("1970-05-07"),
            email: "pepito@gmail.com",
            username: "pepito",
            password: bcrypt.hashSync("123123123", 10)
        })
            .then(_user2 => {
                user2 = _user2

                return User.create({
                    name: "campanilla",
                    birthdate: new Date("1970-05-07"),
                    email: "campanilla@gmail.com",
                    username: "campanilla",
                    password: bcrypt.hashSync("123123123", 10)
                })
                    .then(_user => {
                        user = _user
                        return Product.create({
                            author: user._id.toString(),
                            images,
                            title: "suns",
                            description: "suns galaxy",
                            brand: "galaxy",
                            price: 525252512565156,
                            state: "new",
                            stock: 5
                        })
                    })
                    .then(_product => (product = _product!))
                    .then(() => Comment.create({
                        author: user2!._id.toString(),
                        product: product!._id.toString(),
                        text: "this is a comment"
                    }))
                    .then(_comment => removeComment(user!._id.toString(), product!._id.toString(), _comment._id.toString()))
                    .catch(_error => (error = _error))
                    .finally(() => {
                        expect(error).to.be.an.instanceOf(OwnershipError)
                        expect(error.message).to.equal("user not match")
                    })
            })
    })

    after(() => mongoose.disconnect())

    afterEach(() => Comment.deleteMany({}))
})

