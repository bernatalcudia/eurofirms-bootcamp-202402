import { errors, utils, validate } from '../com';
import SessionStorage from 'react-native-session-storage';

const { SystemError } = errors

function createComment(productId, text) {

    validate.id(productId, 'productId')
    validate.string(text, 'text')


    return fetch(`${process.env.EXPO_PUBLIC_API_URL}/comments`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${SessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId, text })
    })
        .catch(error => { throw new SystemError(error) })
        .then(res => {
            if (res.status === 201) return

            return res.json()
                .catch(error => { throw new SystemError(error) })
                .then(body => {
                    const { error, message } = body
                    const constructor = error[error]

                    throw new constructor(message)
                })
        })
}

export default createComment