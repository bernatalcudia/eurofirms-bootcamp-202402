import { z, ZodType } from "zod"
import { ValidationError } from "./errors.js"
import utils from "./utils.js"

function validatenWithSchema<T>(schema: ZodType<T>, data: unknown, explain = "data"): void {
    const result = schema.safeParse(data)
    if (result.success)
        return

    throw new ValidationError(`invalid ${explain} (${result.error?.message || "validation failed"})`)
}

const EMAIL_REGEX = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
const ID_REGEX = /^[0-9a-fA-F]{24}$/
const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/

const nameSchema = z.string().min(1, { message: "name is empty" })

const birthdateSchema = z.date().min(18, { message: "age is lower than 18" })

const usernameSchema = z.string().min(3, { message: "username is lower than 3 characters" }).refine(val => !val.includes(" "), { message: "username has a space character" })
const emailSchema = z.string().regex(EMAIL_REGEX, { message: "wrong email format" })
const passwordSchema = z.string().min(8)
const idSchema = z.string().regex(ID_REGEX, { message: "wrong id format; not a 24 character hexadecimal string" })
const urlSchema = z.string().regex(URL_REGEX, { message: "wrong url format" })
const textSchema = z.string().min(1)
const imagesSchema = z.array(z.string()
    .min(1, { message: "at least 1 image" })
    .refine(val => val.length % 4 === 0, { message: "It is not a multiple of 4" })
    .refine(val => /^[A-Za-z0-9+/]*={0,2}$/.test(val), { message: "wrong format" }))
const descriptionSchema = z.string({ message: "description is not a string" })
const titleSchema = z.string().min(1, { message: "title is empty" })
const brandSchema = z.string().min(1, { message: "brand is empty" })
const priceSchema = z.number().min(0, { message: "price is lower than 0" })
const stockSchema = z.number().min(0, { message: "stock is lower than 0" })
const stateSchema = z.enum(["new", "used"], { message: "invalid state" })
const tokenSchema = z.string().min(1, { message: "token is empty" }).refine(value => {
    const payload = utils.extractPayload(value)
    const { exp } = payload
    const now = Date.now() / 1000
    return now < exp
}, { message: "token expired" })
const roleSchema = z.enum(["regular", "admin"], { message: "invalid role" })
const searchQuerySchema = z.string().min(1, { message: "search query is empty" })


export const validate = {
    name(name: string, explain = "name") {
        validatenWithSchema(nameSchema, name, explain)
    },
    birthdate(birthdate: Date, explain = "birthdate") {
        validatenWithSchema(birthdateSchema, birthdate, explain)
    },
    username(username: string, explain = "username") {
        validatenWithSchema(usernameSchema, username, explain)
    },
    email(email: string, explain = "email") {
        validatenWithSchema(emailSchema, email, explain)
    },
    password(password: string, explain = "password") {
        validatenWithSchema(passwordSchema, password, explain)
    },
    id(id: string, explain = "id") {
        validatenWithSchema(idSchema, id, explain)
    },
    url(url: string, explain = "url") {
        validatenWithSchema(urlSchema, url, explain)
    },
    text(text: string, explain = "text") {
        validatenWithSchema(textSchema, text, explain)
    },
    images(images: string[], explain = "images") {
        validatenWithSchema(imagesSchema, images, explain)
    },
    description(description: string, explain = "description") {
        validatenWithSchema(descriptionSchema, description, explain)
    },
    title(title: string, explain = "title") {
        validatenWithSchema(titleSchema, title, explain)
    },
    brand(brand: string, explain = "brand") {
        validatenWithSchema(brandSchema, brand, explain)
    },
    price(price: number, explain = "price") {
        validatenWithSchema(priceSchema, price, explain)
    },
    stock(stock: number, explain = "stock") {
        validatenWithSchema(stockSchema, stock, explain)
    },
    state(state: string, explain = "state") {
        validatenWithSchema(stateSchema, state, explain)
    },
    token(token: string, explain = "token") {
        validatenWithSchema(tokenSchema, token, explain)
    },
    role(role: string, explain = "role") {
        validatenWithSchema(roleSchema, role, explain)
    },
    searchQuery(searchQuery: string, explain = "search query") {
        validatenWithSchema(searchQuerySchema, searchQuery, explain)
    }
}
