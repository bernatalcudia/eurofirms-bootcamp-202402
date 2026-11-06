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
