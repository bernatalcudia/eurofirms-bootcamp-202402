import mongoose from "mongoose"
import { expect } from "chai"
import bcrypt from "bcrypt"
import { User, UserDocType, ProductDocType, Product } from "../data/models"
import { removeProduct } from "./removeProduct"
import { errors } from "com"

const { NotFoundError, OwnershipError } = errors

describe("removeProduct", () => {
    before(() => mongoose.connect(process.env.MONGO_URL_TEST!))

    beforeEach(() => Promise.all([User.deleteMany({}), Product.deleteMany({})]))

    it("remove a product", () => {
        let value: void, user: UserDocType | null, product: ProductDocType | null

        const images = ["https://content.nationalgeographic.com.es/medio/2022/08/07/el-sol_e26b22b0_1200x720.jpg", "https://static.nationalgeographic.es/files/styles/image_3200/public/goes-r_suvi_december_15_2019_levels-1.png?w=1600&h=900"]

        return User.create({
            name: "pepito",
            birthdate: new Date("1970-05-07"),
            email: "pepito@gmail.com",
            username: "pepito",
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
            .then(() => removeProduct(user!._id.toString(), product!._id.toString()))
            .then(_value => (value = _value))
            .finally(() => {
                expect(value).to.be.undefined
                expect(product).to.exist
                expect(product?.images).to.deep.equal(images)
                expect(product?.title).to.equal("suns")
                expect(product?.description).to.equal("suns galaxy")
                expect(product?.brand).to.equal("galaxy")
                expect(product?.price).to.equal(525252512565156)
                expect(product?.state).to.equal("new")
                expect(product?.stock).to.equal(5)
            })

    })

    it("user not found", () => {
        let error: Error
        return removeProduct("663ccaeac792d77a1492d494", "68c2e427cbfeb33bb36e1e85")
            .catch(_error => (error = _error))
            .finally(() => {
                expect(error).to.be.an.instanceOf(NotFoundError)
                expect(error.message).to.equal("user not found")
            })
    })

    it("product not found", () => {
        let error: Error, user: UserDocType | null, product: ProductDocType | null

        const images = ["https://content.nationalgeographic.com.es/medio/2022/08/07/el-sol_e26b22b0_1200x720.jpg", "https://static.nationalgeographic.es/files/styles/image_3200/public/goes-r_suvi_december_15_2019_levels-1.png?w=1600&h=900"]

        return User.create({
            name: "pepito",
            birthdate: new Date("1970-05-07"),
            email: "pepito@gmail.com",
            username: "pepito",
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
            .then(() => removeProduct(user!._id.toString(), "68c2e427cbfeb33bb36e1e85"))
            .catch(_error => (error = _error))
            .finally(() => {
                expect(error).to.be.an.instanceOf(NotFoundError)
                expect(error.message).to.equal("product not found")
            })
    })

    it("product does not belongs to user", () => {
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
                    .then(() => removeProduct(user2!._id.toString(), product!._id.toString()))
                    .catch(_error => (error = _error))
                    .finally(() => {
                        expect(error).to.be.an.instanceOf(OwnershipError)
                        expect(error.message).to.equal("product does not belong user")
                    })
            })
    })

    afterEach(() => Promise.all([User.deleteMany({}), Product.deleteMany({})]))
    after(() => mongoose.disconnect())
})