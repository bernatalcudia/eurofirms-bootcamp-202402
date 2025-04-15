import { User, Product } from '../data/index.js';

import { validate, errors } from 'com';

const { SystemError, MatchError } = errors

//0-Validate params
//1-Find user (not user error)
//2-Create product


function createProduct(userId, images, title, description, brand, price, state, stock) {
    validate.id(userId, 'userId')
    validate.images(images)
    validate.string(title, 'title')
    validate.description(description)
    validate.string(brand, 'brand')
    validate.number(price, 'price')
    validate.state(state)
    validate.number(stock, 'stock')


    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new MatchError('user not found')
            if (user.role !== 'seller') throw new MatchError('user is not seller')


            const date = new Date()

            const product = {
                author: user._id,
                images,
                title,
                description,
                brand,
                price,
                state,
                stock,
                date
            }

            return Product.create(product)
                .catch(error => { throw new SystemError(error.message) })
        })
        .then(product => { })
}

export default createProduct