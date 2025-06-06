import {ZodError} from "zod";
import {APIError} from "./api-errors.ts";
import toast from "react-hot-toast";

type NormalizedErrorDetail = { path: string[]; message: string };

export function handleErrors(
    error: unknown,
    fieldSetters: Record<string, (msg: string | null) => void>
) {
    // Reset field errors
    Object.values(fieldSetters).forEach(set => set(null));

    let details: NormalizedErrorDetail[] = [];

    // Normalize ZodError to match backend format
    if (error instanceof ZodError) {
        details = error.errors.map((err) => ({
            path: err.path.map(String),
            message: err.message,
        }));
    }

    // Use backend-standard error directly
    if (error instanceof APIError && Array.isArray(error.details)) {
        details = error.details;
    }

    // Display all field-specific errors
    details.forEach(({ path, message }) => {
        const field = String(path[0]);
        if (fieldSetters[field]) fieldSetters[field](message);
        toast.error(message);
    });

    // Fallback for generic errors
    if (details.length === 0) {
        toast.error("An unexpected error occurred.");
        console.error(error);
    }
}
