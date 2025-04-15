import { User, Product } from '../data/index.js';

import { validate, errors } from 'com';

const { SystemError, MatchError } = errors

//0-Validate params
//1-Find user (not user error) and product (not product error)
//2-Delete product

function removeProduct(userId, productId) {
    validate.id(userId, 'user id')
    validate.id(productId, 'product id')

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new MatchError('user not found')
            if (user.role !== 'seller') throw new MatchError('user is not seller')

            return Product.findById(productId)
                .catch(error => { throw new SystemError(error.message) })
        })
        .then(product => {
            if (!product) throw new MatchError('product not found')

            if (product.author.toString() !== userId) throw new MatchError('product does not belong user')

            return Product.deleteOne({ _id: product._id })
                .catch(error => { throw new SystemError(error.message) })

        })
        .then(() => {
            return User.updateMany({ saved: productId }, { $pull: { saved: productId } })
                .catch(error => { throw new SystemError(error.message) })

        })
        .then(result => { })
}

export default removeProduct