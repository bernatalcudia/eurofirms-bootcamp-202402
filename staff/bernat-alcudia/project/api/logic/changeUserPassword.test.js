import mongoose from 'mongoose'
import userChangePassword from './changeUserPassword.js'

mongoose.connect('mongodb://localhost:27017/project')
try {
    userChangePassword('665de5d4ceb42b1f0d73c6dc', '123123123123', '123123123', '123123123')
        .then(() => console.log('password changed'))
        .catch(error => console.error(error))
} catch (error) {
    console.error(error)
}