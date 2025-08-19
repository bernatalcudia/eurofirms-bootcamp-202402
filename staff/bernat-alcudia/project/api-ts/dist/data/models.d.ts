import { Types } from "mongoose";
type UserDocType = {
    _id: Types.ObjectId;
    name: string;
    birthdate: Date;
    email: string;
    username: string;
    password: string;
    role: string;
    saved: Types.ObjectId[];
    __v: number;
};
type ProductDocType = {
    _id: Types.ObjectId;
    author: Types.ObjectId;
    images: string[];
    title: string;
    description: string;
    brand: string;
    price: number;
    state: string;
    stock: number;
    date: Date;
    likes: Types.ObjectId[];
    __v: number;
};
type CommentDocType = {
    _id: Types.ObjectId;
    product: Types.ObjectId;
    author: Types.ObjectId;
    text: string;
    date: Date;
    __v: number;
};
declare const User: import("mongoose").Model<UserDocType, {}, {}, {}, import("mongoose").Document<unknown, {}, UserDocType, {}, {}> & UserDocType & Required<{
    _id: Types.ObjectId;
}>, any>;
declare const Product: import("mongoose").Model<ProductDocType, {}, {}, {}, import("mongoose").Document<unknown, {}, ProductDocType, {}, {}> & ProductDocType & Required<{
    _id: Types.ObjectId;
}>, any>;
declare const Comment: import("mongoose").Model<CommentDocType, {}, {}, {}, import("mongoose").Document<unknown, {}, CommentDocType, {}, {}> & CommentDocType & Required<{
    _id: Types.ObjectId;
}>, any>;
export type { UserDocType, ProductDocType, CommentDocType, User, Product, Comment };
//# sourceMappingURL=models.d.ts.map