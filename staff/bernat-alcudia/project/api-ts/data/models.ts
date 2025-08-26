import { Schema, model, Types } from "mongoose"

const { Types: { ObjectId } } = Schema


type UserDocType = {
    _id: Types.ObjectId
    name: string
    birthdate: Date
    email: string
    username: string
    password: string
    role: string
    saved: Types.ObjectId[]
    __v: number
}

type ProductDocType = {
    _id: Types.ObjectId
    author: Types.ObjectId
    images: string[]
    title: string
    description: string
    brand: string
    price: number
    state: string
    stock: number
    date: Date
    likes: Types.ObjectId[]
    __v: number
}

type CommentDocType = {
    _id: Types.ObjectId
    product: Types.ObjectId
    author: Types.ObjectId
    text: string
    date: Date
    __v: number
}

const userSchema = new Schema<UserDocType>({
    name: {
        type: String,
        required: true
    },
    birthdate: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "regular"],
        required: true,
        default: "regular"
    },
    saved: [{
        type: Types.ObjectId,
        ref: "Product"
    }]
})

const productSchema = new Schema<ProductDocType>({
    author: {
        type: ObjectId,
        required: true,
        ref: "User"
    },
    images: {
        type: [{ type: String }],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    brand: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    state: {
        type: String,
        enum: ["used", "new"],
        required: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    likes: [{
        type: Types.ObjectId,
        ref: "User"
    }]
})

const commentSchema = new Schema<CommentDocType>({
    product: {
        type: ObjectId,
        required: true,
        ref: "Product"
    },
    author: {
        type: ObjectId,
        required: true,
        ref: "User"
    },
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
})



const User = model<UserDocType>("User", userSchema)
const Product = model<ProductDocType>("Product", productSchema)
const Comment = model<CommentDocType>("Comment", commentSchema)

export {
    UserDocType,
    ProductDocType,
    CommentDocType,

    User,
    Product,
    Comment
}

