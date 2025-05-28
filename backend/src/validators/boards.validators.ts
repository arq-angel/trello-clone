import {z} from "zod";
import mongoose from "mongoose";

export const CreateBoardSchema = z
    .object({
        name: z.string().min(3, "Name is required"),
        workspaceId: z
            .string()
            .refine((val) => mongoose.isValidObjectId(val), {
                message: "Invalid workspaceId format"
            })
    })
    .strip();

export type CreateBoardInput = z.infer<typeof CreateBoardSchema>;

export const UpdateBoardSchema = z
    .object({
        name: z.string().min(3, "Name is required"),
        workspaceId: z
            .string()
            .refine((val) => mongoose.isValidObjectId(val), {
                message: "Invalid workspaceId format"
            })
    })
    .strip();

export type UpdateBoardInput = z.infer<typeof UpdateBoardSchema>