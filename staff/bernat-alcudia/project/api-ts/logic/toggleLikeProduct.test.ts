import mongoose from "mongoose"
import { toggleLikeProduct } from "./toggleLikeProduct.js"

mongoose.connect(process.env.MONGO_URL_TEST!)
    .then(() => {
        try {
            toggleLikeProduct("68c2dcd0529dcb4096f726c3", "68c424f97afc6ed5fc2c2d75")
                .then(() => console.log("product liked"))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })