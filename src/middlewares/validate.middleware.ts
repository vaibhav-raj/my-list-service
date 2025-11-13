import { NextFunction, Request, Response } from "express";
import { AppError } from "@libs/utils/error";
import logger from "@libs/utils/logger";

type ValidationSchema = {
    validate: (payload: unknown, options?: Record<string, unknown>) => {
        error?: {
            details: Array<{
                message: string;
                path: (string | number)[];
            }>;
        };
    };
};

export const validate =
    (schema: ValidationSchema) => (req: Request, res: Response, next: NextFunction) => {
        // For GET requests, validate query params; for others, validate body
        const dataToValidate = req.method === "GET" ? req.query : req.body;
        const { error } = schema.validate(dataToValidate, { abortEarly: false, stripUnknown: true });

        if (error) {
            const details = error.details.map((detail) => ({
                message: detail.message,
                path: detail.path,
            }));
            const friendlyMessage = details.map((d) => d.message).join("; ");

            logger.warn(`Validation failed: ${JSON.stringify(details)}`);
            return next(
                new AppError({
                    message: friendlyMessage,
                    status: 400,
                    errorCode: "VALIDATION_ERROR",
                    details,
                })
            );
        }

        logger.info(`Validation passed for ${req.method} ${req.originalUrl}`);
        return next();
    };

export default validate;
