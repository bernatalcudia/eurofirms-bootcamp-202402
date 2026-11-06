import express from "express"
import { logic } from "../logic/index.js"
import { getAuthContext, requireAuthentication, smallJsonBodyParser } from "../middlewares/index.js"

export const commentsRouter = express.Router()
commentsRouter.use(requireAuthentication)

commentsRouter.post("/create", smallJsonBodyParser, async (req, res, next) => {

    try {
        const { userId } = getAuthContext(req)

        const { productId, text } = req.body

        await logic.createComment(userId, productId, text)

        res.status(201).send()
    } catch (error) {
        next(error)
    }
})

commentsRouter.patch("/:commentId", smallJsonBodyParser, async (req, res, next) => {

    try {
        const { userId } = getAuthContext(req)

        const { productId } = req.body

        const { commentId } = req.params

        const { text } = req.body

        await logic.modifyComment(userId, productId, commentId, text)

        res.status(204).send()
    } catch (error) {
        next(error)
    }
})

commentsRouter.delete("/:productId/:commentId", async (req, res, next) => {

    try {
        const { userId } = getAuthContext(req)

        const { productId, commentId } = req.params

        await logic.removeComment(userId, productId, commentId)

        res.status(204).send()
    } catch (error) {
        next(error)
    }
})

commentsRouter.get("/:productId", async (req, res, next) => {
    try {
        const { userId } = getAuthContext(req)

        const { productId } = req.params

        const comments = await logic.retrieveComments(userId, productId)

        res.status(200).json(comments)
    } catch (error) {
        next(error)
    }
})
