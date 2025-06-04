// utils/httpErrors.ts
import {AppError, ValidationError} from './app-errors';

export const badRequest = (msg: string) => new AppError(msg, 400, true);
export const unauthorized = (msg: string) => new AppError(msg, 401, true);
export const notFound = (msg: string) => new AppError(msg, 404, true);
export const internal = (msg: string) => new AppError(msg, 500, true);

// New validation error helper
export const validationError = (msg: string, errors: { [field: string]: string[] }) =>
    new ValidationError(msg, errors);