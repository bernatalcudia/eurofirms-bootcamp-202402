import bcrypt from "bcrypt"
import { errors, validate } from "com"
import { User } from "../data/models.js"
import { AuthenticateUser } from "./types.js"

const { SystemError, CredentialsError } = errors

// Comparing against a fixed hash keeps response time similar for unknown usernames.
const unknownUserHash = bcrypt.hashSync("unknown-user-placeholder", 10)

export const authenticateUser: AuthenticateUser = (username: string, password: string) => {
    validate.username(username, "username")
    validate.password(password, "password")

    return User.findOne({ username })
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) {
                return bcrypt.compare(password, unknownUserHash)
                    .catch(error => { throw new SystemError(error.message) })
                    .then(() => { throw new CredentialsError("wrong credentials") })
            }

            return bcrypt.compare(password, user.password)
                .catch(error => { throw new SystemError(error.message) })
                .then(match => {
                    if (!match) throw new CredentialsError("wrong credentials")

                    return {
                        id: user.id,
                        role: user.role
                    }
                })
        })
}