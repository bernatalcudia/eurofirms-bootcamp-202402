import express from "express"
import { logic } from "../logic/index.js"
import { getAuthContext, jsonBodyParser, requireAuthentication } from "../middlewares/index.js"

export const productsRouter = express.Router()
productsRouter.use(requireAuthentication)

productsRouter.post("/create", jsonBodyParser, async (req, res, next) => {

    try {
        const { userId } = getAuthContext(req)

        const { images, title, description, brand, price, state, stock } = req.body

        await logic.createProduct(userId, images, title, description, brand, price, state, stock)

        res.status(201).send()
    } catch (error) {
        next(error)
    }
})

productsRouter.get("/retrieve", async (req, res, next) => {

    try {
        const { userId } = getAuthContext(req)

        const products = await logic.retrieveProducts(userId)

        res.status(200).json(products)
    } catch (error) {
        next(error)
    }
})

productsRouter.get("/search", async (req, res, next) => {
    try {
        const { userId } = getAuthContext(req)

        const { query } = req.query

        const products = await logic.searchProduct(userId, query as string)

        res.status(200).json(products)
    } catch (error) {
        next(error)
    }
})

productsRouter.get("/:productId", async (req, res, next) => {

    try {
        const { userId } = getAuthContext(req)

        const { productId } = req.params

        const product = await logic.retrieveProductDetails(userId, productId)

        res.status(200).json(product)
    } catch (error) {
        next(error)
    }
})

productsRouter.delete("/:productId", async (req, res, next) => {

    try {
        const { userId } = getAuthContext(req)

        const { productId } = req.params

        await logic.removeProduct(userId, productId)

        res.status(204).send()
    } catch (error) {
        next(error)
    }
})

productsRouter.patch("/:productId", jsonBodyParser, async (req, res, next) => {

    try {
        const { userId } = getAuthContext(req)

        const { productId } = req.params

        const { images, title, description, brand, price, state, stock } = req.body

        await logic.modifyProduct(userId, productId, images, title, description, brand, price, state, stock)

        res.status(204).send()
    } catch (error) {
        next(error)
    }
})

productsRouter.put("/:productId/likes", async (req, res, next) => {

    try {
        const { userId } = getAuthContext(req)

        const { productId } = req.params

        await logic.toggleLikeProduct(userId, productId)

        res.status(204).send()
    } catch (error) {
        next(error)
    }
})

productsRouter.put("/:productId/saved", async (req, res, next) => {

    try {
        const { userId } = getAuthContext(req)

        const { productId } = req.params

        await logic.toggleSaveProduct(userId, productId)

        res.status(204).send()
    } catch (error) {
        next(error)
    }
})

productsRouter.get("/:userId/saved", async (req, res, next) => {

    try {
        const { userId } = getAuthContext(req)

        const saved = await logic.retrieveSavedProducts(userId)

        res.status(200).json(saved)
    } catch (error) {
        next(error)
    }
})
