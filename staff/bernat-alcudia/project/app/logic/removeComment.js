import { validate, error, errors } from '../com';
import SessionStorage from 'react-native-session-storage';

const { SystemError } = errors

function removeComment(commentId) {
    validate.token(SessionStorage.getItem('token'))
    validate.id(commentId, 'commentId')

    return fetch(`${process.env.EXPO_PUBLIC_API_URL}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${SessionStorage.getItem('token')}`
        }
    })
        .catch(error => { throw new SystemError(error.message) })
        .then(res => {
            if (res.status === 204) return

            return res.json()
                .catch(error => { throw new SystemError(error.message) })
                .then(body => {
                    const { error, message } = body

                    const constructor = errors[error]

                    throw new constructor(message)
                })
        })
}

export default removeComment