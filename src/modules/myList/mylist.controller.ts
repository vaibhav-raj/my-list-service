import { NextFunction, Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { MyListService } from "./mylist.service";
import { AddToMyListDto, GetMyListDto, RemoveFromMyListDto } from "./mylist.interface";

@injectable()
export class MyListController {
    constructor(
        @inject(MyListService)
        private readonly myListService: MyListService
    ) { }

    addToMyList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { contentId, user, contentType } = req.body;

            const dto: AddToMyListDto = {
                userId: user,
                contentId,
                contentType,
            };

            const item = await this.myListService.addToMyList(dto);

            res.status(201).json({
                success: true,
                data: item,
            });
        } catch (error) {
            next(error);
        }
    };

    getMyList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { user, page, limit, skip, sortBy, sortOrder, search } = req.query;

            if (typeof user !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "User ID is required",
                });
            }

            const dto: GetMyListDto = {
                userId: user,
                search: typeof search === "string" ? search : undefined,
                page: page ? parseInt(String(page), 10) : undefined,
                limit: limit ? parseInt(String(limit), 10) : undefined,
                skip: skip ? parseInt(String(skip), 10) : undefined,
                sortBy: typeof sortBy === "string" ? sortBy : undefined,
                sortOrder:
                    sortOrder === "asc" || sortOrder === "desc"
                        ? sortOrder
                        : undefined,
            };

            const result = await this.myListService.getMyList(dto);

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    removeFromMyList = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { contentId, user } = req.body;

            const dto: RemoveFromMyListDto = {
                userId: user,
                contentId,
            };

            const item = await this.myListService.removeFromMyList(dto);

            res.status(200).json({
                success: true,
                data: item,
                message: "Item removed from My List successfully",
            });
        } catch (error) {
            next(error);
        }
    };
}
