import mongoose, { Model } from "mongoose";
import { IUser } from "./user.interface";

export const UserPreferencesSchema = new mongoose.Schema({
    favoriteGenres: { type: [String], default: [] },
    dislikedGenres: { type: [String], default: [] },
});

export const UserWatchHistorySchema = new mongoose.Schema({
    contentId: { type: String, required: true },
    watchedOn: { type: Date, default: Date.now },
    rating: { type: Number, default: 0 },
});

export const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        preferences: { type: UserPreferencesSchema, default: () => ({}) },
        watchHistory: { type: [UserWatchHistorySchema], default: [] },
    },
    { timestamps: true }
);


const User: Model<IUser> =
    (mongoose.models.User as Model<IUser>) ||
    mongoose.model<IUser>("User", UserSchema);

export default User;
