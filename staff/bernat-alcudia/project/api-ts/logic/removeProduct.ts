import { User, Product } from "../data/models.js"
import { RemoveProduct } from "./types.js"
import { validate, errors } from "com"

const { SystemError, NotFoundError, OwnershipError } = errors

export const removeProduct: RemoveProduct = (userId: string, productId: string) => {

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

            if (product.author.toString() !== userId) throw new OwnershipError("product does not belong user")

            return Product.deleteOne({ _id: product._id })
                .catch(error => { throw new SystemError(error.message) })
        })
        .then(() => {
            return User.updateMany({ saved: productId }, { $pull: { saved: productId } })
                .catch(error => { throw new SystemError(error.message) })
                .then(result => { })
        })
}
