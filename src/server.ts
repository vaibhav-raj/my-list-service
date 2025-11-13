import app from './app';
import connectDB from './config/db';
import { environment } from './config/environment';
import logger from './libs/utils/logger';

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: Error, promise: Promise<any>) => {
    logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason.message}`);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
    logger.error(`Uncaught Exception: ${error.message}`);
    process.exit(1);
});

const startServer = async () => {
    try {
        await connectDB();

        const server = app.listen(environment.port, () => {
            logger.info(
                `Server is running on port ${environment.port} in ${environment.env} mode`
            );
        });

        // Graceful shutdown logic
        const gracefulShutdown = (signal: string) => {
            logger.info(`${signal} received: closing HTTP server...`);
            server.close(() => {
                logger.info('HTTP server closed successfully');
                process.exit(0);
            });
        };

        // OS signal listeners
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    } catch (error) {
        logger.error(
            `Failed to start server: ${error instanceof Error ? error.message : String(error)
            }`
        );
        process.exit(1);
    }
};

startServer();
