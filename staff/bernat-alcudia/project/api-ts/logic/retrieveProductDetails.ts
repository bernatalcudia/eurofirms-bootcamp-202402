import { User, Product } from "../data/models.js"
import { RetrieveProductDetails } from "./types.js"
import { validate, errors } from "com"

const { SystemError, NotFoundError } = errors

export const retrieveProductDetails: RetrieveProductDetails = (userId: string, productId: string) => {
    validate.id(userId, "userId")
    validate.id(productId, "productId")

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new NotFoundError("user not found")

            return Product.findById(productId).select("images date  title state price stock brand description").populate("author", "username").lean()
                .catch(error => { throw new SystemError(error.message) })
                .then(product => {
                    if (!product) throw new NotFoundError("product not found")

                    const productAuthorId = product.author._id.toString()
                    const liked = product.likes.some(like => like.toString() === userId)
                    const own = productAuthorId === userId

                    return {
                        id: product._id.toString(),
                        author: product.author.toString(),
                        images: product.images,
                        date: product.date,
                        title: product.title,
                        state: product.state,
                        price: product.price,
                        stock: product.stock,
                        brand: product.brand,
                        description: product.description,
                        commentCount: product.commentCount,
                        likeCount: product.likes.length,
                        own: own,
                        liked: liked
                    }
                })
        })
}