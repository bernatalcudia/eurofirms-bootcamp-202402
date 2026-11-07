export const USER_ROLES = ["regular", "admin"] as const

export type UserRole = typeof USER_ROLES[number]

export function isUserRole(value: unknown): value is UserRole {
    return value === "regular" || value === "admin"
}
