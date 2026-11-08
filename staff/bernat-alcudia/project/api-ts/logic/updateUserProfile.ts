import { errors, validate } from "com"
import bcrypt from "bcrypt"
import { User } from "../data/models.js"
import type { UpdateUserProfile } from "./types.js"
import { retrieveUser } from "./retrieveUser.js"

const { DuplicityError, SystemError, ValidationError } = errors

type EditableProfile = {
    name?: string
    email?: string
    username?: string
    birthdate?: string
    photo?: string | null
}

export const updateUserProfile: UpdateUserProfile = async (userId, profile) => {
    validate.id(userId, "userId")
    if (typeof profile !== "object" || profile === null || Array.isArray(profile)) {
        throw new ValidationError("profile must be an object")
    }

    const input = profile as Record<string, unknown>
    const allowedKeys = new Set(["name", "email", "username", "birthdate", "photo", "currentPassword"])
    if (Object.keys(input).length === 0 || Object.keys(input).some(key => !allowedKeys.has(key))) {
        throw new ValidationError("profile contains no editable fields or unsupported fields")
    }

    const updates: EditableProfile = {}
    if ("photo" in input) {
        if (input.photo === null) {
            updates.photo = null
        } else {
            if (typeof input.photo !== "string" || input.photo.length > 512_000) {
                throw new ValidationError("profile photo is invalid or too large")
            }
            const match = /^data:image\/(jpeg|png);base64,([A-Za-z0-9+/]+={0,2})$/.exec(input.photo)
            if (!match || match[2].length % 4 !== 0) throw new ValidationError("invalid profile photo")
            const bytes = Buffer.from(match[2], "base64")
            const jpeg = bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
            const png = bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
            if (bytes.toString("base64") !== match[2] || (match[1] === "jpeg" ? !jpeg : !png)) {
                throw new ValidationError("invalid profile photo")
            }
            updates.photo = input.photo
        }
    }
    if ("name" in input) {
        if (typeof input.name !== "string") throw new ValidationError("name must be a string")
        const name = input.name.trim()
        validate.name(name, "name")
        updates.name = name
    }
    if ("email" in input) {
        if (typeof input.email !== "string") throw new ValidationError("email must be a string")
        const email = input.email.trim().toLowerCase()
        validate.email(email, "email")
        updates.email = email
    }
    if ("username" in input) {
        if (typeof input.username !== "string") throw new ValidationError("username must be a string")
        const username = input.username.trim()
        validate.username(username, "username")
        updates.username = username
    }
    if ("birthdate" in input) {
        if (typeof input.birthdate !== "string") throw new ValidationError("birthdate must be a string")
        validate.birthdate(input.birthdate, "birthdate")
        const birthdate = new Date(input.birthdate)
        if (!Number.isFinite(birthdate.getTime())) throw new ValidationError("invalid birthdate")
        updates.birthdate = birthdate.toISOString()
    }
    if (Object.keys(updates).length === 0) {
        throw new ValidationError("at least one editable field is required")
    }

    if (updates.email) {
        const currentUser = await User.findById(userId).select("email password")
            .catch(error => { throw new SystemError(error.message) })
        if (!currentUser) throw new errors.NotFoundError("user not found")
        if (updates.email !== currentUser.email.toLowerCase()) {
            if (typeof input.currentPassword !== "string") {
                throw new ValidationError("current password is required to change email")
            }
            const passwordMatches = await bcrypt.compare(input.currentPassword, currentUser.password)
                .catch(error => { throw new SystemError(error.message) })
            if (!passwordMatches) throw new ValidationError("current password is incorrect")
        }
    }

    try {
        await User.findByIdAndUpdate(userId, { $set: updates }, { runValidators: true })
    } catch (error) {
        if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
            throw new DuplicityError("email or username is already in use")
        }
        throw new SystemError(error instanceof Error ? error.message : "profile update failed")
    }

    return retrieveUser(userId, userId)
}
