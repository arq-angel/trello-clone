import {z} from "zod";

export const UserShortSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
});

export const UserSchema = UserShortSchema.extend({
    role: z.enum(['user', 'admin']),
});