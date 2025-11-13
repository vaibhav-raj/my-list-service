import { NextFunction, Request, Response } from "express";
import logger from "@libs/utils/logger";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorMiddleware = (err: any, req: Request, res: Response, _next: NextFunction) => {
    logger.error(`${err.module || "GENERAL"} ERROR: ${err.message}`);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Something went wrong",
    });
};

export default errorMiddleware;
