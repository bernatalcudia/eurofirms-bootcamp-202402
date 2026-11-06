import base64 from "base-64"
export interface TokenPayload {
    sub: string
    role: string
    exp: number
}

function extractPayload(token: string): TokenPayload {
    const payload64 = token.split(".")[1]
    if (!payload64)
        throw new TypeError("invalid token")

    const normalized = payload64.replace(/-/g, "+").replace(/_/g, "/")
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")
    const payload: unknown = JSON.parse(base64.decode(padded))

    if (
        typeof payload !== "object" ||
        payload === null ||
        !("sub" in payload) ||
        typeof payload.sub !== "string" ||
        !("role" in payload) ||
        typeof payload.role !== "string" ||
        !("exp" in payload) ||
        typeof payload.exp !== "number"
    )
        throw new TypeError("invalid token payload")

    return {
        sub: payload.sub,
        exp: payload.exp,
        role: payload.role
    }
}

function formatDate(date: Date) {
    const day = date.getDate()

    const dayToString = day < 10 ? "0" + day : day
    const month = date.getMonth() + 1
    const monthToString = month < 10 ? "0" + month : month

    const year = date.getFullYear()

    const formattedDate = `${dayToString}-${monthToString}-${year}`

    return formattedDate
}



const utils = {
    extractPayload,
    formatDate
}

export default utils