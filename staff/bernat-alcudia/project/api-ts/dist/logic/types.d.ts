type UserType = {
    id: string;
    name: string;
    email: string;
    username: string;
};
type ProductType = {
    id: string;
    author: string;
    images: string[];
    title: string;
    description: string;
    brand: string;
    price: number;
    state: string;
    stock: number;
    date: Date;
    commentCount: number;
    likeCount: number;
    liked: boolean;
    own: boolean;
};
type CommentType = {
    id: string;
    product: string;
    author: string;
    text: string;
    date: Date;
    own: boolean;
};
type RegisterUser = (name: string, birthdate: Date, email: string, username: string, password: string, role: string, saved: string[]) => Promise<void>;
type AuthenticateUser = (username: string, password: string) => Promise<{
    id: string;
    role: string;
}>;
type ChangeUserPassword = (userId: string, oldPassword: string, newPassword: string, newPasswordRepeat: string) => Promise<void>;
type RetrieveUser = (userId: string, targetUserId: string) => Promise<UserType>;
type CreateProduct = (userId: string, images: string[], title: string, description: string, brand: string, price: number, state: string, stock: number) => Promise<void>;
type RemoveProduct = (userId: string, productId: string) => Promise<void>;
type RetrieveProductDetails = (userId: string, productId: string) => Promise<ProductType>;
type RetrieveProducts = (userId: string) => Promise<ProductType[]>;
type retrieveSavedProducts = (userId: string) => Promise<ProductType[]>;
type SearchProduct = (userId: string, searchQuery: string) => Promise<ProductType[]>;
type ToggleLikeProduct = (userId: string, productId: string) => Promise<void>;
type ToggleSaveProduct = (userId: string, productId: string) => Promise<void>;
type CreateComment = (productId: string, author: string, text: string) => Promise<void>;
type ModifyComment = (userId: string, text: string) => Promise<void>;
type RemoveComment = (userId: string) => Promise<void>;
type RetrieveComments = (userId: string) => Promise<CommentType[]>;
type Logic = {
    registerUser: RegisterUser;
    authenticateUser: AuthenticateUser;
    changeUserPassword: ChangeUserPassword;
    retrieveUser: RetrieveUser;
    createProduct: CreateProduct;
    removeProduct: RemoveProduct;
    retrieveProductDetails: RetrieveProductDetails;
    retrieveProducts: RetrieveProducts;
    retrieveSavedProducts: retrieveSavedProducts;
    searchProduct: SearchProduct;
    toggleLikeProduct: ToggleLikeProduct;
    toggleSaveProduct: ToggleSaveProduct;
    createComment: CreateComment;
    modifyComment: ModifyComment;
    removeComment: RemoveComment;
    retrieveComments: RetrieveComments;
};
export { UserType, ProductType, CommentType, RegisterUser, AuthenticateUser, ChangeUserPassword, RetrieveUser, CreateProduct, RemoveProduct, RetrieveProductDetails, RetrieveProducts, retrieveSavedProducts, SearchProduct, ToggleLikeProduct, ToggleSaveProduct, CreateComment, ModifyComment, RemoveComment, RetrieveComments, Logic };
//# sourceMappingURL=types.d.ts.map