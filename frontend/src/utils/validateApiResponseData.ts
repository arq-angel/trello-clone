import {ZodSchema, ZodError} from "zod";

/**
 * Validates an API response using a provided Zod schema.
 * Throws a detailed ZodError if validation fails.
 */
export const validateApiResponse = <T>(data: unknown, schema: ZodSchema<T>): T => {
    // validate the response data
    const result = schema.safeParse(data);

    if (!result.success) {
        // Throw the actual ZodError for better granularity and catching downstream
        throw new ZodError(result.error.errors);
    }

    return result.data;
};
