import {Response, NextFunction} from "express";
import {AuthRequest} from "./auth.middleware";
import {errorResponse} from "../utils/helpers/response.format";
import {IUserPlain} from "../types";
import {IList} from "../models/List";

export const authorizeBoardOwnerForList = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user: IUserPlain | undefined = req.user;
        if (!user) {
            res.status(404).json(errorResponse({error: "User not found"}));
            return;
        }

        const list: IList | undefined = req.listDoc;
        if (!list) {
            res.status(404).json(errorResponse({error: "List Not Found"}));
            return;
        }

        // populate the board inside the list
        await list.populate({path: "board", select: "_id name owner members"});

        const board: any = list.board;
        if (!board) {
            res.status(404).json(errorResponse({error: "Board not found"}));
            return;
        }

        const isOwner = board.owner.toString() === user.id;

        if (!isOwner) {
            res.status(403).json(errorResponse({message: "Forbidden: No access to this list's board"}));
            return;
        }

        next();
    } catch (error: any) {
        console.error("Error in authorizeOwnerForListBoard:", error);
        res.status(500).json(errorResponse({
            message: "Authorization failed",
            error: error.stack,
        }));
    }
}