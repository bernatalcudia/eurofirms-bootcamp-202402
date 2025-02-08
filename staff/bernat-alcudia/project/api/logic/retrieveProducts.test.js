import mongoose from 'mongoose';
import retrieveProducts from './retrieveProducts.js';

mongoose.connect('mongodb://localhost:27017/project')
    .then(() => {
        try {
            retrieveProducts('6659f70f536c064fc0f89597')
                .then(products => console.log('retrieved products', products))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })