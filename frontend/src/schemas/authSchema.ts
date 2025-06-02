import {z} from "zod";
import {UserSchema} from "./userSchema.ts";

export const authSchema = z.object({
    user: UserSchema,
    token: z.string(),
})