import { Types, HydratedDocument } from "mongoose";

export interface IMovie {
    _id?: Types.ObjectId;
    title: string;
    description: string;
    genres: string[];
    releaseDate: Date;
    director: string;
    actors: string[];
    createdAt: Date;
    updatedAt: Date;
}

export type MovieDocument = HydratedDocument<IMovie>;
