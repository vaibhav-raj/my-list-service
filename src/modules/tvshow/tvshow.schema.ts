import mongoose, { Model } from "mongoose";
import { ENUM_GENRES } from "../../libs/enums/common.enum";
import { ITVShow } from "./tvshow.interface";

const EpisodeSchema = new mongoose.Schema(
    {
        episodeNumber: {
            type: Number,
            required: true,
        },
        seasonNumber: {
            type: Number,
            required: true,
        },
        releaseDate: {
            type: Date,
            required: true,
        },
        director: {
            type: String,
            required: true,
        },
        actors: {
            type: [String],
            default: [],
        },
    },
    { _id: false }
);

export const TVShowSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        genres: {
            type: [String],
            enum: Object.values(ENUM_GENRES),
            default: [],
        },
        episodes: {
            type: [EpisodeSchema],
            default: [],
        },
    },
    { timestamps: true }
);

const TVShow: Model<ITVShow> = mongoose.model<ITVShow>("TVShow", TVShowSchema);

export default TVShow;
