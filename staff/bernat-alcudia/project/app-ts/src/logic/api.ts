import SessionStorage from "react-native-session-storage"
import { errors, isUserRole, validate, utils, type UserRole } from "com"
import type { BlockedProfile, Chat, ChatSummary, Comment, Product, ProductState, PublicProfile, User } from "../types/models"
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function parseUser(value: unknown): User {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.name !== "string" ||
    typeof value.username !== "string" ||
    typeof value.email !== "string" ||
    !isUserRole(value.role) ||
    typeof value.birthdate !== "string" ||
    !Number.isFinite(Date.parse(value.birthdate)) ||
    !Array.isArray(value.saved)
    || (value.photo !== undefined && value.photo !== null && typeof value.photo !== "string")
  ) {
    throw new errors.SystemError("The server returned an invalid user profile")
  }
  const saved: string[] = []
  for (const productId of value.saved as unknown[]) {
    if (typeof productId !== "string") {
      throw new errors.SystemError("The server returned an invalid user profile")
    }
    saved.push(productId)
  }
  return {
    id: value.id,
    name: value.name,
    username: value.username,
    photo: value.photo ?? null,
    email: value.email,
    role: value.role,
    birthdate: value.birthdate,
    saved,
  }
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
  return parseUser(await request<unknown>(`/users/${getUserId()}`))
}

export async function updateUserProfile(
  profile: Pick<User, "name" | "email" | "username" | "birthdate" | "photo"> & { currentPassword?: string },
): Promise<User> {
  validate.name(profile.name.trim())
  validate.email(profile.email.trim())
  validate.username(profile.username.trim())
  if (!profile.birthdate) throw new errors.ValidationError("birthdate is required")
  validate.birthdate(profile.birthdate)
  return parseUser(await request<unknown>("/users/me/profile", {
    method: "PATCH",
    body: {
      name: profile.name.trim(),
      email: profile.email.trim(),
      username: profile.username.trim(),
      birthdate: profile.birthdate,
      ...(profile.photo !== undefined ? { photo: profile.photo } : {}),
      ...(profile.currentPassword ? { currentPassword: profile.currentPassword } : {}),
    },
  }))
}

export async function retrievePublicProfile(userId: string): Promise<PublicProfile> {
  validate.id(userId, "userId")
  const result = await request<unknown>(`/users/profiles/${userId}`)
  if (
    !isRecord(result) ||
    typeof result.id !== "string" ||
    typeof result.name !== "string" ||
    typeof result.username !== "string" ||
    typeof result.followersCount !== "number" ||
    !Number.isSafeInteger(result.followersCount) ||
    typeof result.followingCount !== "number" ||
    !Number.isSafeInteger(result.followingCount) ||
    typeof result.isFollowing !== "boolean" ||
    typeof result.isBlocked !== "boolean" ||
    (result.photo !== undefined && result.photo !== null && typeof result.photo !== "string")
  ) {
    throw new errors.SystemError("The server returned an invalid public profile")
  }
  return {
    id: result.id,
    name: result.name,
    username: result.username,
    photo: result.photo ?? null,
    followersCount: result.followersCount,
    followingCount: result.followingCount,
    isFollowing: result.isFollowing,
    isBlocked: result.isBlocked,
  }
}

export async function followUser(userId: string): Promise<void> {
  validate.id(userId, "userId")
  await request<void>(`/users/profiles/${userId}/follow`, {
    method: "POST",
    expectedStatus: expectedStatuses.noContent,
  })
}

export async function unfollowUser(userId: string): Promise<void> {
  validate.id(userId, "userId")
  await request<void>(`/users/profiles/${userId}/follow`, {
    method: "DELETE",
    expectedStatus: expectedStatuses.noContent,
  })
}

export async function blockUser(userId: string): Promise<void> {
  validate.id(userId, "userId")
  await request<void>(`/users/profiles/${userId}/block`, {
    method: "POST",
    expectedStatus: expectedStatuses.noContent,
  })
}

export async function unblockUser(userId: string): Promise<void> {
  validate.id(userId, "userId")
  await request<void>(`/users/profiles/${userId}/block`, {
    method: "DELETE",
    expectedStatus: expectedStatuses.noContent,
  })
}

export async function retrieveBlockedUsers(): Promise<BlockedProfile[]> {
  const result = await request<unknown>("/users/me/blocked")
  if (!Array.isArray(result)) {
    throw new errors.SystemError("The server returned an invalid blocked-user list")
  }
  const blockedUsers: BlockedProfile[] = []
  for (const user of result as unknown[]) {
    if (
      !isRecord(user) ||
      typeof user.id !== "string" ||
      typeof user.name !== "string" ||
      typeof user.username !== "string"
    ) {
      throw new errors.SystemError("The server returned an invalid blocked-user list")
    }
    blockedUsers.push({ id: user.id, name: user.name, username: user.username })
  }
  return blockedUsers
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

export async function createOfferCheckout(chatId: string, offerId: string): Promise<string> {
  validate.id(chatId, "chatId")
  validate.id(offerId, "offerId")
  const result = await request<unknown>(`/chats/${chatId}/offers/${offerId}/checkout`, {
    method: "POST",
  })
  if (!isRecord(result) || typeof result.url !== "string") {
    throw new errors.SystemError("The server returned an invalid checkout URL")
  }
  let checkoutUrl: URL
  try {
    checkoutUrl = new URL(result.url)
  } catch {
    throw new errors.SystemError("The server returned an invalid checkout URL")
  }
  if (checkoutUrl.protocol !== "https:" || checkoutUrl.hostname !== "checkout.stripe.com") {
    throw new errors.SystemError("The server returned an untrusted checkout URL")
  }
  return checkoutUrl.toString()
}
