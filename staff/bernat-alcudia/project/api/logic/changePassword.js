
import { User } from '../data/index.js'

import { validate, errors } from 'com'

const { SystemError, MatchError } = errors

//0-Validate params
//1-Find user
//2-Change password

function changePassword(userId, currentPassword, newPassword, newPasswordRepeat) {
    validate.id(userId, 'userId')
    validate.password(currentPassword)
    validate.password(newPassword)
    validate.password(newPasswordRepeat)

    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) throw new MatchError('user not found')
            if (currentPassword !== user.password) throw new MatchError('incorrect current password')
            if (newPassword !== newPasswordRepeat) throw new MatchError('incorrect new password type')

            user.password = newPassword

            return user.save()
                .catch(error => { throw new SystemError(error.message) })
        })
        .then(user => { })
}


export default changePassword