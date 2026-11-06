import express from "express"
import jwt from "jsonwebtoken"
import { logic } from "../logic/index.js"
import {
    authenticationRateLimiter,
    getAuthContext,
    registrationRateLimiter,
    requireAuthentication,
    smallJsonBodyParser,
} from "../middlewares/index.js"
import { errors } from "com"

const { JWT_SECRET } = process.env

export const usersRouter = express.Router()

usersRouter.post("/register", registrationRateLimiter, smallJsonBodyParser, async (req, res, next) => {
    try {
        const { name, birthdate, email, username, password } = req.body

        await logic.registerUser(name, birthdate, email, username, password)

        res.status(201).send()
    } catch (error) {
        next(error)
    }
})

usersRouter.post("/authenticate", authenticationRateLimiter, smallJsonBodyParser, async (req, res, next) => {
    try {
        const { username, password } = req.body

        const user = await logic.authenticateUser(username, password)

        if (!user) {
            res.status(401).send()
            return
        }

        const token = jwt.sign(
            { sub: user.id, role: user.role },
            JWT_SECRET!,
            { algorithm: "HS256", expiresIn: "60m" },
        )


        res.status(200).json(token)
    } catch (error) {
        next(error)
    }
})

usersRouter.get("/:targetUserid", requireAuthentication, async (req, res, next) => {

    try {
        const { userId, role } = getAuthContext(req)

        const { targetUserid } = req.params
        if (targetUserid !== userId && role !== "admin") {
            throw new errors.OwnershipError("not allowed to access this user")
        }

        const user = await logic.retrieveUser(userId, targetUserid)

        if (!user) {
            res.status(404).send()
            return
        }

        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
})

usersRouter.patch("/password", requireAuthentication, smallJsonBodyParser, async (req, res, next) => {

    try {
        const { userId } = getAuthContext(req)

        const { currentPassword, newPassword, newPasswordRepeat } = req.body

        await logic.changeUserPassword(userId, currentPassword, newPassword, newPasswordRepeat)

        res.status(204).send()
    } catch (error) {
        next(error)
    }
})