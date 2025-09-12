import { User, Product } from "../data/models.js"
import { ToggleLikeProduct } from "./types.js"
import { validate, errors } from "com"
import { Types } from "mongoose"

const { SystemError, NotFoundError } = errors

export const toggleLikeProduct: ToggleLikeProduct = (userId: string, productId: string) => {
    validate.id(userId, "userId")
    validate.id(productId, "productId")

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new NotFoundError("user not found")
            return Product.findById(productId)
                .catch(error => { throw new SystemError(error.message) })
        })
        .then(product => {
            if (!product) throw new NotFoundError("product not found")

            const index = product.likes.findIndex(userId2 => userId2.toString() === userId)

            if (index < 0)
                product.likes.push(new Types.ObjectId(userId))
            else
                product.likes.splice(index, 1)

            return product.save()
                .catch(error => { throw new SystemError(error.message) })
        })
        .catch(error => { throw new SystemError(error.message) })
        .then(result => { })
}
