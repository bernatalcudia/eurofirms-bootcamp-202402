import { User, Product, Comment } from "../data/models.js"
import { RemoveComment } from "./types.js"
import { validate, errors } from "com"


const { SystemError, NotFoundError, OwnershipError } = errors


export const removeComment: RemoveComment = (userId: string, productId: string, commentId: string) => {
    validate.id(userId, "userId")
    validate.id(productId, "productId")
    validate.id(commentId, "commentId")

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

            return Comment.findById(commentId)
                .catch(error => { throw new SystemError(error.message) })
                .then(comment => {
                    if (!comment) throw new NotFoundError("comment not found")

                    if (comment.author.toString() !== userId) throw new OwnershipError("user not match")

                    product.commentCount--

                    return Promise.all([product.save(), Comment.deleteOne({ _id: commentId })])
                        .catch(error => { throw new SystemError(error.message) })
                })
        })
        .then(() => { })
}

