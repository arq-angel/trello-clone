import type {FieldValues, Path, UseFormSetError} from "react-hook-form";
import {APIError} from "./api-errors";
import toast from "react-hot-toast";
import {ZodError} from "zod";

/**
 * Centralized error handling for API calls.
 * Converts unknown errors into clean Error instances.
 */

interface ValidationError {
    path: (string | number)[];
    message: string;
}

interface RejectedPayload {
    message: string;
    errors?: ValidationError[];
}

export function handleApiError<TFieldValues extends FieldValues>(
    error: unknown,
    setError?: UseFormSetError<TFieldValues>,
    log?: boolean,
) {

    const isDev = process.env.NODE_ENV === "development";

    if (log || isDev) console.error("handleApiError:", error);

    // ✅ 1. Handle errors in plain object form (from rejectWithValue)
    if (isRejectedPayload(error)) {
        const {message, errors} = error;

        if (errors && setError) {
            errors.forEach(({path, message}) => {
                if (typeof path[0] === "string") {
                    setError(path[0] as Path<TFieldValues>, {
                        type: "manual",
                        message,
                    });
                }
            });
        } else {
            toast.error(message);
        }
        return;
    }

    // ✅ 2. Handle direct ZodError
    if (error instanceof ZodError) {
        if (setError) {
            error.errors.forEach(({path, message}) => {
                if (typeof path[0] === "string") {
                    setError(path[0] as Path<TFieldValues>, {
                        type: "manual",
                        message,
                    });
                }
            });
        } else {
            toast.error("Validation failed.");
        }
        return;
    }

    // ✅ 3. Handle direct APIError
    if (error instanceof APIError) {
        if (error.details && setError) {
            error.details.forEach(({path, message}) => {
                if (typeof path[0] === "string") {
                    setError(path[0] as Path<TFieldValues>, {
                        type: "manual",
                        message,
                    });
                }
            });
        } else {
            toast.error(error.message);
        }
        return;
    }

    // 🚨 Fallback
    toast.error("An unknown error occurred.");
}

function isRejectedPayload(error: unknown): error is RejectedPayload {
    return (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as Record<string, unknown>).message === "string"
    );
}



