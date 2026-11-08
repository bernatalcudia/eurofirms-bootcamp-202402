import { json } from "express"

export const jsonBodyParser = json({ limit: "14mb" })
export const smallJsonBodyParser = json({ limit: "16kb" })