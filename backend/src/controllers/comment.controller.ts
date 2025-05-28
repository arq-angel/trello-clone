import {Response} from "express";
import {IComment} from "../models/Comment";
import {AuthRequest} from "../middleware/auth.middleware";
import {ICommentPlain, ITaskPlain, IUserPlain, toCommentPlain, toTaskPlain} from "../types";
import {CreateCommentInput} from "../validators/comment.validators";
import {getTaskByIdService} from "../services/task.service";
import {errorResponse, successResponse} from "../utils/helpers/response.format";
import {createCommentService, getCommentsByTaskService} from "../services/comment.service";
import {userHasTaskAccess} from "../utils/helpers/access-controls";
import {ITask} from "../models/Task";

export const createComment = async (req: AuthRequest, res: Response) => {
    try {
        const validated: CreateCommentInput = req.validated;

        const user: IUserPlain | undefined = req.user;
        if (!user) {
            res.status(404).json(errorResponse({message: `User not found`}));
            return;
        }

        const task: ITask | null = await getTaskByIdService({id: validated.taskId});
        if (!task) {
            res.status(404).json(errorResponse({message: "Task not found"}));
            return;
        }

        const checkAccess = await userHasTaskAccess({task, userId: user.id});
        if (!checkAccess) {
            res.status(403).json(errorResponse({message: "Forbidden: No access to this task"}));
            return;
        }

        const plainTask: ITaskPlain = toTaskPlain(task);

        const comment = await createCommentService({
            user,
            task: plainTask,
            input: validated,
        })

        const plainComment = toCommentPlain(comment);

        res.status(201).json(successResponse({
            message: "Comment added successfully",
            data: plainComment
        }));
    } catch (error: any) {
        console.error("Error adding comment: ", error);
        return res.status(500).json(errorResponse({
            message: "Failed to add comment",
            error: error.stack
        }));
    }
};

export const getCommentsByTask = async (req: AuthRequest, res: Response) => {
    try {
        const task: ITaskPlain | undefined = req.task;
        if (!task) {
            res.status(404).json(errorResponse({message: "Task not found"}));
            return;
        }

        const comments: IComment[] = await getCommentsByTaskService({task})

        const plainComments: ICommentPlain[] = comments.map(toCommentPlain);

        res.status(200).json(successResponse({
            message: "Task comments fetched successfully",
            data: plainComments
        }));
    } catch (error: any) {
        console.error("Error fetching comments: ", error);
        return res.status(500).json(errorResponse({
            message: "Failed to fetch comments",
            error: error.stack
        }));
    }
}

export const deleteComment = async (req: AuthRequest, res: Response) => {
    try {
        const comment: IComment | undefined = req.commentDoc;
        if (!comment) {
            res.status(404).json(errorResponse({message: "Comment not found"}));
            return;
        }

        await comment.deleteOne();

        res.status(200).json(successResponse({
            message: "Comment successfully deleted",
            data: null
        }));
    } catch (error: any) {
        console.error("Error deleting comment: ", error);
        res.status(500).json(errorResponse({
            message: "Failed to delete comment",
            error: error.stack
        }));
    }
}