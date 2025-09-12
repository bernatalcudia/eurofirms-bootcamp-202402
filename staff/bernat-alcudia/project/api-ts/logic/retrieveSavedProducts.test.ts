import mongoose from "mongoose"
import { retrieveSavedProducts } from "./retrieveSavedProducts.js"

mongoose.connect(process.env.MONGO_URL_TEST!)
    .then(() => {
        try {
            retrieveSavedProducts("68c2dcd0529dcb4096f726c3")
                .then(() => console.log("products retrieved"))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })