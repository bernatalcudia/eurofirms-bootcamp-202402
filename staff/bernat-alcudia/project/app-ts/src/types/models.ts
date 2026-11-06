export type UserRole = "seller" | "buyer"
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
  author: { id: string; username?: string }
  images: string[]
  title: string
  description: string
  brand: string
  price: number
  state: ProductState
  stock: number
  date?: string
  likes: string[]
  commentCount?: number
  saved?: boolean
}

export interface Comment {
  id: string
  text: string
  author: { id: string; username: string }
  own: boolean
  date: string
}
