import mongoose from "mongoose"
import { expect } from "chai"
import bcrypt from "bcrypt"
import { User, UserDocType, ProductDocType, Product } from "../data/models"
import { toggleSaveProduct } from "./toggleSaveProduct"
import { errors } from "com"

const { NotFoundError } = errors

describe("toggleSaveProduct", () => {
    before(() => mongoose.connect(process.env.MONGO_URL_TEST!))

    beforeEach(() => Promise.all([User.deleteMany({}), Product.deleteMany({})]))
    debugger
    it("saves a product", () => {
        let user: UserDocType | null, product: ProductDocType | null, value: void
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
            .then(() => toggleSaveProduct(user!._id.toString(), product!._id.toString()))
            .then(_value => (value = _value))
            .then(() => User.findOne({}).lean())
            .then(_user => { user = _user })
            .finally(() => {
                expect(value).to.be.undefined
                expect(user).to.exist
                expect(user?.saved.length).to.equal(1)
                expect(user?.saved[0].toString()).to.equal(product!._id.toString())

            })
    })

    it("product not found", () => {
        let error: Error, user: UserDocType | null

        return User.create({ name: "pepito", birthdate: new Date("1970-05-07"), email: "pepito@gmail.com", username: "pepito", password: bcrypt.hashSync("123123123", 10) })
            .then(_user => {
                user = _user
                return toggleSaveProduct(user!._id.toString(), "68c2e427cbfeb33bb36e1e85")
                    .catch(_error => (error = _error))
                    .finally(() => {
                        expect(error).to.be.an.instanceOf(NotFoundError)
                        expect(error.message).to.equal("product not found")
                    })

            })


    })

    it("user not found", () => {
        let error: Error
        return toggleSaveProduct("663ccaeac792d77a1492d494", "68c2e427cbfeb33bb36e1e85")
            .catch(_error => (error = _error))
            .finally(() => {
                expect(error).to.be.an.instanceOf(NotFoundError)
                expect(error.message).to.equal("user not found")
            })
    })
    afterEach(() => Promise.all([User.deleteMany({}), Product.deleteMany({})]))
    after(() => mongoose.disconnect())
})