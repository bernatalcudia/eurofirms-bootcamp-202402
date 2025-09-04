import { User } from "../data/models.js";
import { validate, errors } from "com";
const { SystemError, NotFoundError, CredentialsError } = errors;
export const changeUserPassword = (userId, currentPassword, newPassword, newPasswordRepeat) => {
    validate.id(userId, "userId");
    validate.password(currentPassword, "currentPassword");
    validate.password(newPassword, "newPassword");
    validate.password(newPasswordRepeat, "newPasswordRepeat");
    return User.findById(userId)
        .catch(error => { throw new SystemError(error.message); })
        .then(user => {
        if (!user)
            throw new NotFoundError("user not found");
        if (currentPassword !== user.password)
            throw new CredentialsError("incorrect current password");
        if (newPassword !== newPasswordRepeat)
            throw new CredentialsError("incorrect new password type");
        user.password = newPassword;
        return user.save()
            .catch(error => { throw new SystemError(error.message); });
    })
        .then(user => { });
};
//# sourceMappingURL=changeUserPassword.js.map