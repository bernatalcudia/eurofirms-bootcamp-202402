import SessionStorage from "react-native-session-storage"
import { errors, validate, utils } from "com"
import type { Comment, Product, ProductState, User, UserRole } from "../types/models"

interface ApiErrorBody {
  error?: string
  message?: string
}

const expectedStatuses = {
  created: 201,
  ok: 200,
  noContent: 204,
} as const

function apiUrl(path: string): string {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL
  if (!baseUrl) throw new errors.SystemError("EXPO_PUBLIC_API_URL is not configured")
  return `${baseUrl.replace(/\/+$/, "")}${path}`
}

function authorizationHeader(): string {
  const token: unknown = SessionStorage.getItem("token")
  if (typeof token !== "string") throw new TypeError("token is not a string")
  validate.token(token)
  return `Bearer ${token}`
}

function getError(message: string, name?: string): Error {
  if (name === "TypeError") return new TypeError(message)
  if (name === "RangeError") return new RangeError(message)
  if (name && Object.prototype.hasOwnProperty.call(errors, name)) {
    const ErrorConstructor = errors[name as keyof typeof errors]
    return new ErrorConstructor(message)
  }
  return new errors.SystemError(message)
}

async function readError(response: Response): Promise<never> {
  let body: unknown
  try {
    body = await response.json()
  } catch {
    throw new errors.SystemError(`Request failed with status ${response.status}`)
  }

  if (
    typeof body === "object" &&
    body !== null &&
    "message" in body &&
    typeof body.message === "string"
  ) {
    const name =
      "error" in body && typeof body.error === "string" ? body.error : undefined
    throw getError(body.message, name)
  }
  throw new errors.SystemError(`Request failed with status ${response.status}`)
}

async function request<T>(
  path: string,
  options: {
    method?: string
    body?: unknown
    authenticated?: boolean
    expectedStatus?: number
  } = {},
): Promise<T> {
  const {
    method = "GET",
    body,
    authenticated = true,
    expectedStatus = expectedStatuses.ok,
  } = options
  const headers: Record<string, string> = {}
  if (body !== undefined) headers["Content-Type"] = "application/json"
  if (authenticated) headers.Authorization = authorizationHeader()

  let response: Response
  try {
    response = await fetch(apiUrl(path), {
      method,
      headers,
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    })
  } catch (error) {
    throw new errors.SystemError(
      error instanceof Error ? error.message : "Network request failed",
    )
  }

  if (response.status !== expectedStatus) return readError(response)
  if (response.status === 204 || expectedStatus === expectedStatuses.created) {
    return undefined as T
  }
  try {
    return (await response.json()) as T
  } catch (error) {
    throw new errors.SystemError(
      error instanceof Error ? error.message : "Invalid server response",
    )
  }
}

function getUserId(): string {
  const token: unknown = SessionStorage.getItem("token")
  if (typeof token !== "string") throw new TypeError("token is not a string")
  validate.token(token)
  return utils.extractPayload(token).sub
}

function getUserRole(): UserRole {
  const token: unknown = SessionStorage.getItem("token")
  if (typeof token !== "string") throw new TypeError("token is not a string")
  validate.token(token)
  const { role } = utils.extractPayload(token)
  if (role !== "seller" && role !== "buyer") {
    throw new errors.ValidationError("invalid user role in token")
  }
  return role
}

export async function registerBuyer(
  name: string,
  birthdate: string,
  email: string,
  username: string,
  password: string,
): Promise<void> {
  validate.name(name)
  validate.birthdate(birthdate)
  validate.email(email)
  validate.username(username)
  validate.password(password)
  await request<void>("/users/buyers", {
    method: "POST",
    body: { name, birthdate, email, username, password },
    authenticated: false,
    expectedStatus: expectedStatuses.created,
  })
}

export async function registerSeller(
  name: string,
  birthdate: string,
  email: string,
  username: string,
  password: string,
): Promise<void> {
  validate.name(name)
  validate.birthdate(birthdate)
  validate.email(email)
  validate.username(username)
  validate.password(password)
  await request<void>("/users/sellers", {
    method: "POST",
    body: { name, birthdate, email, username, password },
    authenticated: false,
    expectedStatus: expectedStatuses.created,
  })
}

export async function loginUser(username: string, password: string): Promise<void> {
  validate.username(username)
  validate.password(password)
  const token = await request<string>("/users/auth", {
    method: "POST",
    body: { username, password },
    authenticated: false,
  })
  if (typeof token !== "string" || !token) {
    throw new errors.SystemError("The server returned an invalid token")
  }
  SessionStorage.setItem("token", token)
}

export async function retrieveUser(): Promise<User> {
  return request<User>(`/users/${getUserId()}`)
}

export function logoutUser(): void {
  SessionStorage.removeItem("token")
}

export function getLoggedInUserId(): string {
  return getUserId()
}

export function getLoggedInUserRole(): UserRole {
  return getUserRole()
}

export function isUserLoggedIn(): boolean {
  return Boolean(SessionStorage.getItem("token"))
}

export async function changeUserPassword(
  currentPassword: string,
  newPassword: string,
  newPasswordRepeat: string,
): Promise<void> {
  validate.password(currentPassword)
  validate.password(newPassword)
  validate.password(newPasswordRepeat)
  await request<void>("/users/password", {
    method: "PATCH",
    body: { currentPassword, newPassword, newPasswordRepeat },
    expectedStatus: expectedStatuses.noContent,
  })
}

export async function createProduct(
  images: string[],
  title: string,
  description: string,
  brand: string,
  price: number,
  state: ProductState,
  stock: number,
): Promise<void> {
  validate.images(images)
  validate.string(title, "title")
  validate.description(description)
  validate.string(brand, "brand")
  validate.number(price, "price")
  validate.state(state)
  validate.number(stock, "stock")
  await request<void>("/products", {
    method: "POST",
    body: { images, title, description, brand, price, state, stock },
    expectedStatus: expectedStatuses.created,
  })
}

export async function retrieveProducts(): Promise<Product[]> {
  return request<Product[]>("/products")
}

export async function retrieveProductDetails(productId: string): Promise<Product> {
  validate.id(productId, "productId")
  return request<Product>(`/products/${productId}`)
}

export async function removeProduct(productId: string): Promise<void> {
  validate.id(productId, "productId")
  await request<void>(`/products/${productId}`, {
    method: "DELETE",
    expectedStatus: expectedStatuses.noContent,
  })
}

export async function modifyProduct(
  productId: string,
  images: string[],
  title: string,
  description: string,
  brand: string,
  price: number,
  state: ProductState,
  stock: number,
): Promise<void> {
  validate.id(productId, "productId")
  validate.images(images)
  validate.string(title, "title")
  validate.description(description)
  validate.string(brand, "brand")
  validate.number(price, "price")
  validate.state(state)
  validate.number(stock, "stock")
  await request<void>(`/products/${productId}`, {
    method: "PATCH",
    body: { images, title, description, brand, price, state, stock },
    expectedStatus: expectedStatuses.noContent,
  })
}

export async function toggleLikeProduct(productId: string): Promise<void> {
  validate.id(productId, "productId")
  await request<void>(`/products/${productId}/likes`, {
    method: "PUT",
    expectedStatus: expectedStatuses.noContent,
  })
}

export async function toggleSavedProduct(productId: string): Promise<void> {
  validate.id(productId, "productId")
  await request<void>(`/products/${productId}/saved`, {
    method: "PUT",
    expectedStatus: expectedStatuses.noContent,
  })
}

export async function retrieveUserProductSaved(): Promise<Product[]> {
  return request<Product[]>(`/products/${getUserId()}/saved`)
}

export async function searchProducts(searchQuery: string): Promise<Product[]> {
  validate.string(searchQuery, "query")
  return request<Product[]>(`/products/search?query=${encodeURIComponent(searchQuery)}`)
}

export async function createComment(productId: string, text: string): Promise<void> {
  validate.id(productId, "productId")
  validate.string(text, "text")
  await request<void>("/comments", {
    method: "POST",
    body: { productId, text },
    expectedStatus: expectedStatuses.created,
  })
}

export async function modifyComment(commentId: string, text: string): Promise<void> {
  validate.id(commentId, "commentId")
  validate.string(text, "text")
  await request<void>(`/comments/${commentId}`, {
    method: "PATCH",
    body: { text },
    expectedStatus: expectedStatuses.noContent,
  })
}

export async function removeComment(commentId: string): Promise<void> {
  validate.id(commentId, "commentId")
  await request<void>(`/comments/${commentId}`, {
    method: "DELETE",
    expectedStatus: expectedStatuses.noContent,
  })
}

export async function retrieveComments(productId: string): Promise<Comment[]> {
  validate.id(productId, "productId")
  return request<Comment[]>(`/comments/${productId}`)
}
