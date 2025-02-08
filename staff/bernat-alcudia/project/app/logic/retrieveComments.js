import { validate, error, errors } from '../com';
import SessionStorage from 'react-native-session-storage';

const { SystemError } = errors

function retrieveComments(productId) {
    validate.token(SessionStorage.getItem('token'))
    validate.id(productId, 'productId')

    return fetch(`${process.env.EXPO_PUBLIC_API_URL}/comments/${productId}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${SessionStorage.getItem('token')}`
        }
    })

        .catch(error => { throw new SystemError(error.message) })
        .then(res => {
            if (res.status === 200) return res.json()
                .catch(error => { throw new SystemError(error.message) })
                .then(comments => comments)

            return res.json()
                .catch(error => { throw new SystemError(error.message) })
                .then(body => {
                    const { error, message } = body

                    const constructor = errors[error]

                    throw new constructor(message)
                })
        })
}

export default retrieveComments
