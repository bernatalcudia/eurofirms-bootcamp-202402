import mongoose from "mongoose"
import { expect } from "chai"
import bcrypt from "bcrypt"
import { ProductType } from "./types"
import { User, UserDocType, ProductDocType, Product } from "../data/models"
import { searchProduct } from "./searchProduct"
import { errors } from "com"

const { NotFoundError } = errors

describe("searchProduct", () => {
    before(() => mongoose.connect(process.env.MONGO_URL_TEST!))

    beforeEach(() => Promise.all([User.deleteMany({}), Product.deleteMany({})]))

    it("searches a product", () => {
        let user: UserDocType | null, product: ProductDocType | null, products: ProductType[] | null
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
                images: ["https://content.nationalgeographic.com/es/medio/2022/08/07/el-sol_e26b22b0_1200x720.jpg"],
                title: "suns",
                description: "suns galaxy",
                brand: "galaxy",
                price: 525252512565156,
                state: "new",
                stock: 5,
                likes: [],
            }))
            .then(_product => (product = _product))
            .then(() => searchProduct(user!._id.toString(), "suns"))
            .then(_products => (products = _products))
            .finally(() => {
                expect(products).to.exist
                expect(products?.length).to.equal(1)
                expect(products![0].id).to.equal(product!._id.toString())
            })
    })

    it("searches an empty product", () => {
        let user: UserDocType | null, products: ProductType[] | null
        return User.create({
            name: "pepito",
            birthdate: new Date("1970-05-07"),
            email: "pepito@gmail.com",
            username: "pepito",
            password: bcrypt.hashSync("123123123", 10)
        })
            .then(_user => (user = _user))
            .then(() => searchProduct(user!._id.toString(), "dada"))
            .then(_products => (products = _products))
            .finally(() => {
                expect(products).to.exist
                expect(products?.length).to.equal(0)
            })
    })

    it("user not found", () => {
        let error: Error
        return searchProduct("663ccaeac792d77a1492d494", "suns")
            .catch(_error => (error = _error))
            .finally(() => {
                expect(error).to.be.an.instanceOf(NotFoundError)
                expect(error.message).to.equal("user not found")
            })
    })

})
afterEach(() => Promise.all([User.deleteMany({}), Product.deleteMany({})]))
after(() => mongoose.disconnect())

