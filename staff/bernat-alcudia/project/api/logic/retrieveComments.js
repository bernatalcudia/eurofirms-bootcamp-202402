import { User, Product, Comment } from '../data/index.js';

import { errors, validate } from 'com';

const { MatchError, SystemError } = errors

function retrieveComments(userId, productId) {
    validate.id(userId, 'userId')
    validate.id(productId, 'productId')

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new MatchError('user not found')
            return Product.findById(productId)
                .catch(error => { throw new SystemError(error.message) })
                .then(product => {
                    if (!product) throw new MatchError('product not found')

                    return Comment.find({ product: productId }).select('-__v').populate('author', 'username').lean()
                        .catch(error => { throw new SystemError(error.message) })
                        .then(comments => {
                            if (!comments) throw new MatchError('comments not found')
                            comments.forEach(comment => {
                                if (comment._id) {
                                    comment.id = comment._id.toString()

                                    delete comment._id
                                }
                                if (comment.product) {
                                    comment.product = comment.product.toString()
                                }
                                if (comment.author._id) {
                                    comment.author.id = comment.author._id.toString()

                                    delete comment.author._id
                                }
                            })
                            return comments.reverse()
                        })
                })
        })
}

export default retrieveComments
