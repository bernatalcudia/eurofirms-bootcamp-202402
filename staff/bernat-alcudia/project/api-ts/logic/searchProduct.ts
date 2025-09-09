import { User, Product } from "../data/models.js"
import { SearchProduct } from "./types.js"
import { validate, errors } from "com"

const { SystemError, NotFoundError } = errors

export const searchProduct: SearchProduct = (userId: string, searchQuery: string) => {
    validate.id(userId, "userId")
    validate.searchQuery(searchQuery, "searchQuery")

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new NotFoundError("user not found")

            return Product.find({ "title": { "$regex": searchQuery, "$options": "i" } }).select("-__v").populate("author", "username").lean()
                .catch(error => { throw new SystemError(error.message) })
                .then(product => {
                    if (!product) { throw new NotFoundError("product not found") }


                    return product.map(product => {
                        const productAuthorId = product.author._id.toString()
                        const liked = product.likes.some(like => like.toString() === userId)
                        const own = productAuthorId === userId

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
                            likes: product.likes.map(like => like.toString()),
                            likeCount: product.likes.length,
                            commentCount: product.commentCount,
                            own: own,
                            liked: liked
                        }
                    })

                })
        })
}
