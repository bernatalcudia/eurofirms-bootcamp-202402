import express from "express"
import { logic } from "../logic/index.js"

export const paymentsRouter = express.Router()

paymentsRouter.post("/webhook", express.raw({ type: "application/json", limit: "32kb" }), async (req, res, next) => {
    try {
        const signature = req.header("stripe-signature")
        if (!signature || !Buffer.isBuffer(req.body)) {
            res.status(400).send()
            return
        }
        await logic.handleStripeWebhook(req.body, signature)
        res.status(200).json({ received: true })
    } catch (error) {
        next(error)
    }
})
