import mongoose from "mongoose"
import { createComment } from "./createComment.js"

mongoose.connect(process.env.MONGO_URL_TEST!)
    .then(() => {
        try {
            const text = "hi world coders"
            createComment("68c2e427cbfeb33bb36e1e85", "68cd57cd19df9862698fc3b4", text)
                .then(() => console.log("product comment"))
                .catch(error => console.log(error.message))
        } catch (error) {
            console.error(error)
        }
    })