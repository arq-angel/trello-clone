import {z} from "zod";
import {ListShortSchema} from "./list.schema.ts";

export const TaskShortSchema = z.object({
    id: z.string(),
    title: z.string(),
});

export const SingleTaskSchema = TaskShortSchema.extend({
    description: z.string(),
    position: z.number(),
    dueDate: z.string(),
    priority: z.enum(['low', 'medium', 'high']),
    list: ListShortSchema
});

export const MultipleTasksSchema = z.array(SingleTaskSchema);

export const CreateTaskInputSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string(),
    listId: z.string().length(24, "Invalid list ID"),
    position: z.number().min(1, "Invalid task position"),
    dueDate: z.string(),
    priority: z.enum(['low', 'medium', 'high']),
});

export const UpdateTaskInputSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string(),
    listId: z.string().length(24, "Invalid list ID"),
    position: z.number().min(1, "Invalid task position"),
    dueDate: z.string(),
    priority: z.enum(['low', 'medium', 'high']),
});

export const MoveTaskInputSchema = z.object({
    listId: z.string().length(24, "Invalid list ID"),
    position: z.number().min(1, "Invalid task position"),
});

export const TaskIdSchema = z.object({
    taskId: z.string().length(24, "Invalid list ID"),
})

export type ICreateTaskParams = z.infer<typeof CreateTaskInputSchema>;

export type IUpdateTaskParams = z.infer<typeof UpdateTaskInputSchema>;

export type IMoveTaskParams = z.infer<typeof MoveTaskInputSchema>;