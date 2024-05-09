import { User, Product } from "../data/index.js";

import { validate, errors } from "com";

const { SystemError, MatchError } = errors

function createProduct(userId, images, title, description, brand, price, state, stock) {
    validate.id(userId, 'userId')
    validate.urls(images)
    validate.string(title, 'title')
    validate.description(description)
    validate.string(brand)
    validate.number(price)
    validate.state(state)
    validate.number(stock, 'stock')


    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new MatchError('user not found')

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