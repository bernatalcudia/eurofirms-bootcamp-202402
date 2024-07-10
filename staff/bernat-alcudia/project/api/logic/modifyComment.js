import { User, Product, Comment } from '../data/index.js'

import { validate, errors } from 'com';

const { MatchError, SystemError } = errors

function modifyComment(userId, commentId, text) {
    validate.id(userId, 'userId')
    validate.id(commentId, 'commentId')
    validate.string(text, 'text')

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new MatchError('user not found')

            return Comment.findById(commentId)
                .catch(error => { throw new SystemError(error.message) })
                .then(comment => {
                    if (!comment) throw new MatchError('comment not found')

                    comment.text = text

                    return comment.save()
                        .catch(error => { throw new SystemError(error.message) })
                })
                .then(result => { })
        })
}

export default modifyComment