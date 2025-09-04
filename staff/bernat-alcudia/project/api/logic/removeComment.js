import { User, Product, Comment } from '../data/index.js'

import { validate, errors } from 'com';

const { MatchError, SystemError } = errors

//0-Validate params
//1-Find user (not user error) and comment (not comment error)
//2-Delete comment

function removeComment(userId, productId, commentId) {
    validate.id(userId, 'userId')
    validate.id(commentId, 'commentId')

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new MatchError('user not found')

            return Product.findById(productId)
                .catch(error => { throw new SystemError(error.message) })
        })
        .then(product => {
            if (!product) throw new MatchError('product not found')

            if (product.author.toString() !== userId) throw new MatchError('product does not belong user')

            return Comment.findById(commentId)
                .catch(error => { throw new SystemError(error.message) })
                .then(comment => {
                    if (!comment) throw new MatchError('comment not found')

                    if (comment.author.toString() !== userId) throw new MatchError('user not match')

                    product.commentCount--

                    return Promise.all([product.save(), Comment.deleteOne({ _id: commentId })])
                        .catch(error => { throw new SystemError(error.message) })
                })
        })

        .then(() => { })
}

export default removeComment
