import base64 from "base-64"

export interface TokenPayload {
  sub: string
  role: "seller" | "buyer"
  exp: number
}

function extractPayload(token: string): TokenPayload {
  const payload = token.split(".")[1]
  if (!payload) throw new TypeError("invalid token")

  const normalized = payload.replace(/-/g, "+").replace(/_/g, "/")
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")
  const decoded: unknown = JSON.parse(base64.decode(padded))

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    !("sub" in decoded) ||
    typeof decoded.sub !== "string" ||
    !("role" in decoded) ||
    (decoded.role !== "seller" && decoded.role !== "buyer") ||
    !("exp" in decoded) ||
    typeof decoded.exp !== "number"
  ) {
    throw new TypeError("invalid token payload")
  }

  return { sub: decoded.sub, role: decoded.role, exp: decoded.exp }
}

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  return `${day}-${month}-${date.getFullYear()}`
}

const utils = { extractPayload, formatDate }
export default utils
