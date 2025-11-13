import winston from "winston";

const enableColor = process.env.LOG_COLOR === "true";

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "debug",
    format: winston.format.combine(
        winston.format.colorize({ all: enableColor }),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.printf(({ level, message, timestamp }) => {
            return `[${timestamp}] ${level}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: "logs/app.log",
            level: process.env.LOG_LEVEL || "debug",
        }),
        new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
        }),
    ],
});

export default logger;
