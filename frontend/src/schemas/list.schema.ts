import {z} from "zod";
import {BoardShortSchema} from "./board.schema.ts";

export const ListShortSchema = z.object({
    id: z.string(),
    name: z.string(),
});

export const SingleListSchema = ListShortSchema.extend({
    board: BoardShortSchema,
    position: z.number()
})

export const MultipleListsSchema = z.array(SingleListSchema);

export const CreateListInputSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    boardId: z.string().length(24, "Invalid list ID"),
    position: z.number().min(1, "Invalid list position"),
})

export const UpdateListInputSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    position: z.number().min(1, "Invalid list position"),
})

export const MoveListInputSchema = z.object({
    position: z.number().min(1, "Invalid list position"),
})

export const ListIdSchema = z.object({
    listID: z.string().length(24, "Invalid list ID"),
})

export type ICreateListParams = z.infer<typeof CreateListInputSchema>;

export type IUpdateListParams = z.infer<typeof UpdateListInputSchema>;

export type IMoveListParams = z.infer<typeof MoveListInputSchema>;