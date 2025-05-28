import {Response, NextFunction} from "express";
import {AuthRequest} from "./auth.middleware";
import {errorResponse} from "../utils/helpers/response.format";
import {IUserPlain} from "../types";
import {IList} from "../models/List";
import Task, {ITask} from "../models/Task";
import {IBoard} from "../models/Board";

export const authorizeBoardOwnerForTask = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user: IUserPlain | undefined = req.user;
        if (!user) {
            res.status(404).send({error: "User not found"});
            return;
        }

        const task: ITask | undefined = req.taskDoc;
        if (!task) {
            res.status(404).send({error: "Task not found"});
            return;
        }

        // need to fetch a new object to properly populate the fields without violating typescript rules
        const populatedTask = await Task.findById(task._id)
            .populate<{
                list: IList & {
                    board: IBoard;
                };
            }>({
                path: "list",
                select: "_id name board position",
                populate: {
                    path: "board",
                    select: "_id name owner members workspaceId"
                }
            })
            .lean(); // added for performance - remove if object is going to be manipulated down the chain

        if (!populatedTask?.list?.board) {
            res.status(404).json(errorResponse({error: "Task, list, or board not found during access check"}));
            return;
        }

        const board: IBoard = populatedTask.list.board;
        if (!board?.owner || !board?.members) {
            res.status(404).json(errorResponse({error: "Board or its owner/members not found during access check"}));
            return;
        }

        // Here owner is only ObjectId so i have to use without _id
        const isOwner = board?.owner?.toString() === user.id;

        if (!isOwner) {
            res.status(403).json(errorResponse({message: "Forbidden: No access to this task's list's board"}));
            return;
        }

        next();
    } catch (error: any) {
        console.error("Error in authorizeOwnerForTaskListBoard:", error);
        res.status(500).json(errorResponse({
            message: "Authorization failed",
            error: error.stack,
        }));
    }
}