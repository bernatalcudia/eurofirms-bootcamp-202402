import { Schema, model, Types } from "mongoose"

const { ObjectId } = Types

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
        enum: ["buyer", "seller"],
        required: true
    },
    saved: [{
        type: ObjectId,
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
        type: [String],
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
        type: ObjectId,
        ref: "User"
    }]
})



const User = model<UserDocType>("User", userSchema)
const Product = model<ProductDocType>("Product", productSchema)

export {
    UserDocType,
    ProductDocType,

    User,
    Product
}

