import {z} from "zod";

export const RegisterSchema = z
    .object({
        name: z.string().min(3, "Name must be at least 3 characters long"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
    })
    .strip(); // removes unexpected fields

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z
    .object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
    })
    .strip(); // removes unexpected fields

export type LoginInput = z.infer<typeof LoginSchema>;