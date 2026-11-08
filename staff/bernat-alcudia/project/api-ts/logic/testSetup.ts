import { MongoMemoryReplSet } from "mongodb-memory-server"

let mongo: MongoMemoryReplSet | undefined

export const mochaHooks = {
    beforeAll: async function (this: Mocha.Context) {
        this.timeout(120000)
        mongo = await MongoMemoryReplSet.create({
            replSet: { count: 1 },
        })
        process.env.MONGO_URL_TEST = mongo.getUri("bonita-test")
    },
    afterAll: async function () {
        await mongo?.stop()
    },
}
