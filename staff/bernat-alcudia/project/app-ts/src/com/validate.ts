import { ContentError, MatchError } from "./errors"
import utils from "./utils"

function assertString(value: unknown, explain: string): asserts value is string {
  if (typeof value !== "string") throw new TypeError(`${explain} is not a string`)
}

function validateString(value: unknown, explain = "string"): void {
  assertString(value, explain)
  if (value.length < 1) throw new ContentError(`${explain} is empty`)
}

function validateNumber(value: unknown, explain = "number"): void {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new TypeError(`${explain} is not a number`)
  }
}

function validateName(value: unknown): void {
  assertString(value, "name")
  if (value.length < 1) throw new ContentError("name is empty")
  if (!value.trim()) throw new ContentError("name is blank")
}

function validateBirthdate(value: unknown): void {
  assertString(value, "birthdate")
  if (value.length < 1) throw new ContentError("birthdate is empty")
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) throw new ContentError("birthdate is invalid")
  const today = new Date()
  let age = today.getFullYear() - date.getFullYear()
  const beforeBirthday =
    today.getMonth() < date.getMonth() ||
    (today.getMonth() === date.getMonth() && today.getDate() < date.getDate())
  if (beforeBirthday) age -= 1
  if (age < 18) throw new MatchError("age is lower than 18")
}

function validateUsername(value: unknown): void {
  assertString(value, "username")
  if (value.length < 1) throw new ContentError("username is empty")
  if (value.length < 3) throw new RangeError("username is lower than 3 characters")
  if (value.includes(" ")) throw new ContentError("username has a space character")
}

function validateEmail(value: unknown): void {
  assertString(value, "email")
  if (value.length < 1) throw new ContentError("email is empty")
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
    throw new ContentError("wrong email format")
  }
}

function validatePassword(value: unknown): void {
  assertString(value, "password")
  if (value.length < 1) throw new ContentError("password is empty")
  if (value.length < 8) throw new RangeError("password is lower than 8 characters")
  if (value.includes(" ")) throw new ContentError("password has space character")
}

function validateId(value: unknown, explain = "id"): void {
  assertString(value, explain)
  if (value.length < 1) throw new ContentError(`${explain} is empty`)
  if (!/^[0-9a-f]{24}$/i.test(value)) throw new ContentError(`${explain} is invalid`)
}

function validateImages(value: unknown): void {
  if (!Array.isArray(value) || !value.every((image) => typeof image === "string")) {
    throw new TypeError("images must be an array of strings")
  }
  if (!value.length) throw new MatchError("at least 1 image")
}

function validateDescription(value: unknown): void {
  if (typeof value !== "string") throw new TypeError("description is not a string")
}

function validateState(value: unknown): void {
  if (value !== "new" && value !== "used") throw new TypeError("invalid state")
}

function validateToken(value: unknown): void {
  assertString(value, "token")
  if (value.length < 1) throw new ContentError("token is empty")
  if (utils.extractPayload(value).exp <= Date.now() / 1000) {
    throw new MatchError("token expired")
  }
}

const validate = {
  string: validateString,
  number: validateNumber,
  name: validateName,
  birthdate: validateBirthdate,
  email: validateEmail,
  username: validateUsername,
  password: validatePassword,
  id: validateId,
  images: validateImages,
  description: validateDescription,
  state: validateState,
  token: validateToken,
}

export default validate
