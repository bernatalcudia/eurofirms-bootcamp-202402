import mongoose from "mongoose"
import { retrieveProducts } from "./retrieveProducts.js"

mongoose.connect(process.env.MONGO_URL_TEST!)
    .then(() => {
        try {
            retrieveProducts("68c2e427cbfeb33bb36e1e85")
                .then(products => console.log("products retrieved", products))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })