import { NextFunction, Request, Response } from "express";
import logger from "@libs/utils/logger";

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.originalUrl} | Body: ${JSON.stringify(req.body)}`);
    next();
};

export default loggerMiddleware;
