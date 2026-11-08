
import { User } from "../data/models.js"
import { RetrieveUser } from "./types.js"
import { validate, errors } from "com"

const { SystemError, NotFoundError } = errors

export const retrieveUser: RetrieveUser = (userId: string, targetUserId: string) => {
    validate.id(userId, "userId")
    validate.id(targetUserId, "targetUserId")

    return User.findById(targetUserId).select("name username email role saved birthdate").lean()
        .catch(error => { throw new SystemError(error.message) })
        .then(targetUser => {
            if (!targetUser) throw new NotFoundError("user not found")


            return {
                id: targetUser._id.toString(),
                name: targetUser.name,
                username: targetUser.username,
                email: targetUser.email,
                role: targetUser.role,
                saved: targetUser.saved.map(productId => productId.toString()),
                birthdate: targetUser.birthdate,
            }
        })
}