import { Types, HydratedDocument } from "mongoose";

export interface IUserPreferences {
    favoriteGenres: string[];
    dislikedGenres: string[];
}

export interface IUserWatchHistory {
    contentId: string;
    watchedOn: Date;
    rating?: number;
}

export interface IUser {
    _id?: Types.ObjectId;
    username: string;
    preferences: IUserPreferences;
    watchHistory: IUserWatchHistory[];
    createdAt: Date;
    updatedAt: Date;
}

export type UserDocument = HydratedDocument<IUser>;
