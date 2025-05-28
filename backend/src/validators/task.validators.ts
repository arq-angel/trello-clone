import {z} from "zod";
import mongoose from "mongoose";

export const CreateTaskSchema = z
    .object({
        title: z.string().min(3, "Title must be at least 3 characters long"),
        description: z.string().min(3, "Description is required").optional().nullable(),
        listId: z
            .string()
            .refine((val) => mongoose.isValidObjectId(val), {
                message: "Invalid listId format"
            }),
        position: z.number().min(1, "Position is required"),
        dueDate: z.coerce.date({
            required_error: "Due date is required",
            invalid_type_error: "Invalid date format",
        }),
        priority: z.enum(["low", "medium", "high"], {
            required_error: "Priority is required",
            invalid_type_error: "Priority must be 'low', 'medium', or 'high'",
        }),
    })
    .strip();

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;

export const UpdateTaskSchema = z
    .object({
        title: z.string().min(3, "Title must be at least 3 characters long"),
        description: z.string().min(3, "Description is required").optional().nullable(),
        listId: z
            .string()
            .refine((val) => mongoose.isValidObjectId(val), {
                message: "Invalid listId format"
            }),
        position: z.number().min(1, "Position is required"),
        dueDate: z.coerce.date({
            required_error: "Due date is required",
            invalid_type_error: "Invalid date format",
        }),
        priority: z.enum(["low", "medium", "high"], {
            required_error: "Priority is required",
            invalid_type_error: "Priority must be 'low', 'medium', or 'high'",
        }),
    }).strip();

export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;

export const MoveTaskSchema = z
    .object({
        listId: z
            .string()
            .refine((val) => mongoose.isValidObjectId(val), {
                message: "Invalid listId format"
            }),
        position: z.number().min(1, "Position is required"),
    })
    .strip();

export type MoveTaskInput = z.infer<typeof MoveTaskSchema>;