import mongoose from "mongoose";
import { ENUM_GENRES } from "../../libs/enums/common.enum";


export const MovieSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
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
    { timestamps: true }
);

const Movie = mongoose.model("Movie", MovieSchema);
export default Movie;
