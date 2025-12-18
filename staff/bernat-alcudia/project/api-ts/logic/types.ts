type UserType = {
    id: string,
    name: string,
    email: string,
    username: string
}

type ProductType = {
    id: string,
    author: string,
    images: string[],
    title: string,
    description: string,
    brand: string,
    price: number,
    state: string,
    stock: number,
    date: Date,
    commentCount: number,
    likeCount: number,
    liked: boolean,
    own: boolean
}

type CommentType = {
    id: string
    product: string
    author: string
    text: string
    date: Date
    own: boolean
}


type RegisterUser = (name: string, birthdate: Date, email: string, username: string, password: string) => Promise<void>

type AuthenticateUser = (username: string, password: string) => Promise<{ id: string, role: string }>

type ChangeUserPassword = (userId: string, oldPassword: string, newPassword: string, newPasswordRepeat: string) => Promise<void>

type RetrieveUser = (userId: string, targetUserId: string) => Promise<UserType>

type CreateProduct = (userId: string, images: string[], title: string, description: string, brand: string, price: number, state: string, stock: number) => Promise<void>

type ModifyProduct = (userId: string, productId: string, images: string[], title: string, description: string, brand: string, price: number, state: string, stock: number) => Promise<void>

type RemoveProduct = (userId: string, productId: string) => Promise<void>

type RetrieveProductDetails = (userId: string, productId: string) => Promise<ProductType>

type RetrieveProducts = (userId: string) => Promise<ProductType[]>

type RetrieveSavedProducts = (userId: string) => Promise<ProductType[]>

type SearchProduct = (userId: string, searchQuery: string) => Promise<ProductType[]>

type ToggleLikeProduct = (userId: string, productId: string) => Promise<void>

type ToggleSaveProduct = (userId: string, productId: string) => Promise<void>

type CreateComment = (userId: string, productId: string, text: string) => Promise<void>

type ModifyComment = (userId: string, productId: string, commentId: string, text: string) => Promise<void>

type RemoveComment = (userId: string, productId: string, commentId: string) => Promise<void>

type RetrieveComments = (userId: string, productId: string) => Promise<CommentType[]>

type Logic = {
    registerUser: RegisterUser,
    authenticateUser: AuthenticateUser,
    changeUserPassword: ChangeUserPassword,
    retrieveUser: RetrieveUser,

    createProduct: CreateProduct,
    modifyProduct: ModifyProduct,
    removeProduct: RemoveProduct,
    retrieveProductDetails: RetrieveProductDetails,
    retrieveProducts: RetrieveProducts,
    retrieveSavedProducts: RetrieveSavedProducts,
    searchProduct: SearchProduct,
    toggleLikeProduct: ToggleLikeProduct,
    toggleSaveProduct: ToggleSaveProduct,

    createComment: CreateComment,
    modifyComment: ModifyComment,
    removeComment: RemoveComment,
    retrieveComments: RetrieveComments
}

export {
    AuthenticateUser,
    ChangeUserPassword, CommentType, CreateComment, CreateProduct, Logic, ModifyComment, ModifyProduct, ProductType, RegisterUser, RemoveComment, RemoveProduct, RetrieveComments, RetrieveProductDetails,
    RetrieveProducts,
    RetrieveSavedProducts, RetrieveUser, SearchProduct,
    ToggleLikeProduct,
    ToggleSaveProduct, UserType
}

