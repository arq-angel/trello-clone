import {ZodSchema} from "zod";

export function validateInput<T>(schema: ZodSchema<T>, data: unknown): T {
    const result = schema.safeParse(data);
    if (!result.success) {
        throw result.error; // This throws ZodError to be handled in the handleApiError function
    }

    return result.data;
}
