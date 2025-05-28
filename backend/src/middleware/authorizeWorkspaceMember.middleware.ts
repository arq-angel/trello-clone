import {Response, NextFunction} from "express";
import {AuthRequest} from "./auth.middleware";
import {errorResponse} from "../utils/helpers/response.format";
import {IUserPlain} from "../types";
import {IWorkspace} from "../models/Workspace";

export const authorizeWorkspaceMember = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user: IUserPlain | undefined = req.user;
        const workspace: IWorkspace | undefined = req.workspaceDoc;

        if (!user) {
            res.status(404).json(errorResponse({
                message: "User not found",
            }));
            return;
        }

        if (!workspace || typeof workspace !== "object") {
            res.status(404).json(errorResponse({
                message: "Workspace not found",
            }));
            return;
        }

        const isOwner = workspace.owner?.toString() === (user.id);
        const isMember = workspace.members.some(member => member._id.toString() === user.id);

        if (!isOwner && !isMember) {
            res.status(403).json(errorResponse({
                message: "Forbidden: No access to this workspace",
            }));
            return;
        }

        next();
    } catch (error: any) {
        console.error("Error in authorizeWorkspaceMember:", error);
        res.status(500).json(errorResponse({
            message: "Authorization failed",
            error: error.stack,
        }));
    }
}