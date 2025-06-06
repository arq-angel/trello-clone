import {z} from "zod";
import {UserSchema} from "./user.schema.ts";

export const UserLoginResponseSchema = z.object({
    user: UserSchema,
    token: z.string(),
})

export const LoginUserInputSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password should be at least 6 characters"),
})

export const RegisterUserInputSchema = LoginUserInputSchema.extend({
    name: z.string().min(3, "Name should be at least 3 characters"),

    /*    confirmPassword: z
            .string()
            .min(6, "Confirm Password must be at least 6 characters"),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],*/

})

export const DummyRegisterUserInputSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(3, "Password should be at least 6 characters"),
    name: z.string().min(3, "Name should be at least 3 characters"),
})

export type ILoginUserParams = z.infer<typeof LoginUserInputSchema>;

export type IRegisterUserParams = z.infer<typeof RegisterUserInputSchema>;

export type ILoginUserResponseSchema = z.infer<typeof UserLoginResponseSchema>;
