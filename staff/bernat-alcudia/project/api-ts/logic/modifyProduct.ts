import { User, Product } from "../data/models.js"
import { ModifyProduct } from "./types.js"
import { validate, errors } from "com"

const { SystemError, NotFoundError, OwnershipError } = errors

export const modifyProduct: ModifyProduct = (userId: string, productId: string, images: string[], title: string, description: string, brand: string, price: number, state: string, stock: number) => {
    validate.id(userId, "userId")
    validate.id(productId, "productId")
    validate.images(images, "images")
    validate.title(title, "title")
    validate.description(description, "description")
    validate.brand(brand, "brand")
    validate.price(price, "price")
    validate.state(state, "state")
    validate.stock(stock, "stock")

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new NotFoundError("user not found")

            return Product.findById(productId)
                .catch(error => { throw new SystemError(error.message) })
        })
        .then(product => {
            if (!product) throw new NotFoundError("product not found")

            if (product.author.toString() !== userId) throw new OwnershipError("product does not belong user")

            product.images = images
            product.title = title
            product.description = description
            product.brand = brand
            product.price = price
            product.state = state
            product.stock = stock

            return product.save()
                .catch(error => { throw new SystemError(error.message) })
                .then(result => { })
        })
}