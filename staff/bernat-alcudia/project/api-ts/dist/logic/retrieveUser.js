import { User } from "../data/models.js";
import { validate, errors } from "com";
const { SystemError, NotFoundError } = errors;
export const retrieveUser = (userId, targetUserId) => {
    validate.id(userId, "userId");
    validate.id(targetUserId, "targetUserId");
    return User.findById(userId).select("-_id name username saved").lean()
        .catch(error => { throw new SystemError(error.message); })
        .then(targetUser => {
        if (!targetUser)
            throw new NotFoundError("user not found");
        return {
            id: targetUser._id.toString(),
            name: targetUser.name,
            username: targetUser.username,
            email: targetUser.email,
        };
    });
};
//# sourceMappingURL=retrieveUser.js.map