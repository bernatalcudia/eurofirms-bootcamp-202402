import mongoose from "mongoose"
import { changeUserPassword } from "./changeUserPassword.js"

mongoose.connect(process.env.MONGO_URL_TEST!)
try {
    changeUserPassword("68c2e427cbfeb33bb36e1e85", "234234234", "123123123", "123123123")
        .then(() => console.log("password changed"))
        .catch(error => console.error(error))
} catch (error) {
    console.error(error)
}