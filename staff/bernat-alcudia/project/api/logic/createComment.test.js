import mongoose from 'mongoose';
import createComment from './createComment.js';

mongoose.connect('mongodb://localhost:27017/project')
    .then(() => {
        try {
            const text = 'hi'
            createComment('665de5d4ceb42b1f0d73c6dc', '665d7dc22ebfd3a48dbe6d50', text)
                .then(() => console.log('product comment'))
                .catch(error => console.log(error.message))
        } catch (error) {
            console.error(error)
        }
    })