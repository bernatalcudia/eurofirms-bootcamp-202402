import { Logic } from "./types.js"

import { registerUser } from "./registerUser.js"
import { authenticateUser } from "./authenticateUser.js"
import { changeUserPassword } from "./changeUserPassword.js"
import { retrieveUser } from "./retrieveUser.js"
import { createProduct } from "./createProduct.js"
import { removeProduct } from "./removeProduct.js"
import { retrieveProductDetails } from "./retrieveProductDetails.js"
import { retrieveProducts } from "./retrieveProducts.js"
import { retrieveSavedProducts } from "./retrieveSavedProducts.js"
import { searchProduct } from "./searchProduct.js"
import { toggleLikeProduct } from "./toggleLikeProduct.js"
import { toggleSaveProduct } from "./toggleSaveProduct.js"
import { createComment } from "./createComment.js"
import { modifyComment } from "./modifyComment.js"
import { removeComment } from "./removeComment.js"
import { retrieveComments } from "./retrieveComments.js"



export const logic: Logic = {
    registerUser, authenticateUser, changeUserPassword, retrieveUser,
    createProduct, removeProduct, retrieveProductDetails, retrieveProducts, retrieveSavedProducts, searchProduct, toggleLikeProduct, toggleSaveProduct,
    createComment, modifyComment, removeComment, retrieveComments
}

