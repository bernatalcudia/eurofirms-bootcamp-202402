import mongoose from "mongoose"
import express from "express"
import cors from "cors"
import helmet from "helmet"
import { usersRouter } from "./routes/usersRouter"
import { productsRouter } from "./routes/productsRouter"
import { commentsRouter } from "./routes/commentsRouter"
import { chatsRouter } from "./routes/chatsRouter"
import { apiRateLimiter, errorHandler } from "./middlewares"

const { MONGO_URL, PORT, JWT_SECRET, CORS_ORIGINS } = process.env

function getRequiredEnvironmentVariable(name: string, value: string | undefined): string {
    if (!value) throw new Error(`${name} is not configured`)
    return value
}

async function start(): Promise<void> {
    const mongoUrl = getRequiredEnvironmentVariable("MONGO_URL", MONGO_URL)
    const jwtSecret = getRequiredEnvironmentVariable("JWT_SECRET", JWT_SECRET)
    if (Buffer.byteLength(jwtSecret, "utf8") < 32) {
        throw new Error("JWT_SECRET must be at least 32 bytes")
    }
    const port = Number(PORT ?? 9010)
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        throw new Error("PORT must be an integer between 1 and 65535")
    }

    const allowedOrigins = CORS_ORIGINS
        ? CORS_ORIGINS.split(",").map(origin => origin.trim()).filter(Boolean)
        : ["http://localhost:8081", "http://127.0.0.1:8081", "http://localhost:19006"]

    await mongoose.connect(mongoUrl)
    const api = express()

    api.disable("x-powered-by")
    if (process.env.TRUST_PROXY) {
        api.set("trust proxy", process.env.TRUST_PROXY.split(",").map(value => value.trim()))
    }
    api.use(helmet())
    api.use(cors({
        origin(origin, callback) {
            callback(null, !origin || allowedOrigins.includes(origin))
        },
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
        allowedHeaders: ["Authorization", "Content-Type"],
    }))
    api.use(apiRateLimiter)

    api.use("/users", usersRouter)
    api.use("/products", productsRouter)
    api.use("/comments", commentsRouter)
    api.use("/chats", chatsRouter)

    api.use(errorHandler)

    api.listen(port, () => {
        console.log(`Server listening at http://localhost:${port}`)
    })
}

start().catch(error => {
    console.error("API startup failed:", error)
    process.exitCode = 1
})
