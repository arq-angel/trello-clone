import {ZodError} from "zod";
import {APIError} from "./api-errors";
import type {ValidationErrorDetail} from "./api-errors"

export const fromZodError = (error: ZodError): APIError => {
    const details: ValidationErrorDetail[] = error.errors.map((e) => ({
        path: e.path,
        message: e.message,
    }));

    return new APIError("Validation failed", 400, details, "client");
};
