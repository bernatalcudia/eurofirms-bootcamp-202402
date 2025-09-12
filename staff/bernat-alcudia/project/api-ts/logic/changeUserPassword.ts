import { User } from "../data/models.js"

import { ChangeUserPassword } from "./types.js"
import { validate, errors } from "com"
import bcrypt from "bcrypt"

const { SystemError, NotFoundError, CredentialsError, ValidationError } = errors

export const changeUserPassword: ChangeUserPassword = (userId: string, currentPassword: string, newPassword: string, newPasswordRepeat: string) => {

    validate.id(userId, "userId")
    validate.password(currentPassword, "currentPassword")
    validate.password(newPassword, "newPassword")
    validate.password(newPasswordRepeat, "newPasswordRepeat")

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new NotFoundError("user not found")
            return bcrypt.compare(currentPassword, user.password)
                .catch(error => { throw new SystemError(error.message) })
                .then(match => {
                    if (!match) throw new CredentialsError("wrong credentials")

                    if (newPassword !== newPasswordRepeat) throw new ValidationError("new password does not match password repeat")

                    return bcrypt.hash(newPassword, 10)
                        .catch(error => { throw new SystemError(error.message) })
                        .then(hashedPassword => {
                            user.password = hashedPassword

                            return user.save()
                                .catch(error => { throw new SystemError(error.message) })
                        })

                })
        })
        .then(user => { })

}
