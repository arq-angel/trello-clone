import {Request, Response} from "express";
import {toUserPlain, IUserPlain} from "../types";
import {LoginInput, RegisterInput} from "../validators/auth.validators";
import {isEmailTaken, createUser, loginUser} from "../services/auth.service";
import {errorResponse, successResponse} from "../utils/helpers/response.format";

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const validated: RegisterInput = req.validated;

        const emailExists = await isEmailTaken(validated.email);
        if (emailExists) {
            res.status(400).json(errorResponse({message: "Email is already registered"}));
            return;
        }

        const {token, user} = await createUser(validated);

        const plainUser = toUserPlain(user);

        res.status(201).json(successResponse({
            message: "User registered successfully",
            data: {user: plainUser, token}
        }));
    } catch (error: any) {
        res.status(500).json(errorResponse({message: "Register Failed", error: error.message,}));
        return;
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const validated: LoginInput = req.validated;

        const {token, user} = await loginUser(validated);

        const plainUser: IUserPlain = toUserPlain(user);

        res.status(200).json(successResponse({
            message: "User logged in successfully",
            data: {user: plainUser, token}
        }));
    } catch (error: any) {
        res.status(500).json(errorResponse({message: "Login Failed", error: error.message,}));
        return;
    }
}