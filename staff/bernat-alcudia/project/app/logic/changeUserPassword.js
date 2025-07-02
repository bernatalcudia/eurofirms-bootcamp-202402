import { validate, errors } from '../com'
import SessionStorage from 'react-native-session-storage'

const { SystemError } = errors

function changeUserPassword(currentPassword, newPassword, newPasswordRepeat) {
    validate.token(SessionStorage.getItem('token'))
    validate.password(currentPassword)
    validate.password(newPassword)
    validate.password(newPasswordRepeat)


    return fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/password`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${SessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentPassword, newPassword, newPasswordRepeat })
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

export default changeUserPassword