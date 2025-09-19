import { User, Product } from "../data/models.js"
import { RetrieveProducts } from "./types.js"
import { validate, errors } from "com"

const { SystemError, NotFoundError } = errors

export const retrieveProducts: RetrieveProducts = (userId: string) => {
    validate.id(userId, "userId")

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new NotFoundError("user not found")

            return Product.find().select("-__v").populate("author", "username").sort("-date").lean()
                .catch(error => { throw new SystemError(error.message) })
                .then(products => {
                    if (!products) throw new NotFoundError("products not found")


                    return products.map(product => {
                        const productAuthorId = product.author._id.toString()
                        const liked = product.likes.some(like => like.toString() === userId)
                        const own = productAuthorId === userId
                        const likeCount = product.likes.length

                        return {
                            id: product._id.toString(),
                            author: product.author.toString(),
                            images: product.images,
                            title: product.title,
                            description: product.description,
                            brand: product.brand,
                            price: product.price,
                            state: product.state,
                            stock: product.stock,
                            date: product.date,
                            commentCount: product.commentCount,
                            likeCount,
                            own,
                            liked
                        }
                    })
                })

        })
}