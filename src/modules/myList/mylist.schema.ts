import mongoose, { Model } from "mongoose";
import { ENUM_CONTENT_TYPE } from "../../libs/enums/common.enum";
import { IMyList } from "./mylist.interface";
const { ObjectId } = mongoose.Schema.Types;

export const MyListSchema = new mongoose.Schema(
    {
        user: { type: ObjectId, ref: "User", required: true, index: true },
        contentId: { type: ObjectId, required: true, refPath: "contentType" },
        contentType: {
            type: String,
            enum: Object.values(ENUM_CONTENT_TYPE),
            required: true,
        },
    },
    { timestamps: true }
);

MyListSchema.index({ user: 1, contentId: 1, contentType: 1 }, { unique: true });
const MyList: Model<IMyList> = mongoose.model<IMyList>("MyList", MyListSchema);

export default MyList;
