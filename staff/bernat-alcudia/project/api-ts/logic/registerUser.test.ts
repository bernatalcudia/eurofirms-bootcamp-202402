import mongoose from "mongoose"
import { User } from "../data/models.js"
import { registerUser } from "./registerUser.js"

async function testRegisterUser(): Promise<void> {
    const username = `test-${Date.now()}`
    await mongoose.connect(process.env.MONGO_URL_TEST!)

    try {
        await registerUser("Test user", new Date("1970-05-07"), `${username}@example.com`, username, "123123123")
        console.log("user registered")
    } finally {
        await User.deleteOne({ username })
        await mongoose.disconnect()
    }
}

testRegisterUser().catch(error => {
    console.error(error)
    process.exitCode = 1
})