import { User, Product } from '../data/index.js';

import { validate, errors } from 'com';

const { SystemError, MatchError } = errors

//0-Validate params
//1-Find username (not username error) and product (not product error)
//2-Modify product


function modifyProduct(userId, productId, images, title, description, brand, price, state, stock) {
    validate.id(userId, 'userId')
    validate.id(productId, 'product id')
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
            return Product.findById(productId)
                .catch(error => { throw new SystemError(error.message) })
        })
        .then(product => {
            if (!product) throw new MatchError('product not found')


            if (product.author.toString() !== userId) throw new MatchError('product does not belong user')


            const date = new Date()

            product.date = date
            product.images = images
            product.title = title
            product.description = description
            product.brand = brand
            product.price = price
            product.state = state
            product.stock = stock

            return product.save()
                .catch(error => { throw new SystemError(error.message) })
        })
        .then(result => { })

}

export default modifyProduct