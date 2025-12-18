import mongoose from "mongoose"
import express from "express"
import cors from "cors"
import { usersRouter } from "./routes/usersRouter"
import { productsRouter } from "./routes/productsRouter"
import { commentsRouter } from "./routes/commentsRouter"
import { errorHandler } from "./middlewares"

const { MONGO_URL, PORT } = process.env

mongoose.connect(MONGO_URL!)
    .then(() => {
        const api = express()

        api.use(cors())

        api.use("/users", usersRouter)
        api.use("/products", productsRouter)
        api.use("/comments", commentsRouter)

        api.use(errorHandler)

        api.listen(PORT, () => {
            console.log(`Server listening at http://localhost:${PORT}`)
        })
    })

