import { User, Product, Comment } from "../data/models.js"
import { ModifyComment } from "./types.js"
import { validate, errors } from "com"

const { SystemError, NotFoundError } = errors

export const modifyComment: ModifyComment = (userId: string, productId: string, commentId: string, text: string) => {
    validate.id(userId, "userId")
    validate.id(commentId, "commentId")
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

            return Comment.findById(commentId)
                .catch(error => { throw new SystemError(error.message) })
        })
        .then(comment => {
            if (!comment) throw new NotFoundError("comment not found")

            comment.text = text

            return comment.save()
                .catch(error => { throw new SystemError(error.message) })
        })
        .then(result => { })
}

