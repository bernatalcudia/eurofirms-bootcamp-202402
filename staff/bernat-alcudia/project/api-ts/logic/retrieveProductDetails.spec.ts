import mongoose from "mongoose"
import { expect } from "chai"
import bcrypt from "bcrypt"
import { User, UserDocType, ProductDocType, Product, Comment, CommentDocType } from "../data/models"
import { retrieveProductDetails } from "./retrieveProductDetails"
import { errors } from "com"

const { NotFoundError } = errors

describe("retrieveProductDetails", () => {
    before(() => mongoose.connect(process.env.MONGO_URL_TEST!))

    beforeEach(() => Promise.all([User.deleteMany({}), Product.deleteMany({}), Comment.deleteMany({})]))

    it("retrieves a product details", () => {
        let product: ProductDocType | null, user: UserDocType | null, productParams: { id: string; name: string; description: string; price: number; image: string; }, comments: CommentDocType[] | null

        const testPassword = "123123123"
        const images = ["https://content.nationalgeographic.com.es/medio/2022/08/07/el-sol_e26b22b0_1200x720.jpg", "https://static.nationalgeographic.es/files/styles/image_3200/public/goes-r_suvi_december_15_2019_levels-1.png?w=1600&h=900"]
        const newUser = { name: "pepito", birthdate: new Date("1970-05-07"), email: "pepito@gmail.com", username: "pepito", password: testPassword }

        return User.create(newUser)
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
                    stock: 5,
                    date: new Date()
                })
            })
            .then(_product => {
                product = _product
                return Comment.create({
                    author: user!._id.toString(),
                    product: product!._id.toString(),
                    text: "this is a comment"
                })

            })
            .then(() => retrieveProductDetails(user!._id.toString(), product!._id.toString()))
            .then(result => {
                expect(result).to.deep.equal({
                    id: product!._id.toString(),
                    author: product!.author.toString(),
                    images,
                    date: product!.date,
                    state: "new",
                    title: "suns",
                    price: 525252512565156,
                    stock: 5,
                    brand: "galaxy",
                    description: "suns galaxy",
                    commentCount: 1,
                    likeCount: 0,
                    own: true,
                    liked: product!.likes.some(like => like.toString() === user!._id.toString())
                })

            })
    })

    it("user not found", () => {
        let error: Error

        return retrieveProductDetails("663ccaeac792d77a1492d494", "68c2e427cbfeb33bb36e1e85")
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
            .then(() => retrieveProductDetails(user!._id.toString(), "68c2e427cbfeb33bb36e1e85"))
            .catch(_error => (error = _error))
            .finally(() => {
                expect(error).to.be.an.instanceOf(NotFoundError)
                expect(error.message).to.equal("product not found")
            })
    })

    afterEach(() => Promise.all([User.deleteMany({}), Product.deleteMany({}), Comment.deleteMany({})]))

    after(() => mongoose.disconnect())

})