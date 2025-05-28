import {Request, Response, NextFunction} from "express";
import jwt from 'jsonwebtoken';
import User, {IUser} from "../models/User";
import {IBoardPlain, ICommentPlain, IListPlain, ITaskPlain, IUserPlain, IWorkspacePlain, toUserPlain} from "../types";
import {IWorkspace} from "../models/Workspace";
import {IBoard} from "../models/Board";
import {IList} from "../models/List";
import {ITask} from "../models/Task";
import {errorResponse} from "../utils/helpers/response.format";
import {IComment} from "../models/Comment";

export interface AuthRequest extends Request {
    user?: IUserPlain;
    userDoc?: IUser;
    workspace?: IWorkspacePlain;
    workspaceDoc?: IWorkspace;
    board?: IBoardPlain;
    boardDoc?: IBoard;
    list?: IListPlain;
    listDoc?: IList;
    task?: ITaskPlain;
    taskDoc?: ITask;
    comment?: ICommentPlain;
    commentDoc?: IComment;

    validated?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    let token: string | undefined;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer ')
    ) {
        token = req.headers.authorization.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                res.status(404).json(errorResponse({
                    message: `User not found`
                }));
                return;
            }

            req.user = toUserPlain(user);
            next();
        } catch (error: any) {
            res.status(401).json(errorResponse({
                message: 'Unauthorized',
                error: error.stack,
            }));
            return;
        }
    } else {
        res.status(401).json(errorResponse({
            message: "Not authorized, no token",
        }));
    }

}