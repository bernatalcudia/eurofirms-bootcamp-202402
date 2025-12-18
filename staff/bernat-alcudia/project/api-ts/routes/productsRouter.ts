import express from "express"
import jwt from "jsonwebtoken"
import { logic } from "../logic/index.js"
import { jsonBodyParser } from "../middlewares/jsonBodyParser.js"

const { JWT_SECRET } = process.env

export const productsRouter = express.Router()

productsRouter.post("/create", jsonBodyParser, async (req, res, next) => {

    try {
        const { authorization } = req.headers

        const token = authorization!.slice(7)

        const { sub: userId } = jwt.verify(token, JWT_SECRET!)

        const { images, title, description, brand, prices, state, stock } = req.body

        await logic.createProduct(userId as string, images, title, description, brand, prices, state, stock)

        res.status(201).send()
    } catch (error) {
        next(error)
    }
})

productsRouter.get("/retrieve", async (req, res, next) => {

    try {
        const { authorization } = req.headers

        const token = authorization!.slice(7)

        const { sub: userId } = jwt.verify(token, JWT_SECRET!)

        const products = await logic.retrieveProducts(userId as string)

        res.status(200).json(products)
    } catch (error) {
        next(error)
    }
})

productsRouter.get("/search", async (req, res, next) => {
    try {
        const { authorization } = req.headers

        const token = authorization!.slice(7)

        const { sub: userId } = jwt.verify(token, JWT_SECRET!)

        const { query } = req.query

        const products = await logic.searchProduct(userId as string, query as string)

        res.status(200).json(products)
    } catch (error) {
        next(error)
    }
})

productsRouter.get("/:productId", async (req, res, next) => {

    try {
        const { authorization } = req.headers

        const token = authorization!.slice(7)

        const { sub: userId } = jwt.verify(token, JWT_SECRET!)

        const { productId } = req.params

        const product = await logic.retrieveProductDetails(userId as string, productId)

        res.status(200).json(product)
    } catch (error) {
        next(error)
    }
})

productsRouter.delete("/:productId", async (req, res, next) => {

    try {
        const { authorization } = req.headers

        const token = authorization!.slice(7)

        const { sub: userId } = jwt.verify(token, JWT_SECRET!)

        const { productId } = req.params

        await logic.removeProduct(userId as string, productId)

        res.status(204).send()
    } catch (error) {
        next(error)
    }
})

productsRouter.patch("/:productId", jsonBodyParser, async (req, res, next) => {

    try {
        const { authorization } = req.headers

        const token = authorization!.slice(7)

        const { sub: userId } = jwt.verify(token, JWT_SECRET!)

        const { productId } = req.params

        const { images, title, description, brand, prices, state, stock } = req.body

        await logic.modifyProduct(userId as string, productId, images, title, description, brand, prices, state, stock)

        res.status(204).send()
    } catch (error) {
        next(error)
    }
})

productsRouter.put("/:productId/likes", async (req, res, next) => {

    try {
        const { authorization } = req.headers

        const token = authorization!.slice(7)

        const { sub: userId } = jwt.verify(token, JWT_SECRET!)

        const { productId } = req.params

        await logic.toggleLikeProduct(userId as string, productId)

        res.status(204).send()
    } catch (error) {
        next(error)
    }
})

productsRouter.put("/:productId/saved", async (req, res, next) => {

    try {
        const { authorization } = req.headers

        const token = authorization!.slice(7)

        const { sub: userId } = jwt.verify(token, JWT_SECRET!)

        const { productId } = req.params

        await logic.toggleSaveProduct(userId as string, productId)

        res.status(204).send()
    } catch (error) {
        next(error)
    }
})
