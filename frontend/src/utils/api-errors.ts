export class APIError extends Error {
    public readonly status: number;
    public readonly details?: unknown;

    constructor(message: string, status: number, details?: unknown) {
        super(message);
        this.name = "APIError";
        this.status = status;
        this.details = details;

        // Set the prototype explicitly (for instanceof to work)
        Object.setPrototypeOf(this, APIError.prototype);
    }
}

// Common HTTP error factories
export const createBadRequestError = (message = "Bad Request", details?: unknown) =>
    new APIError(message, 400, details);

export const createUnauthorizedError = (message = "Unauthorized", details?: unknown) =>
    new APIError(message, 401, details);

export const createForbiddenError = (message = "Forbidden", details?: unknown) =>
    new APIError(message, 403, details);

export const createNotFoundError = (message = "Not Found", details?: unknown) =>
    new APIError(message, 404, details);

export const createInternalServerError = (message = "Internal Server Error", details?: unknown) =>
    new APIError(message, 500, details);
