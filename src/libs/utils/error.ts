export class AppError extends Error {
    public readonly status: number;
    public readonly errorCode: string;
    public readonly details?: any;
    public readonly timestamp: string;

    constructor({
        message,
        status = 500,
        errorCode = "INTERNAL_ERROR",
        details,
    }: {
        message: string;
        status?: number;
        errorCode?: string;
        details?: any;
    }) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
        this.details = details;
        this.timestamp = new Date().toISOString();
    }
}
