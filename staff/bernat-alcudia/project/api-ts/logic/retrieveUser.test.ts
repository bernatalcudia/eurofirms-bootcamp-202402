import mongoose from "mongoose"
import { retrieveUser } from "./retrieveUser.js"

mongoose.connect(process.env.MONGO_URL_TEST!)
    .then(() => {
        try {
            retrieveUser("68c2ddc482b6126b82947b39", "68c2e427cbfeb33bb36e1e85")
                .then(() => console.log("user retrieved"))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })