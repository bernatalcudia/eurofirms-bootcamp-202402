import mongoose from 'mongoose';
import retrieveComments from './retrieveComments.js';

mongoose.connect('mongodb://localhost:27017/project')
    .then(() => {
        try {
            retrieveComments('665de5d4ceb42b1f0d73c6dc', '665d7dc22ebfd3a48dbe6d50')
                .then(comments => console.log(comments))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })