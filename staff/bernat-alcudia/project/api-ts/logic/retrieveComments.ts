import { User, Product, Comment } from "../data/models.js"
import { Types } from "mongoose"
import { RetrieveComments } from "./types.js"
import { validate, errors } from "com"

const { SystemError, NotFoundError } = errors

export const retrieveComments: RetrieveComments = (userId: string, productId: string) => {
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

            return Comment.find({ product: productId }).select("-__v").populate<{ author: { _id: Types.ObjectId, username: string } }>("author", "username").sort("-date").lean()
                .catch(error => { throw new SystemError(error.message) })
        })
        .then(comments => {
            if (!comments) throw new NotFoundError("comments not found")

            return comments.map(comment => {
                const commentAuthorId = comment.author._id.toString()
                const own = commentAuthorId === userId

                return {
                    id: comment._id.toString(),
                    product: comment.product.toString(),
                    author: {
                        id: comment.author._id.toString(),
                        username: comment.author.username
                    },
                    text: comment.text,
                    date: comment.date,
                    own: own
                }
            })
        })
}