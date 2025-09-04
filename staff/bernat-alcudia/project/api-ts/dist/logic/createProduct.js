import { User, Product } from "../data/models.js";
import { validate, errors } from "com";
const { SystemError, NotFoundError } = errors;
export const createProduct = (userId, images, title, description, brand, price, state, stock) => {
    validate.id(userId, "userId");
    validate.images(images, "images");
    validate.title(title, "title");
    validate.description(description, "description");
    validate.brand(brand, "brand");
    validate.price(price, "price");
    validate.state(state, "state");
    validate.stock(stock, "stock");
    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message); })
        .then(user => {
        if (!user)
            throw new NotFoundError("user not found");
        const product = {
            author: user._id,
            images,
            title,
            description,
            brand,
            price,
            state,
            stock
        };
        return Product.create(product)
            .catch(error => { throw new SystemError(error.message); });
    })
        .then(product => { });
};
//# sourceMappingURL=createProduct.js.map