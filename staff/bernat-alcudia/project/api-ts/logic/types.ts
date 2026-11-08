import type { UserRole } from "com"

type UserType = {
    id: string,
    name: string,
    email: string,
    username: string,
    role: UserRole,
    saved: string[],
    birthdate: Date
}

type PublicProfileType = {
    id: string,
    name: string,
    username: string,
    followersCount: number,
    followingCount: number,
    isFollowing: boolean,
    isBlocked: boolean
}

type BlockedProfileType = Pick<PublicProfileType, "id" | "name" | "username">

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
    author: { id: string, username: string }
    text: string
    date: Date
    own: boolean
}

type ChatMessageType = {
    id: string
    from: string
    text: string
    date: Date
}

type ChatOfferType = {
    id: string
    amount: number
    offeredBy: string
    status: "pending" | "accepted" | "rejected"
    date: Date
    respondedBy?: string
    respondedAt?: Date
    paymentStatus: "unpaid" | "creating" | "pending" | "paid" | "expired" | "failed"
}

type ChatSummaryType = {
    id: string
    product: { id: string; title: string; images: string[]; price: number; sellerId: string } | null
    otherUser: { id: string; username: string }
    lastMessage: ChatMessageType | null
    updatedAt: Date
}

type ChatType = ChatSummaryType & {
    messages: ChatMessageType[]
    offers: ChatOfferType[]
}


type RegisterUser = (name: string, birthdate: Date, email: string, username: string, password: string) => Promise<void>

type AuthenticateUser = (username: string, password: string) => Promise<{ id: string, role: UserRole }>

type ChangeUserPassword = (userId: string, oldPassword: string, newPassword: string, newPasswordRepeat: string) => Promise<void>

type RetrieveUser = (userId: string, targetUserId: string) => Promise<UserType>
type UpdateUserProfile = (userId: string, profile: unknown) => Promise<UserType>
type RetrievePublicProfile = (userId: string, targetUserId: string) => Promise<PublicProfileType>
type FollowUser = (userId: string, targetUserId: string) => Promise<void>
type UnfollowUser = (userId: string, targetUserId: string) => Promise<void>
type BlockUser = (userId: string, targetUserId: string) => Promise<void>
type UnblockUser = (userId: string, targetUserId: string) => Promise<void>
type RetrieveBlockedUsers = (userId: string) => Promise<BlockedProfileType[]>

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

type StartChat = (userId: string, productId: string) => Promise<ChatType>

type RetrieveChats = (userId: string) => Promise<ChatSummaryType[]>

type RetrieveChat = (userId: string, chatId: string) => Promise<ChatType>

type SendChatMessage = (userId: string, chatId: string, text: string) => Promise<ChatType>

type CreateChatOffer = (userId: string, chatId: string, amount: number) => Promise<ChatType>

type RespondToChatOffer = (
    userId: string,
    chatId: string,
    offerId: string,
    decision: "accept" | "reject",
) => Promise<ChatType>

type CreateOfferCheckout = (userId: string, chatId: string, offerId: string) => Promise<{ url: string }>
type HandleStripeWebhook = (rawBody: Buffer, signature: string) => Promise<void>

type Logic = {
    registerUser: RegisterUser,
    authenticateUser: AuthenticateUser,
    changeUserPassword: ChangeUserPassword,
    retrieveUser: RetrieveUser,
    updateUserProfile: UpdateUserProfile,
    retrievePublicProfile: RetrievePublicProfile,
    followUser: FollowUser,
    unfollowUser: UnfollowUser,
    blockUser: BlockUser,
    unblockUser: UnblockUser,
    retrieveBlockedUsers: RetrieveBlockedUsers,

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
    retrieveComments: RetrieveComments,

    startChat: StartChat,
    retrieveChats: RetrieveChats,
    retrieveChat: RetrieveChat,
    sendChatMessage: SendChatMessage,
    createChatOffer: CreateChatOffer,
    respondToChatOffer: RespondToChatOffer,
    createOfferCheckout: CreateOfferCheckout,
    handleStripeWebhook: HandleStripeWebhook
}

export {
    AuthenticateUser,
    ChangeUserPassword, CommentType, CreateComment, CreateProduct, Logic, ModifyComment, ModifyProduct, ProductType, RegisterUser, RemoveComment, RemoveProduct, RetrieveComments, RetrieveProductDetails,
    RetrieveProducts,
    RetrieveSavedProducts, RetrieveUser, SearchProduct,
    ToggleLikeProduct,
    ToggleSaveProduct, UserType, PublicProfileType, BlockedProfileType,
    ChatMessageType, ChatOfferType, ChatSummaryType, ChatType,
    StartChat, RetrieveChats, RetrieveChat, SendChatMessage, CreateChatOffer, RespondToChatOffer,
    UpdateUserProfile, RetrievePublicProfile, FollowUser, UnfollowUser, BlockUser, UnblockUser,
    RetrieveBlockedUsers, CreateOfferCheckout, HandleStripeWebhook
}

export type { UserRole }
