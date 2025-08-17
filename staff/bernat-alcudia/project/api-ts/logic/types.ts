type UserType = {
    id: string,
    name: string,
    birthdate: Date,
    email: string,
    username: string,
    password: string,
    role: string,
    saved: string[]
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
    likes: string[]
    owner: boolean

}

type CommentType = {
    id: string
    product: string
    author: string
    text: string
    date: Date
    owner: boolean
}


type RegisterUser = (name: string, birthdate: Date, email: string, username: string, password: string, role: string, saved: string[]) => Promise<void>

type AuthenticateUser = (username: string, password: string) => Promise<{ id: string, role: string }>

type ChangeUserPassword = (id: string, oldPassword: string, newPassword: string) => Promise<void>

type RetrieveUser = (id: string) => Promise<UserType>

type CreateProduct = (author: string, images: string[], title: string, description: string, brand: string, price: number, state: string, stock: number, date: Date, likes: string[], owner: boolean) => Promise<void>

type RemoveProduct = (id: string) => Promise<void>

type RetrieveProductDetails = (id: string) => Promise<ProductType>

type RetrieveProducts = (id: string) => Promise<ProductType[]>

type retrieveSavedProducts = (id: string) => Promise<ProductType[]>

type SearchProduct = (id: string, searchQuery: string) => Promise<ProductType[]>

type toggleLikeProduct = (id: string, productId: string) => Promise<void>

type toggleSaveProduct = (id: string, productId: string) => Promise<void>

type CreateComment = (productId: string, author: string, text: string) => Promise<void>

type ModifyComment = (id: string, text: string) => Promise<void>

type RemoveComment = (id: string) => Promise<void>

type RetrieveComments = (id: string) => Promise<CommentType[]>

type Logic = {
    registerUser: RegisterUser,
    authenticateUser: AuthenticateUser,
    changeUserPassword: ChangeUserPassword,
    retrieveUser: RetrieveUser,

    createProduct: CreateProduct,
    removeProduct: RemoveProduct,
    retrieveProductDetails: RetrieveProductDetails,
    retrieveProducts: RetrieveProducts,
    retrieveSavedProducts: retrieveSavedProducts,
    searchProduct: SearchProduct,
    toggleLikeProduct: toggleLikeProduct,
    toggleSaveProduct: toggleSaveProduct,

    createComment: CreateComment,
    modifyComment: ModifyComment,
    removeComment: RemoveComment,
    retrieveComments: RetrieveComments
}

export type {
    UserType,
    ProductType,
    CommentType,

    RegisterUser,
    AuthenticateUser,
    ChangeUserPassword,
    RetrieveUser,

    CreateProduct,
    RemoveProduct,
    RetrieveProductDetails,
    RetrieveProducts,
    retrieveSavedProducts,
    SearchProduct,
    toggleLikeProduct,
    toggleSaveProduct,

    CreateComment,
    ModifyComment,
    RemoveComment,
    RetrieveComments,

    Logic
}