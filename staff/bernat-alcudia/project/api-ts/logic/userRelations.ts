import { errors, validate } from "com"
import { User, UserRelation } from "../data/models.js"
import type {
    BlockUser,
    FollowUser,
    RetrieveBlockedUsers,
    RetrievePublicProfile,
    UnblockUser,
    UnfollowUser,
} from "./types.js"

const { NotFoundError, OwnershipError, SystemError } = errors

export async function ensureUsersNotBlocked(firstUserId: string, secondUserId: string): Promise<void> {
    const blocked = await UserRelation.exists({
        kind: "block",
        $or: [
            { from: firstUserId, to: secondUserId },
            { from: secondUserId, to: firstUserId },
        ],
    }).catch(error => { throw new SystemError(error.message) })
    if (blocked) throw new NotFoundError("user or conversation not found")
}

async function validateRelationshipUsers(userId: string, targetUserId: string): Promise<void> {
    validate.id(userId, "userId")
    validate.id(targetUserId, "targetUserId")
    if (userId === targetUserId) throw new OwnershipError("cannot create a relationship with yourself")
    const target = await User.exists({ _id: targetUserId })
        .catch(error => { throw new SystemError(error.message) })
    if (!target) throw new NotFoundError("user not found")
}

export const followUser: FollowUser = async (userId, targetUserId) => {
    await validateRelationshipUsers(userId, targetUserId)
    await ensureUsersNotBlocked(userId, targetUserId)
    await UserRelation.updateOne(
        { from: userId, to: targetUserId, kind: "follow" },
        { $setOnInsert: { from: userId, to: targetUserId, kind: "follow" } },
        { upsert: true },
    ).catch(error => { throw new SystemError(error.message) })
    await ensureUsersNotBlocked(userId, targetUserId).catch(async error => {
        await UserRelation.deleteOne({ from: userId, to: targetUserId, kind: "follow" })
            .catch(deleteError => { throw new SystemError(deleteError.message) })
        throw error
    })
}

export const unfollowUser: UnfollowUser = async (userId, targetUserId) => {
    validate.id(userId, "userId")
    validate.id(targetUserId, "targetUserId")
    await UserRelation.deleteOne({ from: userId, to: targetUserId, kind: "follow" })
        .catch(error => { throw new SystemError(error.message) })
}

export const blockUser: BlockUser = async (userId, targetUserId) => {
    await validateRelationshipUsers(userId, targetUserId)
    await UserRelation.updateOne(
        { from: userId, to: targetUserId, kind: "block" },
        { $setOnInsert: { from: userId, to: targetUserId, kind: "block" } },
        { upsert: true },
    ).catch(error => { throw new SystemError(error.message) })
    await UserRelation.deleteMany({
        kind: "follow",
        $or: [
            { from: userId, to: targetUserId },
            { from: targetUserId, to: userId },
        ],
    }).catch(error => { throw new SystemError(error.message) })
}

export const unblockUser: UnblockUser = async (userId, targetUserId) => {
    validate.id(userId, "userId")
    validate.id(targetUserId, "targetUserId")
    await UserRelation.deleteOne({ from: userId, to: targetUserId, kind: "block" })
        .catch(error => { throw new SystemError(error.message) })
}

export const retrievePublicProfile: RetrievePublicProfile = async (userId, targetUserId) => {
    validate.id(userId, "userId")
    validate.id(targetUserId, "targetUserId")
    const isBlocked = await UserRelation.exists({
        kind: "block",
        $or: [
            { from: userId, to: targetUserId },
            { from: targetUserId, to: userId },
        ],
    }).catch(error => { throw new SystemError(error.message) })
    if (isBlocked) throw new NotFoundError("user not found")

    const [target, followersCount, followingCount, isFollowing] = await Promise.all([
        User.findById(targetUserId).select("name username photo").lean()
            .catch(error => { throw new SystemError(error.message) }),
        UserRelation.countDocuments({ to: targetUserId, kind: "follow" })
            .catch(error => { throw new SystemError(error.message) }),
        UserRelation.countDocuments({ from: targetUserId, kind: "follow" })
            .catch(error => { throw new SystemError(error.message) }),
        UserRelation.exists({ from: userId, to: targetUserId, kind: "follow" })
            .catch(error => { throw new SystemError(error.message) }),
    ])
    if (!target) throw new NotFoundError("user not found")
    return {
        id: target._id.toString(),
        name: target.name,
        username: target.username,
        photo: target.photo ?? null,
        followersCount,
        followingCount,
        isFollowing: Boolean(isFollowing),
        isBlocked: false,
    }
}

export const retrieveBlockedUsers: RetrieveBlockedUsers = async userId => {
    validate.id(userId, "userId")
    const relations = await UserRelation.find({ from: userId, kind: "block" }).select("to").lean()
        .catch(error => { throw new SystemError(error.message) })
    if (!relations.length) return []
    const users = await User.find({ _id: { $in: relations.map(relation => relation.to) } })
        .select("name username").lean()
        .catch(error => { throw new SystemError(error.message) })
    return users.map(user => ({
        id: user._id.toString(),
        name: user.name,
        username: user.username,
    }))
}
