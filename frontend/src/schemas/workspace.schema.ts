import {z} from "zod";
import {UserShortSchema} from "./user.schema.ts";

export const WorkspaceShortSchema = z.object({
    id: z.string(),
    name: z.string(),
});

export const SingleWorkspaceSchema = WorkspaceShortSchema.extend({
    owner: UserShortSchema,
    members: z.array(UserShortSchema),
});

export const MultipleWorkspacesSchema = z.array(SingleWorkspaceSchema);

export const CreateWorkspaceInputSchema = z.object({
    name: z.string().min(3, "Workspace name should be at least 3 characters"),
});

export const UpdateWorkspaceInputSchema = z.object({
    name: z.string().min(3, "Workspace name should be at least 3 characters"),
});

export const WorkspaceIdSchema = z.object({
    workspaceId: z
        .string()
        .length(24, "Invalid workspace ID"),
});

// here we can also export the types to be reused in other places instead of repeating everywhere - DRY

export type ICreateWorkspaceParams = z.infer<typeof CreateWorkspaceInputSchema>;

export type IUpdateWorkspaceParams = z.infer<typeof UpdateWorkspaceInputSchema>;
