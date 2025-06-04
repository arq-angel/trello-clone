import {NextFunction, Request, Response} from "express";
import {toUserPlain, IUserPlain} from "../types";
import {LoginInput, RegisterInput} from "../validators/auth.validators";
import {isEmailTaken, createUser, loginUser} from "../services/auth.service";
import {badRequest} from "../utils/helpers/http-errors";

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const validated: RegisterInput = req.validated;

        const emailExists = await isEmailTaken(validated.email);
        if (emailExists) {
            // Throw custom error, global handler will catch this
            throw badRequest("Email is already registered");
        }

        const {token, user} = await createUser(validated);

        const plainUser = toUserPlain(user);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {user: plainUser, token},
        });
    } catch (error) {
        next(error); // Pass error to global error handler
    }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const validated: LoginInput = req.validated;

        const { token, user } = await loginUser(validated);

        const plainUser: IUserPlain = toUserPlain(user);

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: { user: plainUser, token },
        });
    } catch (error) {
        next(error); // Pass error to global error handler
    }
};