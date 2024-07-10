import mongoose from 'mongoose';
import modifyComment from './modifyComment.js';

mongoose.connect('mongodb://localhost:27017/project')
    .then(() => {
        try {
            const text = 'hi world'
            modifyComment('665de5d4ceb42b1f0d73c6dc', '667bf13c4dbe4685c5593913', text)
                .then(() => console.log('comment modified'))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })