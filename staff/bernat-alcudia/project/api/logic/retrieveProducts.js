import { User, Product } from '../data/index.js';

import { validate, errors } from 'com';

const { SystemError, MatchError } = errors

//0-Validate params
//1-Find username (not user error) and product (not product error)
//2-Retrieve product

function retrieveProducts(userId) {
    validate.id(userId, 'userId')

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new MatchError('user not found')

            return Product.find().select('images title brand state likes price').populate('author', 'username').lean()
                .catch(error => { throw new SystemError(error.message) })
                .then(products => {
                    products.forEach(product => {
                        if (product._id) {
                            product.id = product._id.toString()

                            delete product._id
                        }

                        if (product.author._id) {
                            product.author.id = product.author._id.toString()

                            delete product.author._id
                        }
                        product.likes = product.likes.map(like => like.toString())
                    })

                    return products
                })
        })
}

export default retrieveProducts