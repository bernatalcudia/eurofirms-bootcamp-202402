import rateLimit from "express-rate-limit"

const standardOptions = {
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "RateLimitError",
        message: "Too many requests. Please try again later.",
    },
}

export const apiRateLimiter = rateLimit({
    ...standardOptions,
    windowMs: 15 * 60 * 1000,
    limit: 300,
})

export const authenticationRateLimiter = rateLimit({
    ...standardOptions,
    windowMs: 15 * 60 * 1000,
    limit: 10,
})

export const registrationRateLimiter = rateLimit({
    ...standardOptions,
    windowMs: 60 * 60 * 1000,
    limit: 5,
})
