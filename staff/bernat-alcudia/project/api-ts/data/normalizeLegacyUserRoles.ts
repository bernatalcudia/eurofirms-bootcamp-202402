import mongoose from "mongoose"

export async function normalizeLegacyUserRoles(): Promise<number> {
    const result = await mongoose.connection.collection("users").updateMany(
        { role: { $in: ["buyer", "seller"] } },
        { $set: { role: "regular" } },
    )
    return result.modifiedCount
}
