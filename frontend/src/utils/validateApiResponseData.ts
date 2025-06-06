import {ZodSchema} from "zod";
import {createBadRequestError} from "./api-errors";

/**
 * Validates API response data with the given Zod schema.
 * Throws a custom APIError with structured validation details on failure.
 */
export function validateApiResponseData<T>(data: unknown, schema: ZodSchema<T>): T {
    const result = schema.safeParse(data);

    if (!result.success) {
        // Map Zod errors to APIError details format
        const details = result.error.errors.map(e => ({
            path: e.path,
            message: e.message,
        }));

        // Throw a standardized APIError to be caught downstream
        throw createBadRequestError("Response validation failed", details);
    }

    return result.data;
}
