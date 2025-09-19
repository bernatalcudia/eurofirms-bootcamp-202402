import mongoose from "mongoose"
import { modifyComment } from "./modifyComment.js"

mongoose.connect(process.env.MONGO_URL_TEST!)
    .then(() => {
        try {
            const text = "hi world"
            modifyComment("68c2e427cbfeb33bb36e1e85", "68cd57cd19df9862698fc3b4", "68cd5aa7b738a4b9d04816df", text)
                .then(() => console.log("comment modified"))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })