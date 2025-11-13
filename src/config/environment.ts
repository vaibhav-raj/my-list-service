export const environment = {
    env: process.env.NODE_ENV,
    port: parseInt(process.env.PORT || '3000', 10),
    dbMongo: process.env.MONGO_URI,
    logLevel: process.env.LOG_LEVEL || 'info',
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
};