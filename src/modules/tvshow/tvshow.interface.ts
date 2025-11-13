import { Types, HydratedDocument } from "mongoose";

export interface IEpisode {
    episodeNumber: number;
    seasonNumber: number;
    releaseDate: Date;
    director: string;
    actors: string[];
}

export interface ITVShow {
    _id?: Types.ObjectId;
    title: string;
    description: string;
    genres: string[];
    episodes: IEpisode[];
    createdAt: Date;
    updatedAt: Date;
}

export type TVShowDocument = HydratedDocument<ITVShow>;
