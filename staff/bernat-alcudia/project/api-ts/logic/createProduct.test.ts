import mongoose from "mongoose"
import { createProduct } from "./createProduct.js"

mongoose.connect(process.env.MONGO_URL_TEST!)
    .then(() => {
        try {
            const images = ["https://content.nationalgeographic.com.es/medio/2022/08/07/el-sol_e26b22b0_1200x720.jpg", "https://static.nationalgeographic.es/files/styles/image_3200/public/goes-r_suvi_december_15_2019_levels-1.png?w=1600&h=900"]

            createProduct("68c2e427cbfeb33bb36e1e85", images, "suns", "suns galaxy", "galaxy", 525252512565156, "new", 5)
                .then(() => console.log("product created"))
                .catch(error => console.error(error))

        } catch (error) {
            console.error(error)
        }
    })