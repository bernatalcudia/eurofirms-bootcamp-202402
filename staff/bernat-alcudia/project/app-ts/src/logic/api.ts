import SessionStorage from "react-native-session-storage"
import { errors, isUserRole, validate, utils, type UserRole } from "com"
import type { Chat, ChatSummary, Comment, Product, ProductState, User } from "../types/models"
import { executeApiRequest, type ApiRequestOptions } from "./http"

function apiUrl(path: string): string {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL
  if (!baseUrl) throw new errors.SystemError("EXPO_PUBLIC_API_URL is not configured")
  return `${baseUrl.replace(/\/+$/, "")}${path}`
}

function getToken(): string {
  const token: unknown = SessionStorage.getItem("token")
  if (typeof token !== "string") throw new TypeError("token is not a string")
  validate.token(token)
  return token
}

function authorizationHeader(): string {
  return `Bearer ${getToken()}`
}

async function request<T>(
  path: string,
  options: ApiRequestOptions & {
    authenticated?: boolean
  } = {},
): Promise<T> {
  const { authenticated = true, ...requestOptions } = options
  const authorization = authenticated ? authorizationHeader() : undefined
  return executeApiRequest<T>(apiUrl(path), requestOptions, authorization)
}

const expectedStatuses = {
  created: 201,
  ok: 200,
  noContent: 204,
} as const

function getUserId(): string {
  return utils.extractPayload(getToken()).sub
}

function getUserRole(): UserRole {
  const { role } = utils.extractPayload(getToken())
  if (isUserRole(role)) return role
  throw new errors.ValidationError("invalid user role in token")
}

export async function registerUser(
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
  await request<void>("/users/register", {
    method: "POST",
    body: { name, birthdate, email, username, password },
    authenticated: false,
    expectedStatus: expectedStatuses.created,
  })
}

export async function loginUser(username: string, password: string): Promise<void> {
  validate.username(username)
  validate.password(password)
  const token = await request<string>("/users/authenticate", {
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
  await request<void>("/products/create", {
    method: "POST",
    body: { images, title, description, brand, price, state, stock },
    expectedStatus: expectedStatuses.created,
  })
}

export async function retrieveProducts(): Promise<Product[]> {
  return request<Product[]>("/products/retrieve")
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
  await request<void>("/comments/create", {
    method: "POST",
    body: { productId, text },
    expectedStatus: expectedStatuses.created,
  })
}

export async function modifyComment(
  productId: string,
  commentId: string,
  text: string,
): Promise<void> {
  validate.id(productId, "productId")
  validate.id(commentId, "commentId")
  validate.string(text, "text")
  await request<void>(`/comments/${commentId}`, {
    method: "PATCH",
    body: { productId, text },
    expectedStatus: expectedStatuses.noContent,
  })
}

export async function removeComment(productId: string, commentId: string): Promise<void> {
  validate.id(productId, "productId")
  validate.id(commentId, "commentId")
  await request<void>(`/comments/${productId}/${commentId}`, {
    method: "DELETE",
    expectedStatus: expectedStatuses.noContent,
  })
}

export async function retrieveComments(productId: string): Promise<Comment[]> {
  validate.id(productId, "productId")
  return request<Comment[]>(`/comments/${productId}`)
}

export async function retrieveChats(): Promise<ChatSummary[]> {
  return request<ChatSummary[]>("/chats")
}

export async function startChat(productId: string): Promise<Chat> {
  validate.id(productId, "productId")
  return request<Chat>("/chats", { method: "POST", body: { productId } })
}

export async function retrieveChat(chatId: string): Promise<Chat> {
  validate.id(chatId, "chatId")
  return request<Chat>(`/chats/${chatId}`)
}

export async function sendChatMessage(chatId: string, text: string): Promise<Chat> {
  validate.id(chatId, "chatId")
  validate.string(text, "text")
  if (!text.trim() || text.trim().length > 2000) {
    throw new errors.ValidationError("message must contain 1 to 2000 characters")
  }
  return request<Chat>(`/chats/${chatId}/messages`, {
    method: "POST",
    body: { text },
    expectedStatus: expectedStatuses.created,
    parseResponse: true,
  })
}

export async function createChatOffer(chatId: string, amount: number): Promise<Chat> {
  validate.id(chatId, "chatId")
  validate.number(amount, "amount")
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new errors.ValidationError("offer must be greater than zero")
  }
  return request<Chat>(`/chats/${chatId}/offers`, {
    method: "POST",
    body: { amount },
    expectedStatus: expectedStatuses.created,
    parseResponse: true,
  })
}

export async function respondToChatOffer(
  chatId: string,
  offerId: string,
  decision: "accept" | "reject",
): Promise<Chat> {
  validate.id(chatId, "chatId")
  validate.id(offerId, "offerId")
  return request<Chat>(`/chats/${chatId}/offers/${offerId}`, {
    method: "PATCH",
    body: { decision },
  })
}
