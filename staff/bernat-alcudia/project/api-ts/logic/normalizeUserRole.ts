import { errors } from "com"
import type { UserRole } from "../data/models.js"

export function normalizeUserRole(role: string): UserRole {
    if (role === "admin" || role === "regular") return role
    if (role === "seller" || role === "buyer") return "regular"

    throw new errors.ValidationError("invalid user role")
}
