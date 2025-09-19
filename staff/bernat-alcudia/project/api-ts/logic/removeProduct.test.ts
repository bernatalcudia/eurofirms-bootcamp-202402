import mongoose from "mongoose"
import { removeProduct } from "./removeProduct.js"

mongoose.connect(process.env.MONGO_URL_TEST!)
    .then(() => {
        try {
            removeProduct("68c2e427cbfeb33bb36e1e85", "68cd5844d85325d16db1b399")
                .then(() => console.log("product removed"))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })