import mongoose from "mongoose"
import { expect } from "chai"
import bcrypt from "bcrypt"
import { ProductType } from "./types"
import { User, UserDocType, ProductDocType, Product } from "../data/models"
import { retrieveSavedProducts } from "./retrieveSavedProducts"
import { errors } from "com"

const { NotFoundError } = errors

describe("retrieveSavedProducts", () => {
    before(() => mongoose.connect(process.env.MONGO_URL_TEST!))

    beforeEach(() => Promise.all([User.deleteMany({}), Product.deleteMany({})]))

    it("should retrieve saved products", () => {
        let user: UserDocType | null, product: ProductDocType | null, products: ProductType[] | null

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
                images,
                title: "suns",
                description: "suns galaxy",
                brand: "galaxy",
                price: 525252512565156,
                state: "new",
                stock: 5,
                likes: [],
            }))
            .then(_product => (product = _product))
            .then(() => retrieveSavedProducts(user!._id.toString()))
            .then(_products => (products = _products))
            .then(() => {
                expect(products).to.exist
                expect(products?.length).to.equal(0)

            })
    })

    it("should retrieve empty saved products", () => {
        let user: UserDocType | null, products: ProductType[] | null
        return User.create({
            name: "pepito",
            birthdate: new Date("1970-05-07"),
            email: "pepito@gmail.com",
            username: "pepito",
            password: bcrypt.hashSync("123123123", 10)
        })
            .then(_user => (user = _user))
            .then(() => retrieveSavedProducts(user!._id.toString()))
            .then(_products => (products = _products))
            .then(() => {
                expect(products).to.exist
                expect(products?.length).to.equal(0)
            })
    })

    it("user not found", () => {
        let error: Error
        return retrieveSavedProducts("663ccaeac792d77a1492d494")
            .catch(_error => (error = _error))
            .finally(() => {
                expect(error).to.be.an.instanceOf(NotFoundError)
                expect(error.message).to.equal("user not found")
            })
    })

})
afterEach(() => Promise.all([User.deleteMany({}), Product.deleteMany({})]))
after(() => mongoose.disconnect())