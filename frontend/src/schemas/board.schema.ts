import {z} from "zod";
import {UserShortSchema} from "./user.schema.ts";
import {WorkspaceShortSchema} from "./workspace.schema.ts";

export const BoardShortSchema = z.object({
    id: z.string(),
    name: z.string(),
});

export const SingleBoardSchema = BoardShortSchema.extend({
    owner: UserShortSchema,
    members: z.array(UserShortSchema),
    workspace: WorkspaceShortSchema,
});

export const MultipleBoardsSchema = z.array(SingleBoardSchema);

export const CreateBoardInputSchema = z.object({
    name: z.string().min(3, "Board name should be at least 3 characters"),
    workspaceId: z.string().length(24, "Invalid workspace ID"),
});

export const UpdateBoardInputSchema = z.object({
    name: z.string().min(3, "Board name should be at least 3 characters"),
    workspaceId: z.string().length(24, "Invalid workspace ID"),
});

export const BoardIdSchema = z.object({
    boardId: z.string().length(24, "Invalid board ID"),
});

export type ICreateBoardParams = z.infer<typeof CreateBoardInputSchema>;

export type IUpdateBoardParams = z.infer<typeof UpdateBoardInputSchema>;