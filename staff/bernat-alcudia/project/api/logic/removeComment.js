import { User, Product, Comment } from '../data/index.js'

import { validate, errors } from 'com';

const { MatchError, SystemError } = errors

//0-Validate params
//1-Find user (not user error) and comment (not comment error)
//2-Delete comment

function removeComment(userId, commentId) {
    validate.id(userId, 'userId')
    validate.id(commentId, 'commentId')

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new MatchError('user not found')

            return Comment.findById(commentId)
                .catch(error => { throw new SystemError(error.message) })

        })
        .then(comment => {
            if (!comment) throw new MatchError('comment not found')

            if (comment.author.toString() !== userId) throw new MatchError('user not match')
            return Comment.deleteOne({ _id: commentId })
                .catch(error => { throw new SystemError(error.message) })
        })

        .then(() => { })
}

export default removeComment
