import { ZodError } from "zod";
import { APIError } from "./api-errors.ts"; // Adjust the path as needed

export type ValidationError = { path: (string | number)[]; message: string };

export interface RejectedPayload {
    message: string;
    errors?: ValidationError[];
}

/**
 * Centralized error handler for Redux Thunks.
 * Converts APIError and ZodError into a consistent rejectWithValue format.
 */
export function handleThunkError<T>(
    error: unknown,
    rejectWithValue: (payload: RejectedPayload) => T
): T {
    if (error instanceof APIError) {
        return rejectWithValue({
            message: error.message,
            errors: error.details,
        });
    }

    if (error instanceof ZodError) {
        return rejectWithValue({
            message: "Validation failed",
            errors: error.errors.map((e) => ({
                path: e.path,
                message: e.message,
            })),
        });
    }

    return rejectWithValue({
        message: "An unexpected error occurred. Please try again.",
    });
}