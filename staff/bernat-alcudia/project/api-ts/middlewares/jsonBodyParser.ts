import { json } from "express"

export const jsonBodyParser = json({ limit: "32mb" })
export const smallJsonBodyParser = json({ limit: "16kb" })