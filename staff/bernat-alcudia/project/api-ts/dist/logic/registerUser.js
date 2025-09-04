import { User } from "../data/models.js";
import bcrypt from "bcrypt";
import { validate, errors } from "com";
const { SystemError, DuplicityError } = errors;
export const registerUser = (name, birthdate, email, username, password) => {
    validate.name(name, "name");
    validate.birthdate(birthdate, "birthdate");
    validate.email(email, "email");
    validate.username(username, "username");
    validate.password(password, "password");
    return User.findOne({ $or: [{ email }, { username }] })
        .catch(error => { throw new SystemError(error.message); })
        .then(user => {
        if (user)
            throw new DuplicityError("user already exists");
        return bcrypt.hash(password, 10)
            .catch(error => { throw new SystemError(error.message); })
            .then(hashedPassword => {
            const newUser = { name, birthdate, email, username, password: hashedPassword };
            return User.create(newUser)
                .catch(error => { throw new SystemError(error.message); });
        });
    })
        .then(user => { });
};
//# sourceMappingURL=registerUser.js.map