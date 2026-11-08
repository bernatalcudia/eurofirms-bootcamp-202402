import type { UserRole } from "com"
export type { UserRole } from "com"

export type ProductState = "new" | "used"

export interface User {
  id: string
  name: string
  username: string
  email: string
  role: UserRole
  saved?: string[]
  birthdate?: string
}

export interface PublicProfile {
  id: string
  name: string
  username: string
  followersCount: number
  followingCount: number
  isFollowing: boolean
  isBlocked: boolean
}

export type BlockedProfile = Pick<PublicProfile, "id" | "name" | "username">

export interface Product {
  id: string
  author: string | { id: string; username?: string }
  images: string[]
  title: string
  description: string
  brand: string
  price: number
  state: ProductState
  stock: number
  date?: string
  likes?: string[]
  liked: boolean
  likeCount: number
  own: boolean
  commentCount?: number
}

export interface Comment {
  id: string
  product: string
  text: string
  author: string | { id: string; username: string }
  own: boolean
  date: string | Date
}

export type ChatOfferStatus = "pending" | "accepted" | "rejected"

export interface ChatMessage {
  id: string
  from: string
  text: string
  date: string
}

export interface ChatOffer {
  id: string
  amount: number
  offeredBy: string
  status: ChatOfferStatus
  date: string
  respondedBy?: string
  respondedAt?: string
  paymentStatus: "unpaid" | "creating" | "pending" | "paid" | "expired" | "failed"
}

export interface ChatSummary {
  id: string
  product: { id: string; title: string; images: string[]; price: number; sellerId: string } | null
  otherUser: { id: string; username: string }
  lastMessage: ChatMessage | null
  updatedAt: string
}

export interface Chat extends ChatSummary {
  messages: ChatMessage[]
  offers: ChatOffer[]
}
