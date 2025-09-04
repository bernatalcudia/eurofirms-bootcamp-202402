import { Schema, model, Types } from "mongoose";
const { Types: { ObjectId } } = Schema;
const userSchema = new Schema({
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
});
const productSchema = new Schema({
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
        min: 0,
        default: 0
    }
});
const commentSchema = new Schema({
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
});
const User = model("User", userSchema);
const Product = model("Product", productSchema);
const Comment = model("Comment", commentSchema);
export { User, Product, Comment };
//# sourceMappingURL=models.js.map