import express from "express"
import jwt from "jsonwebtoken"
import { logic } from "../logic/index.js"
import { jsonBodyParser } from "../middlewares/jsonBodyParser.js"

const { JWT_SECRET } = process.env

export const usersRouter = express.Router()

usersRouter.post("/register", jsonBodyParser, async (req, res, next) => {
    try {
        const { name, birthdate, email, username, password } = req.body

        await logic.registerUser(name, birthdate, email, username, password)

        res.status(201).send()
    } catch (error) {
        next(error)
    }
})

usersRouter.post("/authenticate", jsonBodyParser, async (req, res, next) => {
    try {
        const { username, password } = req.body

        const user = await logic.authenticateUser(username, password)

        if (!user) {
            res.status(401).send()
            return
        }

        const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET!, { expiresIn: "60m" })


        res.status(200).json(token)
    } catch (error) {
        next(error)
    }
})

usersRouter.get("/:targetUserid", async (req, res, next) => {

    try {
        const { authorization } = req.headers

        const token = authorization!.slice(7)

        const { sub: userId } = jwt.verify(token, JWT_SECRET!)

        const { targetUserid } = req.params

        const user = await logic.retrieveUser(userId as string, targetUserid)

        if (!user) {
            res.status(404).send()
            return
        }

        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
})

usersRouter.patch("/password", jsonBodyParser, async (req, res, next) => {

    try {
        const { authorization } = req.headers

        const token = authorization!.slice(7)

        const { sub: userId } = jwt.verify(token, JWT_SECRET!)

        const { currentPassword, newPassword, newPasswordRepeat } = req.body

        await logic.changeUserPassword(userId as string, currentPassword, newPassword, newPasswordRepeat)

        res.status(204).send()
    } catch (error) {
        next(error)
    }
})