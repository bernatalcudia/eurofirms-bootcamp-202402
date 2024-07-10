import { User, Product, Comment } from '../data/index.js'

import { validate, errors } from 'com';

const { MatchError, SystemError } = errors

function removeComment(userId, commentId) {
    validate.id(userId, 'userId')
    validate.id(commentId, 'commentId')

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new MatchError('user not found')

            return Comment.findByIdAndDelete(commentId)
                .catch(error => { throw new SystemError(error.message) })
                .then(comment => { })
        })
}

export default removeComment
