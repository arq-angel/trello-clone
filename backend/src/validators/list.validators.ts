import {z} from "zod";
import mongoose from "mongoose";

export const CreateListSchema = z
    .object({
        name: z.string().min(3, "Name must be at least 3 characters long"),
        boardId: z
            .string()
            .refine((val) => mongoose.isValidObjectId(val), {
                message: "Invalid boardId format"
            }),
        position: z.number().min(1, "Position is required"),
    })
    .strip();

export type CreateListInput = z.infer<typeof CreateListSchema>;

export const UpdateListSchema = z
    .object({
        name: z.string().min(3, "Name must be at least 3 characters long"),
        position: z.number().min(1, "Position is required"),
    })
    .strip();

export type UpdateListInput = z.infer<typeof UpdateListSchema>;

export const MoveListSchema = z
    .object({
        position: z.number().min(1, "Position is required"),
    })
    .strip();

export type MoveListInput = z.infer<typeof MoveListSchema>;