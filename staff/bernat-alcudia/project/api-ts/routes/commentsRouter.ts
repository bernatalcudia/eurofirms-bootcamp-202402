import express from "express"
import jwt from "jsonwebtoken"
import { logic } from "../logic/index.js"
import { jsonBodyParser } from "../middlewares/jsonBodyParser.js"

const { JWT_SECRET } = process.env

export const commentsRouter = express.Router()

commentsRouter.post("/create", jsonBodyParser, async (req, res, next) => {

    try {
        const { authorization } = req.headers

        const token = authorization!.slice(7)

        const { sub: userId } = jwt.verify(token, JWT_SECRET!)

        const { productId, text } = req.body

        await logic.createComment(userId as string, productId, text)

        res.status(201).send()
    } catch (error) {
        next(error)
    }
})

commentsRouter.patch("/:commentId", jsonBodyParser, async (req, res, next) => {

    try {
        const { authorization } = req.headers

        const token = authorization!.slice(7)

        const { sub: userId } = jwt.verify(token, JWT_SECRET!)

        const { productId } = req.body

        const { commentId } = req.params

        const { text } = req.body

        await logic.modifyComment(userId as string, productId, commentId, text)

        res.status(204).send()
    } catch (error) {
        next(error)
    }
})

commentsRouter.delete("/:productId/:commentId", async (req, res, next) => {

    try {
        const { authorization } = req.headers

        const token = authorization!.slice(7)

        const { sub: userId } = jwt.verify(token, JWT_SECRET!)

        const { productId, commentId } = req.params

        await logic.removeComment(userId as string, productId, commentId)

        res.status(204).send()
    } catch (error) {
        next(error)
    }
})

commentsRouter.get("/:productId", async (req, res, next) => {
    try {
        const { authorization } = req.headers

        const token = authorization!.slice(7)

        const { sub: userId } = jwt.verify(token, JWT_SECRET!)

        const { productId } = req.params

        const comments = await logic.retrieveComments(userId as string, productId)

        res.status(200).json(comments)
    } catch (error) {
        next(error)
    }
})
