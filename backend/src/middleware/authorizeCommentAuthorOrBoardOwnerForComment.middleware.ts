import {Response, NextFunction} from "express";
import {AuthRequest} from "./auth.middleware";
import {errorResponse} from "../utils/helpers/response.format";
import {IUserPlain} from "../types";
import {IList} from "../models/List";
import {IComment} from "../models/Comment";
import {ITask} from "../models/Task";


export const authorizeCommentAuthorOrBoardOwnerForComment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user: IUserPlain | undefined = req.user;
        if (!user) {
            res.status(404).json(errorResponse({error: "User not found"}));
            return;
        }

        const comment: IComment | undefined = req.commentDoc;
        if (!comment) {
            res.status(404).json(errorResponse({error: "Comment not found"}));
            return;
        }

        await comment.populate({
            path: "task",
            select: "_id title",
            populate: {
                path: "list",
                select: "_id name",
                populate: {
                    path: "board",
                    select: "_id name owner members",
                }
            }
        });

        const task = comment.task as ITask;
        if (!task) {
            res.status(404).json(errorResponse({error: "Task not found"}));
            return;
        }

        const list = task.list as IList;
        if (!list) {
            res.status(404).json(errorResponse({error: "List Not Found"}));
            return;
        }

        const board: any = list.board;
        if (!board) {
            res.status(404).json(errorResponse({error: "Board not found"}));
            return;
        }

        const isOwner = board.owner.toString() === user.id;
        const isAuthor = comment.author.toString() === user.id;

        if (!isOwner && !isAuthor) {
            res.status(403).json(errorResponse({message: "Forbidden: No access to this comment"}));
            return;
        }

        next();
    } catch (error: any) {
        console.error("Error in authorizeMemberForTaskListBoard:", error);
        res.status(500).json(errorResponse({
            message: "Authorization failed",
            error: error.stack,
        }));
    }
}