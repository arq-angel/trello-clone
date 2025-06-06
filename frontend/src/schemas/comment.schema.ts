import {z} from "zod";
import {TaskShortSchema} from "./task.schema.ts";
import {UserShortSchema} from "./user.schema.ts";

export const CommentShortSchema = z.object({
    id: z.string(),
    text: z.string()
});

export const SingleCommentSchema = CommentShortSchema.extend({
    task: TaskShortSchema,
    author: UserShortSchema,
});

export const MultipleCommentsSchema = z.array(SingleCommentSchema);

export const CreateCommentInputSchema = z.object({
    text: z.string(),
    taskId: z.string().length(24, "Invalid task ID"),
})

export const UpdateCommentInputSchema = z.object({
    text: z.string()
})

export const CommentIdSchema = z.object({
    id: z.string().length(24, "Invalid id ID"),
})

export type ICreateCommentParams = z.infer<typeof CreateCommentInputSchema>;

export type IUpdateCommentParams = z.infer<typeof UpdateCommentInputSchema>;