import { errors, validate } from 'com';
import { User } from '../data/index.js';

const { SystemError, DuplicityError } = errors

//0-Validate params
//1-Find username (not user error)
//2-Create user

function registerBuyer(name, birthdate, email, username, password) {
    validate.name(name)
    validate.birthdate(birthdate)
    validate.email(email)
    validate.username(username)
    validate.password(password)

    return User.findOne({ $or: [{ email }, { username }] })
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (user) throw new DuplicityError('user already exists')

            user = { name, birthdate, email, username, password }

            return User.create(user)
                .catch(error => { throw new SystemError(error.message) })
        })
        .then(user => { })
}

export default registerBuyer