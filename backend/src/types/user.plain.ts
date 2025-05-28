import {IUser} from "../models/User";
import mongoose from "mongoose";

export interface IUserPlain {
    id: string;
    email: string;
    name: string;
    role: "user" | "admin";
}

export interface IUserShort {
    id: string;
    email: string;
    name: string;
}

export const toUserPlain = (user: IUser): IUserPlain => {
    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
    };
}

export const toUserShort = (user: IUser | mongoose.Types.ObjectId | string): IUserShort => {
    if (!user) return {id: '', name: '', email: ''};

    // Helper to convert owner/member which can be either ObjectId or populated user doc
    if (typeof user === 'string' || user instanceof mongoose.Types.ObjectId) {
        // If not populated, just return minimal with id only (name/email missing)
        return {id: user.toString(), name: '', email: ''};
    }
    // Populated user object
    return {
        id: user._id.toString(),
        name: user.name ?? '',
        email: user.email ?? '',
    };
};