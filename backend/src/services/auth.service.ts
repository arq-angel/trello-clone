import User, {IUser} from "../models/User";
import {LoginInput, RegisterInput} from "../validators/auth.validators";
import jwt from "jsonwebtoken";

interface JwtPayload {
    id: string;
    role: "user" | "admin";
}

const generateToken = (user: IUser): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const payload: JwtPayload = {id: user._id.toString(), role: user.role};
    return jwt.sign(payload, secret, {expiresIn: "1d"});
};

export const isEmailTaken = async (email: string): Promise<boolean> => {
    const user = await User.findOne({email});
    return !!user;
}

export const createUser = async (input: RegisterInput): Promise<{ token: string, user: IUser }> => {
    // password hashing is handled by model pre-save hook
    const user = new User({
        name: input.name,
        email: input.email,
        password: input.password,
    });
    await user.save();

    const token = generateToken(user);

    return {token, user};
}

export const loginUser = async (input: LoginInput): Promise<{ token: string, user: IUser }> => {
    const user: IUser | null = await User.findOne({email: input.email});
    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isMatch = await user.matchPassword(input.password);
    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    const token = generateToken(user);

    return {token, user};
}