export interface IAppError extends Error {
    statusCode: number;
    isOperational: boolean;
}

export interface IValidationErrors {
    [field: string]: string[];
}

export interface IValidationError extends IAppError {
    statusCode: number;
    isOperational: boolean;
    errors: IValidationErrors;  // map of field -> string[]
}
