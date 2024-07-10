import authenticateUser from './authenticateUser.js'
import retrieveUser from './retrieveUser.js'
import registerBuyer from './registerBuyer.js'
import registerSeller from './registerSeller.js'
import createProduct from './createProduct.js'
import retrieveProductDetails from './retrieveProductDetails.js'
import retrieveProducts from './retrieveProducts.js'
import removeProduct from './removeProduct.js'
import modifyProduct from './modifyProduct.js'
import toggleLikeProduct from './toggleLikeProduct.js'
import toggleSaveProduct from './toggleSaveProduct.js'
import retrieveSavedProducts from './retrieveSavedProducts.js'
import searchProduct from './searchProduct.js'
import createComment from './createComment.js'
import modifyComment from './modifyComment.js'
import removeComment from './removeComment.js'
import retrieveComments from './retrieveComments.js'


const logic = {
    authenticateUser,
    retrieveUser,
    registerBuyer,
    registerSeller,
    retrieveProducts,
    retrieveProductDetails,
    createProduct,
    removeProduct,
    modifyProduct,
    toggleLikeProduct,
    toggleSaveProduct,
    retrieveSavedProducts,
    searchProduct,
    createComment,
    modifyComment,
    removeComment,
    retrieveComments
}

export default logic