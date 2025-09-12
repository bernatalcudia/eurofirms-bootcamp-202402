import mongoose from "mongoose"
import { toggleSaveProduct } from "./toggleSaveProduct.js"

mongoose.connect(process.env.MONGO_URL_TEST!)
    .then(() => {
        try {
            toggleSaveProduct("68c2dcd0529dcb4096f726c3", "68c424f97afc6ed5fc2c2d75")
                .then(() => console.log("product saved"))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })
