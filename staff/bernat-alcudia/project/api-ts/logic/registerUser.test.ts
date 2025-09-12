import mongoose from "mongoose"
import { registerUser } from "./registerUser.js"

mongoose.connect(process.env.MONGO_URL_TEST!)
    .then(() => {
        const testDate = new Date("1970-05-07")
        try {
            registerUser("pepito", testDate, "pepito@gmail.com", "pepito", "123123123",)
                .then(() => console.log("user registered"))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })