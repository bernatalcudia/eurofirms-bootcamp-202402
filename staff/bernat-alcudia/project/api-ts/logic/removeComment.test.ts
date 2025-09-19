import mongoose from "mongoose"
import { removeComment } from "./removeComment.js"

mongoose.connect(process.env.MONGO_URL_TEST!)
    .then(() => {
        try {
            removeComment("68c2e427cbfeb33bb36e1e85", "68cd57cd19df9862698fc3b4", "68cd5aa7b738a4b9d04816df")
                .then(() => console.log("comment deleted"))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })