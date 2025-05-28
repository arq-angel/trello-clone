import {Response, NextFunction} from "express";
import {AuthRequest} from "./auth.middleware";
import {errorResponse} from "../utils/helpers/response.format";
import {IUserPlain} from "../types";
import List, {IList} from "../models/List";
import {IBoard} from "../models/Board";

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

        // need to fetch a new object to properly populate the fields without violating typescript rules
        const populatedList = await List.findById(list._id)
            .populate<{ board: IBoard }>({
                path: "board",
                select: "_id name owner members workspaceId"
            })
            .lean(); // added for performance - remove if object is going to be manipulated down the chain

        if (!populatedList?.board) {
            res.status(404).json(errorResponse({error: "List, or board not found during access check"}));
            return;
        }

        const board: IBoard = populatedList.board;
        if (!board?.owner) {
            res.status(404).json(errorResponse({error: "Board or its owner not found during access check"}));
            return;
        }

        // Here owner is  only ObjectId so i have to use without _id
        const isOwner = board?.owner?.toString() === user.id;

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