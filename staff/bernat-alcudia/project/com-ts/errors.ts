class DuplicityError extends Error {
    constructor(message: string) {
        super(message)

        this.name = DuplicityError.name
    }
}

class CredentialsError extends Error {
    constructor(message: string) {
        super(message)

        this.name = CredentialsError.name
    }
}

class NotFoundError extends Error {
    constructor(message: string) {
        super(message)

        this.name = NotFoundError.name
    }
}

class SystemError extends Error {
    constructor(message: string) {
        super(message)

        this.name = SystemError.name
    }
}

class OwnershipError extends Error {
    constructor(message: string) {
        super(message)

        this.name = OwnershipError.name
    }
}

class ValidationError extends Error {
    constructor(message: string) {
        super(message)

        this.name = ValidationError.name
    }
}

class ContentError extends ValidationError {
    constructor(message: string) {
        super(message)
        this.name = ContentError.name
    }
}

class MatchError extends ValidationError {
    constructor(message: string) {
        super(message)
        this.name = MatchError.name
    }
}

export {
    DuplicityError,
    CredentialsError,
    NotFoundError,
    SystemError,
    OwnershipError,
    ValidationError,
    ContentError,
    MatchError
}