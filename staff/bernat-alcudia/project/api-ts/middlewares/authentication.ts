import { errors } from "com"
import { CredentialsError } from "com/errors"
import type { NextFunction, Request, Response } from "express"
import jwt, { type JwtPayload } from "jsonwebtoken"
import type { UserRole } from "../data/models.js"
import { normalizeUserRole } from "../logic/normalizeUserRole.js"

export interface AuthContext {
    userId: string
    role: UserRole
}

declare global {
    namespace Express {
        interface Request {
            auth?: AuthContext
        }
    }
}

export function verifyAccessToken(token: string, secret: string): AuthContext {
    let payload: string | JwtPayload
    try {
        payload = jwt.verify(token, secret, { algorithms: ["HS256"] })
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            throw new CredentialsError("invalid or expired token")
        }
        throw error
    }

    if (
        typeof payload !== "object" ||
        typeof payload.sub !== "string" ||
        !/^[\da-f]{24}$/i.test(payload.sub) ||
        typeof payload.role !== "string"
    ) {
        throw new CredentialsError("invalid token claims")
    }

    let role: UserRole
    try {
        role = normalizeUserRole(payload.role)
    } catch (error) {
        if (error instanceof errors.ValidationError) {
            throw new CredentialsError("invalid token claims")
        }
        throw error
    }

    return { userId: payload.sub, role }
}

export function getAuthContext(req: Request): AuthContext {
    if (!req.auth) throw new CredentialsError("authentication required")
    return req.auth
}

export function requireAuthentication(req: Request, _res: Response, next: NextFunction): void {
    const authorization = req.get("authorization")
    const match = authorization?.match(/^Bearer\s+(\S+)$/i)
    const secret = process.env.JWT_SECRET

    if (!match) {
        next(new CredentialsError("authentication required"))
        return
    }
    if (!secret) {
        next(new errors.SystemError("JWT_SECRET is not configured"))
        return
    }

    try {
        req.auth = verifyAccessToken(match[1], secret)
        next()
    } catch (error) {
        next(error)
    }
}
