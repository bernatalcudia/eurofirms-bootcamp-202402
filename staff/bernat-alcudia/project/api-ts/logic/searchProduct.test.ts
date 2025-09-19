import mongoose from "mongoose"
import { searchProduct } from "./searchProduct.js"

mongoose.connect(process.env.MONGO_URL_TEST!)
    .then(() => {
        try {
            searchProduct("68c2dcd0529dcb4096f726c3", "n")
                .then((product) => console.log("product retrieved:", product))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })