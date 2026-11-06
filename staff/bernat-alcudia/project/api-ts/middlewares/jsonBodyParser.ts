import { json } from "express"

export const jsonBodyParser = json({ limit: "50mb" })