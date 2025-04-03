import mongoose from 'mongoose';
import removeComment from './removeComment.js';

mongoose.connect('mongodb://localhost:27017/project')
    .then(() => {
        try {
            removeComment('665de5d4ceb42b1f0d73c6dc', '67489c9afb8c54744aba1499')
                .then(() => console.log('comment deleted'))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })