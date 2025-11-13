import { Types, HydratedDocument } from "mongoose";

export interface IMyListResult {
    results: IMyList[];
    totalCount: number;
}

export interface IMyList {
    _id?: Types.ObjectId;
    user: Types.ObjectId;
    contentId: Types.ObjectId;
    contentType: string;
}

export type MyListDocument = HydratedDocument<IMyList>;

// DTOs for service layer
export interface AddToMyListDto {
    userId: string | Types.ObjectId;
    contentId: string | Types.ObjectId;
    contentType: string;
}

export interface RemoveFromMyListDto {
    userId: string | Types.ObjectId;
    contentId: string | Types.ObjectId;
}

export interface GetMyListDto {
    userId: string | Types.ObjectId;
    search?: string;
    page?: number;
    limit?: number;
    skip?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}
