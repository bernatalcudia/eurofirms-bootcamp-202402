import { Schema, model, Types } from "mongoose"
import { USER_ROLES, type UserRole } from "com"

const { Types: { ObjectId } } = Schema


type UserDocType = {
    _id: Types.ObjectId
    name: string
    birthdate: Date
    email: string
    username: string
    password: string
    role: UserRole
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
    commentCount: number
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

type ChatMessageDocType = {
    _id: Types.ObjectId
    from: Types.ObjectId
    text: string
    date: Date
}

type ChatOfferDocType = {
    _id: Types.ObjectId
    amount: number
    offeredBy: Types.ObjectId
    status: "pending" | "accepted" | "rejected"
    date: Date
    respondedBy?: Types.ObjectId
    respondedAt?: Date
}

type ChatDocType = {
    _id: Types.ObjectId
    key: string
    product: Types.ObjectId
    participants: Types.ObjectId[]
    messages: ChatMessageDocType[]
    offers: ChatOfferDocType[]
    createdAt: Date
    updatedAt: Date
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
        enum: USER_ROLES,
        required: true,
        default: USER_ROLES[0]
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
    }],
    commentCount: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    }

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

const chatMessageSchema = new Schema<ChatMessageDocType>({
    from: {
        type: ObjectId,
        required: true,
        ref: "User"
    },
    text: {
        type: String,
        required: true,
        maxlength: 2000
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
})

const chatOfferSchema = new Schema<ChatOfferDocType>({
    amount: {
        type: Number,
        required: true,
        min: 0.01
    },
    offeredBy: {
        type: ObjectId,
        required: true,
        ref: "User"
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        required: true,
        default: "pending"
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    respondedBy: {
        type: ObjectId,
        ref: "User"
    },
    respondedAt: Date
})

const chatSchema = new Schema<ChatDocType>({
    key: {
        type: String,
        required: true,
        unique: true
    },
    product: {
        type: ObjectId,
        required: true,
        ref: "Product"
    },
    participants: [{
        type: ObjectId,
        required: true,
        ref: "User"
    }],
    messages: {
        type: [chatMessageSchema],
        default: []
    },
    offers: {
        type: [chatOfferSchema],
        default: []
    }
}, { timestamps: true })



const User = model<UserDocType>("User", userSchema)
const Product = model<ProductDocType>("Product", productSchema)
const Comment = model<CommentDocType>("Comment", commentSchema)
const Chat = model<ChatDocType>("Chat", chatSchema)

export {
    Chat,
    ChatDocType,
    ChatMessageDocType,
    ChatOfferDocType,
    UserDocType,
    ProductDocType,
    CommentDocType,

    User,
    Product,
    Comment
}

export type { UserRole }
