import { CredentialsError, DuplicityError, NotFoundError, OwnershipError, SystemError, ValidationError } from "com/errors"
import { NextFunction, Request, Response } from "express"

interface ErrorResponse {
    error: string
    message: string
}

export const errorHandler = (error: Error, _req: Request, res: Response<ErrorResponse>, _next: NextFunction): void => {
    let status: number = 500
    let errorName: string = SystemError.name

    const parserError = error as Error & { status?: number; type?: string }
    if (parserError.type === "entity.too.large") {
        status = 413
        errorName = "PayloadTooLargeError"
    } else if (parserError.type === "entity.parse.failed") {
        status = 400
        errorName = ValidationError.name
    } else if (error instanceof ValidationError) {
        status = 400
        errorName = ValidationError.name
    } else if (error instanceof DuplicityError) {
        status = 409
        errorName = DuplicityError.name
    } else if (error instanceof NotFoundError) {
        status = 404
        errorName = NotFoundError.name
    } else if (error instanceof CredentialsError) {
        status = 401
        errorName = CredentialsError.name
    } else if (error instanceof OwnershipError) {
        status = 403
        errorName = OwnershipError.name
    }

    if (status === 500) console.error(error)

    res.status(status).json({
        error: errorName,
        message: status === 500 ? "internal server error" : error.message,
    })
}