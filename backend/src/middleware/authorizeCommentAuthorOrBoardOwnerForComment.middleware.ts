import {Response, NextFunction} from "express";
import {AuthRequest} from "./auth.middleware";
import {errorResponse} from "../utils/helpers/response.format";
import {IUserPlain} from "../types";
import Comment, {IComment} from "../models/Comment";
import {ITask} from "../models/Task";
import {IList} from "../models/List";
import {IBoard} from "../models/Board";
import {IUser} from "../models/User";


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

        // need to fetch a new object to properly populate the fields without violating typescript rules
        const populatedComment = await Comment.findById(comment._id)
            .populate<{
                task: ITask & {
                    list: IList & {
                        board: IBoard & {
                            owner: IUser;
                            members: IUser[];
                        };
                    };
                };
            }>({
                path: "task",
                select: "_id title description list position deuDate priority",
                populate: {
                    path: "list",
                    select: "_id name board position",
                    populate: {
                        path: "board",
                        select: "_id name owner members workspaceId",
                    }
                }
            })
            .lean(); // added for performance - remove if object is going to be manipulated down the chain

        if (!populatedComment?.task?.list?.board) {
            res.status(404).json(errorResponse({error: "Comment, task, list, or board not found during access check"}));
            return;
        }

        const board: IBoard = populatedComment.task.list.board;
        if (!board?.owner || !board?.members) {
            res.status(404).json(errorResponse({error: "Board or its owner/members not found during access check"}));
            return;
        }

        // Here board owner and author are only ObjectId so i have to use without _id
        const isOwner = board?.owner?.toString() === user.id;
        const isAuthor = comment?.author?.toString() === user.id;

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