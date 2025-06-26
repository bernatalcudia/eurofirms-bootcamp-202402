import mongoose from 'mongoose'
import changePassword from './changePassword.js'

mongoose.connect('mongodb://localhost:27017/project')
try {
    changePassword('665de5d4ceb42b1f0d73c6dc', '123123123123', '123123123', '123123123')
        .then(() => console.log('password changed'))
        .catch(error => console.error(error))
} catch (error) {
    console.error(error)
}