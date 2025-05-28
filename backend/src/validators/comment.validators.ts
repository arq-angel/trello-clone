import {z} from "zod";
import mongoose from "mongoose";

export const CreateCommentSchema = z.object({
    text: z.string().min(3, "Comment must be at least 3 characters long"),
    taskId: z
        .string()
        .refine((val) => mongoose.isValidObjectId(val), {
            message: "Invalid taskId format"
        }),
})
    .strip();

export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;