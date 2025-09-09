import { User, Product, Comment } from "../data/models.js"
import { CreateComment } from "./types.js"
import { validate, errors } from "com"

const { SystemError, NotFoundError } = errors

export const createComment: CreateComment = (userId: string, productId: string, text: string) => {
    validate.id(userId, "userId")
    validate.id(productId, "productId")
    validate.text(text, "text")

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new NotFoundError("user not found")

            return Product.findById(productId)
                .catch(error => { throw new SystemError(error.message) })
        })
        .then(product => {
            if (!product) throw new NotFoundError("product not found")

            const comment = {
                product: productId,
                author: userId,
                text
            }

            product.commentCount++

            return Promise.all([product.save(), Comment.create(comment)])
                .catch(error => { throw new SystemError(error.message) })
                .then(() => { })
        })

}