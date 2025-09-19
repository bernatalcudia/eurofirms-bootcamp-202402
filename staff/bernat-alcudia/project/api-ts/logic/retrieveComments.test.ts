import mongoose from "mongoose"
import { retrieveComments } from "./retrieveComments.js"

mongoose.connect(process.env.MONGO_URL_TEST!)
    .then(() => {
        try {
            retrieveComments("68c2e427cbfeb33bb36e1e85", "68cd57cd19df9862698fc3b4")
                .then(comments => console.log("comments retrieved:", comments))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })