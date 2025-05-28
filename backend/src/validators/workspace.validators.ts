import {z} from "zod";

export const CreateWorkspaceSchema = z
    .object({
        name: z.string().min(3, "Name must be at least 3 characters long"),
    })
    .strip() // removes unexpected fields

export type CreateWorkspaceInput = z.infer<typeof CreateWorkspaceSchema>;

export const UpdateWorkspaceSchema = z
    .object({
        name: z.string().min(3, "Name must be at least 3 characters long"),
    })
    .strip() // removes unexpected fields

export type UpdateWorkspaceInput = z.infer<typeof UpdateWorkspaceSchema>;