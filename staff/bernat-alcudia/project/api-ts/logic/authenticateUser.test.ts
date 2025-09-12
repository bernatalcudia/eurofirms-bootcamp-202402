import mongoose from "mongoose"
import { authenticateUser } from "./authenticateUser.js"

mongoose.connect(process.env.MONGO_URL_TEST!)
    .then(() => {
        try {
            authenticateUser("prueba3", "121521522")
                .then(userId => console.log("user logged in", userId))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })