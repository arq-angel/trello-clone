import {Response, NextFunction} from "express";
import {AuthRequest} from "./auth.middleware";
import {errorResponse} from "../utils/helpers/response.format";
import {IUserPlain} from "../types";
import {IBoard} from "../models/Board";

export const authorizeBoardOwner = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user: IUserPlain | undefined = req.user;
        const board: IBoard | undefined = req.boardDoc;

        if (!user) {
            res.status(404).json(errorResponse({message: "User not found",}));
            return;
        }

        if (!board || typeof board !== "object") {
            res.status(404).json(errorResponse({message: "Board not found",}));
            return;
        }

        // Here board owner is only ObjectId so i have to use without _id
        const isOwner = board?.owner?.toString() === (user.id);

        if (!isOwner) {
            res.status(403).json(errorResponse({message: "Forbidden: No access to this board",}));
            return;
        }

        next();
    } catch (error: any) {
        console.error("Error in authorizeBoardOwner:", error);
        res.status(500).json(errorResponse({
            message: "Authorization failed",
            error: error.stack,
        }));
    }
}