import mongoose from "mongoose"
import { expect } from "chai"
import bcrypt from "bcrypt"
import { User, UserDocType, ProductDocType, Product } from "../data/models"
import { createProduct } from "./createProduct"
import { errors } from "com"

const { NotFoundError } = errors

describe("createProduct", () => {
    before(() => mongoose.connect(process.env.MONGO_URL_TEST!))



    beforeEach(() => Promise.all([User.deleteMany({}), Product.deleteMany({})]))

    it("creates a product", () => {
        let value: void, user: UserDocType | null, product: ProductDocType | null
        const testDate = new Date("1970-05-07")
        const images = ["https://content.nationalgeographic.com.es/medio/2022/08/07/el-sol_e26b22b0_1200x720.jpg", "https://static.nationalgeographic.es/files/styles/image_3200/public/goes-r_suvi_december_15_2019_levels-1.png?w=1600&h=900"]

        return User.create({ name: "pepito", birthdate: testDate, email: "pepito@gmail.com", username: "pepito", password: bcrypt.hashSync("123123123", 10) })
            .then(_user => {
                user = _user
                return createProduct(user._id.toString(), images, "suns", "suns galaxy", "galaxy", 525252512565156, "new", 5)
            })
            .then(_value => (value = _value))
            .then(() => Product.findOne({}).lean())
            .then(_product => (product = _product!))
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

        return createProduct("663ccaeac792d77a1492d494", ["https://content.nationalgeographic.com.es/medio/2022/08/07/el-sol_e26b22b0_1200x720.jpg", "https://static.nationalgeographic.es/files/styles/image_3200/public/goes-r_suvi_december_15_2019_levels-1.png?w=1600&h=900"], "suns", "suns galaxy", "galaxy", 525252512565156, "new", 5)
            .catch(_error => (error = _error))
            .finally(() => {
                expect(error).to.be.an.instanceOf(NotFoundError)
                expect(error.message).to.equal("user not found")
            })

    })
    afterEach(() => Promise.all([User.deleteMany({}), Product.deleteMany({})]))

    after(() => mongoose.disconnect())

})