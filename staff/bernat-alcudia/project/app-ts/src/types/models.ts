export type UserRole = "admin" | "regular"
export type ProductState = "new" | "used"

export interface User {
  id: string
  name: string
  username: string
  email: string
  role: UserRole
  saved?: string[]
}

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
}

export interface ChatSummary {
  id: string
  product: { id: string; title: string; images: string[]; price: number } | null
  otherUser: { id: string; username: string }
  lastMessage: ChatMessage | null
  updatedAt: string
}

export interface Chat extends ChatSummary {
  messages: ChatMessage[]
  offers: ChatOffer[]
}
