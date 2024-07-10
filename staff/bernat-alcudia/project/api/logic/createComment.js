import { User, Product, Comment } from '../data/index.js'
import { errors, validate } from 'com'

const { SystemError, MatchError } = errors
// 0:Validate params
// 1:find user (not user error) and product (not product error)
// 2:create comment



function createComment(userId, productId, text) {
    validate.id(userId, 'userId')
    validate.id(productId, 'productId')
    validate.string(text, 'text')

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })//Error in database
        .then(user => {
            if (!user) throw new MatchError('user not found')

            return Product.findById(productId).lean()
                .catch(error => { throw new SystemError(error.message) })
                .then(product => {
                    if (!product) throw new MatchError('product not found')

                    const date = new Date()

                    const comment = {
                        product: productId,
                        author: userId,
                        text,
                        date
                    }
                    return Comment.create(comment)
                        .catch(error => { throw new SystemError(error.message) })
                        .then(comment => { })
                })
        })
}

export default createComment