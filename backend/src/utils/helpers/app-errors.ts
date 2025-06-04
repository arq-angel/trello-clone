import {IAppError} from "../../types/app.error";

export class AppError extends Error implements IAppError {
    public readonly statusCode: number;
    public readonly isOperational: boolean;


    constructor(message: string, statusCode: number, isOperational: true) {
        super(message);

        this.statusCode = statusCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    public readonly errors: { [field: string]: string[] };

    constructor(message: string, errors: { [field: string]: string[] }) {
        super(message, 400, true);
        this.errors = errors;

        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}