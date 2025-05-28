import {Response, NextFunction} from "express";
import {AuthRequest} from "./auth.middleware";
import {errorResponse} from "../utils/helpers/response.format";
import {IBoardPlain, IUserPlain, toBoardPlain} from "../types";
import {IList} from "../models/List";
import Board, {IBoard} from "../models/Board";


export const authorizeBoardMemberForList = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
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
        const isMember = board.members.some((member: any) => member._id.toString() === user.id);

        if (!isOwner && !isMember) {
            res.status(403).json(errorResponse({message: "Forbidden: No access to this list's board"}));
            return;
        }

        // Fetch and attach the board object with req to use in later functions
        const boardDoc: IBoard | undefined | null = await Board.findById(board._id);
        if (!boardDoc) {
            res.status(404).send({error: "Board not found"});
            return;
        }
        const plainBoardDoc: IBoardPlain = toBoardPlain(boardDoc);
        req.boardDoc = boardDoc;
        req.board = plainBoardDoc;

        next();
    } catch (error: any) {
        console.error("Error in authoriseMemberForListBoard:", error);
        res.status(500).json(errorResponse({
            message: "Authorization failed",
            error: error.stack,
        }));
    }
}