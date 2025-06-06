import { z } from "zod";

export function validateObjectId(id: unknown, fieldName = "id"): string {
    const schema = z.string().length(24, `Invalid ${fieldName}`);
    const result = schema.safeParse(id);

    if (!result.success) {
        throw result.error;
    }

    return result.data;
}
