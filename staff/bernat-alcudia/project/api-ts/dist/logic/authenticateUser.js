import { User } from "../data/models.js";
import bcrypt from "bcrypt";
import { errors, validate } from "com";
const { SystemError, NotFoundError, CredentialsError } = errors;
export const authenticateUser = (username, password) => {
    validate.username(username, "username");
    validate.password(password, "password");
    return User.findOne({ username })
        .catch(error => { throw new SystemError(error.message); })
        .then(user => {
        if (!user)
            throw new NotFoundError("user not found");
        return bcrypt.compare(password, user.password)
            .catch(error => { throw new SystemError(error.message); })
            .then(match => {
            if (!match)
                throw new CredentialsError("wrong credentials");
            return {
                id: user.id,
                role: user.role
            };
        });
    });
};
//# sourceMappingURL=authenticateUser.js.map