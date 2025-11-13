import { Model, Types } from "mongoose";
import { injectable, inject } from "tsyringe";
import awaitTo from "await-to-js";
import {
    IMyList,
    IMyListResult,
    AddToMyListDto,
    RemoveFromMyListDto,
    GetMyListDto,
} from "./mylist.interface";
import { IUser } from "../user/user.interface";
import { IMovie } from "../movie/movie.interface";
import { ITVShow } from "../tvshow/tvshow.interface";
import { MyListError } from "../../errors/mylist.error";
import { MyListDictionary } from "./mylist.dictionary";
import { ENUM_CONTENT_TYPE } from "../../libs/enums/common.enum";
import logger from "@libs/utils/logger";
import { MYLIST_TOKENS } from "./mylist.tokens";

const to = async <T>(
    promise: Promise<T>
): Promise<[Error | undefined, T | undefined]> => {
    const fn =
        typeof awaitTo === "function"
            ? awaitTo
            : (awaitTo as { default?: typeof awaitTo }).default;
    if (typeof fn !== "function") {
        throw new Error("await-to-js did not provide a callable default export");
    }
    const [err, result] = await fn(promise);
    return [err ?? undefined, result];
};

const LOG_PREFIX = "[MyListService]";

@injectable()
export class MyListService {
    private static readonly MAX_PAGE_SIZE = 100;
    private static readonly DEFAULT_PAGE_SIZE = 10;
    private static readonly ALLOWED_SORT_FIELDS = [
        "createdAt",
        "updatedAt",
        "contentType",
    ];

    constructor(
        @inject(MYLIST_TOKENS.MyListModel)
        private readonly myListModel: Model<IMyList>,
        @inject(MYLIST_TOKENS.UserModel) private readonly userModel: Model<IUser>,
        @inject(MYLIST_TOKENS.MovieModel)
        private readonly movieModel: Model<IMovie>,
        @inject(MYLIST_TOKENS.TVShowModel) private readonly tvModel: Model<ITVShow>
    ) { }

    // Add item to user's list
    async addToMyList(dto: AddToMyListDto): Promise<IMyList> {
        const { userId, contentId, contentType } = dto;
        logger.info(
            `${LOG_PREFIX} addToMyList started with dto ${JSON.stringify(dto)}    `
        );

        // Validate user exists
        const userDoc = await this.validateUser(userId);

        // Check content type is valid
        this.validateContentType(contentType);

        // Make sure content exists
        const contentItem = await this.validateContent(contentId, contentType);

        // Don't allow duplicates
        await this.checkDuplicateItem(userId, contentId);

        // Create new list item
        const item = new this.myListModel({
            user: userId,
            contentId,
            contentType,
        });

        const [saveErr, savedItem] = await to(item.save());
        if (saveErr || !savedItem) {
            logger.error(
                `${LOG_PREFIX} addToMyList save failed | userId=${userId} contentId=${contentId} error=${this.getErrorMessage(
                    saveErr
                )}`
            );
            throw (
                saveErr ||
                new MyListError({
                    message: MyListDictionary.ERROR_SAVING_TO_MY_LIST,
                    status: 500,
                    errorCode: "ERROR_SAVING_TO_MY_LIST",
                })
            );
        }

        logger.info(
            `${LOG_PREFIX} addToMyList success | userId=${userId} contentId=${contentId} contentType=${contentType}`
        );

        return savedItem;
    }

    async getMyList(dto: GetMyListDto): Promise<IMyListResult> {
        const {
            userId,
            search,
            page = 1,
            limit = 10,
            skip,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = dto;

        const safeLimit = Math.min(Math.max(limit, 1), MyListService.MAX_PAGE_SIZE);
        const safePage = Math.max(page, 1);
        const safeSkip = skip ?? (safePage - 1) * safeLimit;
        const sortDirection = sortOrder === "asc" ? 1 : -1;

        // -----------------------------------------------------
        // ❇ CASE 1: NO SEARCH → simple populate (FASTER & CLEANER)
        // -----------------------------------------------------
        if (!search) {
            const [err, items] = await to(
                this.myListModel
                    .find({ user: userId })
                    .sort({ [sortBy]: sortDirection })
                    .skip(safeSkip)
                    .limit(safeLimit)
                    .populate({
                        path: "contentId",
                        model: (doc: any) =>
                            doc.contentType === "movie" ? "Movie" : "TVShow",
                    })
            );

            if (err || !items) {
                throw new MyListError({
                    message: MyListDictionary.ERROR_GETTING_MY_LIST,
                    status: 500,
                    errorCode: "ERROR_GETTING_MY_LIST",
                });
            }

            const totalCount = await this.myListModel.countDocuments({ user: userId });

            // Convert populate result to expected format:
            const results = items.map((item: any) => ({
                _id: item._id,
                user: item.user,
                contentId: item.contentId._id,
                contentType: item.contentType,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                content: item.contentId, // full movie or tvshow object
            }));

            return {
                results,
                totalCount,
            };
        }

        // -----------------------------------------------------
        // ❇ CASE 2: SEARCH → use aggregation (regex search)
        // -----------------------------------------------------

        const pipeline: any[] = [
            { $match: { user: new Types.ObjectId(String(userId)) } },

            {
                $lookup: {
                    from: "movies",
                    localField: "contentId",
                    foreignField: "_id",
                    as: "movie",
                },
            },
            {
                $lookup: {
                    from: "tvshows",
                    localField: "contentId",
                    foreignField: "_id",
                    as: "tvshow",
                },
            },
            {
                $addFields: {
                    content: {
                        $cond: {
                            if: { $eq: ["$contentType", "movie"] },
                            then: { $arrayElemAt: ["$movie", 0] },
                            else: { $arrayElemAt: ["$tvshow", 0] },
                        },
                    },
                },
            },
            { $project: { movie: 0, tvshow: 0 } },
            {
                $match: {
                    "content.title": { $regex: search, $options: "i" }
                }
            },
            { $sort: { [sortBy]: sortDirection } },
            { $skip: safeSkip },
            { $limit: safeLimit },
            {
                $project: {
                    _id: 1,
                    user: 1,
                    contentId: 1,
                    contentType: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    content: 1,
                },
            },
        ];

        const [err, items] = await to(this.myListModel.aggregate(pipeline));

        if (err || !items) {
            throw new MyListError({
                message: MyListDictionary.ERROR_GETTING_MY_LIST,
                status: 500,
                errorCode: "ERROR_GETTING_MY_LIST",
            });
        }

        const totalCount = await this.myListModel.countDocuments({ user: userId });

        return {
            results: items,
            totalCount,
        };
    }


    // Remove item from user's list
    async removeFromMyList(dto: RemoveFromMyListDto): Promise<IMyList> {
        const { userId, contentId } = dto;
        logger.debug(
            `${LOG_PREFIX} removeFromMyList called | userId=${userId} contentId=${contentId}`
        );

        // Validate user exists
        await this.validateUser(userId);

        // Find and delete the item in one operation
        const [deleteErr, deletedItem] = await to(
            this.myListModel
                .findOneAndDelete({
                    user: userId,
                    contentId,
                })
                .exec()
        );

        if (deleteErr) {
            logger.error(
                `${LOG_PREFIX} removeFromMyList delete failed | userId=${userId} contentId=${contentId} error=${this.getErrorMessage(
                    deleteErr
                )}`
            );
            throw new MyListError({
                message: MyListDictionary.ERROR_REMOVING_FROM_MY_LIST,
                status: 500,
                errorCode: "ERROR_REMOVING_FROM_MY_LIST",
            });
        }

        if (!deletedItem) {
            logger.warn(
                `${LOG_PREFIX} removeFromMyList item not found | userId=${userId} contentId=${contentId}`
            );
            throw new MyListError({
                message: MyListDictionary.ITEM_NOT_FOUND,
                status: 404,
                errorCode: "ITEM_NOT_FOUND",
            });
        }

        logger.info(
            `${LOG_PREFIX} removeFromMyList success | userId=${userId} contentId=${contentId}`
        );

        return deletedItem;
    }

    // Helper methods

    private async validateUser(userId: string | Types.ObjectId): Promise<IUser> {
        const [userErr, userDoc] = await to(this.userModel.findById(userId).exec());

        if (userErr) {
            logger.error(
                `${LOG_PREFIX} validateUser failed | userId=${userId} error=${this.getErrorMessage(
                    userErr
                )}`
            );
            throw userErr;
        }

        if (!userDoc) {
            logger.warn(
                `${LOG_PREFIX} validateUser user not found | userId=${userId}`
            );
            throw new MyListError({
                message: MyListDictionary.USER_NOT_FOUND,
                status: 400,
                errorCode: "USER_NOT_FOUND",
            });
        }

        return userDoc;
    }

    private validateContentType(contentType: string): void {
        const validTypes = Object.values(ENUM_CONTENT_TYPE);
        if (!contentType || !validTypes.includes(contentType as any)) {
            logger.warn(
                `${LOG_PREFIX} validateContentType invalid type | contentType=${contentType}`
            );
            throw new MyListError({
                message: MyListDictionary.INVALID_CONTENT_TYPE,
                status: 400,
                errorCode: "INVALID_CONTENT_TYPE",
            });
        }
    }

    private async validateContent(
        contentId: string | Types.ObjectId,
        contentType: string
    ): Promise<IMovie | ITVShow> {
        const contentModel =
            contentType === ENUM_CONTENT_TYPE.MOVIE ? this.movieModel : this.tvModel;

        const [contentErr, contentItem] = await to(
            contentModel.findById(contentId).exec()
        );

        if (contentErr) {
            logger.error(
                `${LOG_PREFIX} validateContent lookup failed | contentId=${contentId} contentType=${contentType} error=${this.getErrorMessage(
                    contentErr
                )}`
            );
            throw contentErr;
        }

        if (!contentItem) {
            logger.warn(
                `${LOG_PREFIX} validateContent not found | contentId=${contentId} contentType=${contentType}`
            );
            throw new MyListError({
                message: MyListDictionary.CONTENT_NOT_FOUND,
                status: 400,
                errorCode: "CONTENT_NOT_FOUND",
            });
        }

        return contentItem;
    }

    private async checkDuplicateItem(
        userId: string | Types.ObjectId,
        contentId: string | Types.ObjectId
    ): Promise<void> {
        const [existingErr, existing] = await to(
            this.myListModel
                .findOne({
                    user: userId,
                    contentId,
                })
                .exec()
        );

        if (existingErr) {
            logger.error(
                `${LOG_PREFIX} checkDuplicateItem failed | userId=${userId} contentId=${contentId} error=${this.getErrorMessage(
                    existingErr
                )}`
            );
            throw existingErr;
        }

        if (existing) {
            logger.warn(
                `${LOG_PREFIX} checkDuplicateItem duplicate found | userId=${userId} contentId=${contentId}`
            );
            throw new MyListError({
                message: MyListDictionary.ITEM_ALREADY_EXISTS,
                status: 400,
                errorCode: "ITEM_ALREADY_EXISTS",
            });
        }
    }

    // Helper to safely get error message
    private getErrorMessage(error: unknown): string {
        if (error instanceof Error) {
            return error.message;
        }
        return JSON.stringify(error);
    }
}
