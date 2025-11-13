import mongoose from "mongoose";
import { environment } from "./environment";
import logger from "../libs/utils/logger";

const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = environment.dbMongo;
        if (!mongoURI) {
            throw new Error(
                "MongoDB connection string (environment.dbMongo) is missing!"
            );
        }

        const options = {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        await mongoose.connect(mongoURI, options);
        logger.info("MongoDB connected successfully");

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            logger.error(`MongoDB connection error: ${err.message}`);
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            logger.info('MongoDB reconnected');
        });
    } catch (error) {
        logger.error(`MongoDB connection failed: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
    }
};

export default connectDB;
