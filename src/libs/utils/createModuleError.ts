import { AppError } from "./error";

export function createModuleError(moduleName: string, defaultCode: string) {
    return class ModuleError extends AppError {
        constructor({
            message,
            status = 400,
            errorCode = defaultCode,
            details,
        }: {
            message: string;
            status?: number;
            errorCode?: string;
            details?: any;
        }) {
            super({ message, status, errorCode, details });
            this.name = `${moduleName.toUpperCase()}_ERROR`;
        }
    };
}
