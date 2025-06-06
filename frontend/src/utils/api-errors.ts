export interface ValidationErrorDetail {
    path: (string | number)[];
    message: string;
}

export type ErrorSource = "client" | "server" | "network" | "unknown";

export class APIError extends Error {
    public statusCode: number;
    public details?: ValidationErrorDetail[];
    public source: ErrorSource;

    constructor(
        message: string,
        statusCode: number = 500,
        details?: ValidationErrorDetail[],
        source: ErrorSource = "unknown"
    ) {
        super(message);
        this.name = "APIError";
        this.statusCode = statusCode;
        this.details = details;
        this.source = source;
    }
}

// Factory helpers
export const createError = (
    message: string,
    statusCode: number,
    details?: ValidationErrorDetail[],
    source: ErrorSource = "unknown"
) => new APIError(message, statusCode, details, source);

export const createBadRequestError = (
    message = "Bad Request",
    details?: ValidationErrorDetail[],
    source: ErrorSource = "client"
) => createError(message, 400, details, source);

export const createUnauthorizedError = (message = "Unauthorized", details?: ValidationErrorDetail[]) =>
    createError(message, 401, details, "server");

export const createForbiddenError = (message = "Forbidden", details?: ValidationErrorDetail[]) =>
    createError(message, 403, details, "server");

export const createNotFoundError = (message = "Not Found", details?: ValidationErrorDetail[]) =>
    createError(message, 404, details, "server");

export const createInternalServerError = (message = "Internal Server Error", details?: ValidationErrorDetail[]) =>
    createError(message, 500, details, "server");

// Type guard
export const isAPIError = (error: unknown): error is APIError => {
    return error instanceof APIError;
};
