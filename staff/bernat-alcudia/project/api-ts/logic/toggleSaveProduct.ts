import { User, Product } from "../data/models.js"
import { ToggleSaveProduct } from "./types.js"
import { validate, errors } from "com"
import { Types } from "mongoose"

const { SystemError, NotFoundError } = errors

export const toggleSaveProduct: ToggleSaveProduct = (userId: string, productId: string) => {

    validate.id(userId, "userId")
    validate.id(productId, "productId")

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new NotFoundError("user not found")
            return Product.findById(productId)
                .catch(error => { throw new SystemError(error.message) })
                .then(product => {
                    if (!product) throw new NotFoundError("product not found")
                    const index = user.saved.findIndex(productId2 => productId2.toString() === productId)
                    if (index < 0)
                        user.saved.push(new Types.ObjectId(productId))
                    else
                        user.saved.splice(index, 1)
                    return user.save()
                        .catch(error => { throw new SystemError(error.message) })
                        .then(result => { })
                })

        })

}