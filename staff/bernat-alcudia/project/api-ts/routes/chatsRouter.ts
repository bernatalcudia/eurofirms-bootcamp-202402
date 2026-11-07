import express from "express"
import { logic } from "../logic/index.js"
import { getAuthContext, requireAuthentication, smallJsonBodyParser } from "../middlewares/index.js"

export const chatsRouter = express.Router()
chatsRouter.use(requireAuthentication)

chatsRouter.get("/", async (req, res, next) => {
    try {
        const { userId } = getAuthContext(req)
        res.status(200).json(await logic.retrieveChats(userId))
    } catch (error) {
        next(error)
    }
})

chatsRouter.post("/", smallJsonBodyParser, async (req, res, next) => {
    try {
        const { userId } = getAuthContext(req)
        res.status(200).json(await logic.startChat(userId, req.body.productId))
    } catch (error) {
        next(error)
    }
})

chatsRouter.get("/:chatId", async (req, res, next) => {
    try {
        const { userId } = getAuthContext(req)
        res.status(200).json(await logic.retrieveChat(userId, req.params.chatId))
    } catch (error) {
        next(error)
    }
})

chatsRouter.post("/:chatId/messages", smallJsonBodyParser, async (req, res, next) => {
    try {
        const { userId } = getAuthContext(req)
        res.status(201).json(await logic.sendChatMessage(userId, req.params.chatId, req.body.text))
    } catch (error) {
        next(error)
    }
})

chatsRouter.post("/:chatId/offers", smallJsonBodyParser, async (req, res, next) => {
    try {
        const { userId } = getAuthContext(req)
        res.status(201).json(await logic.createChatOffer(userId, req.params.chatId, req.body.amount))
    } catch (error) {
        next(error)
    }
})

chatsRouter.patch("/:chatId/offers/:offerId", smallJsonBodyParser, async (req, res, next) => {
    try {
        const { userId } = getAuthContext(req)
        res.status(200).json(await logic.respondToChatOffer(
            userId,
            req.params.chatId,
            req.params.offerId,
            req.body.decision,
        ))
    } catch (error) {
        next(error)
    }
})
