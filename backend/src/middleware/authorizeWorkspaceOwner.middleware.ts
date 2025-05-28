import {Response, NextFunction} from "express";
import {AuthRequest} from "./auth.middleware";
import {errorResponse} from "../utils/helpers/response.format";
import {IUserPlain} from "../types";
import {IWorkspace} from "../models/Workspace";

export const authorizeWorkspaceOwner = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user: IUserPlain | undefined = req.user;
        const workspace: IWorkspace | undefined = req.workspaceDoc;

        if (!user) {
            res.status(404).json(errorResponse({
                message: "User not authenticated",
            }));
            return;
        }

        if (!workspace || typeof workspace !== "object") {
            res.status(404).json(errorResponse({
                message: "Workspace not found",
            }));
            return;
        }

        // Here workspace owner is only ObjectId so i have to use without _id
        const isOwner = workspace?.owner?.toString() === (user.id);

        if (!isOwner) {
            res.status(403).json(errorResponse({
                message: "Forbidden: No access to this workspace",
            }));
            return;
        }

        next();
    } catch (error: any) {
        console.error("Error in authorizeWorkspaceOwner:", error);
        res.status(500).json(errorResponse({
            message: "Authorization failed",
            error: error.stack,
        }));
    }
}