import mongoose from 'mongoose';
import removeComment from './removeComment.js';

mongoose.connect('mongodb://localhost:27017/project')
    .then(() => {
        try {
            removeComment('665de5d4ceb42b1f0d73c6dc', '667bf0a66cc98e8efd96860e')
                .then(() => console.log('comment deleted'))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })