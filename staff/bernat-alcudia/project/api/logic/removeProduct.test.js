import mongoose from 'mongoose';
import removeProduct from './removeProduct.js';


mongoose.connect('mongodb://localhost:27017/project')
    .then(() => {
        try {
            removeProduct('6659f70f536c064fc0f89597', '6659f74f536c064fc0f8959f')
                .then(() => console.log('product deleted'))
                .catch(error => console.error(error))
        } catch (error) {
            console.error(error)
        }
    })