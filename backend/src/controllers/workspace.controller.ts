import {Response} from "express";
import {IWorkspace} from "../models/Workspace";
import {AuthRequest} from "../middleware/auth.middleware";
import {IUserPlain, IWorkspacePlain, toWorkspacePlain} from "../types";
import {errorResponse, successResponse} from "../utils/helpers/response.format";
import {createWorkspaceService, getMyWorkspacesService, updateWorkspaceService} from "../services/workspace.service";
import {CreateWorkspaceInput, UpdateWorkspaceInput} from "../validators/workspace.validators";

export const createWorkspace = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const validated: CreateWorkspaceInput = req.validated;

        const user: IUserPlain | undefined = req.user;
        if (!user) {
            res.status(404).json(errorResponse({message: "User not found"}));
            return;
        }

        const workspace = await createWorkspaceService({
            input: validated,
            user
        });
        const plainWorkspace: IWorkspacePlain = toWorkspacePlain(workspace);

        res.status(201).json(successResponse({
            message: "Workspace created successfully",
            data: plainWorkspace
        }));
    } catch (error) {
        console.error("Error creating workspace: ", error);
        res.status(500).json(errorResponse({
            message: "Failed to create workspace",
            error: error.stack,
        }));
    }
};

export const updateWorkspace = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const validated: UpdateWorkspaceInput = req.validated;

        const workspace: IWorkspace | undefined = req.workspaceDoc;
        if (!workspace) {
            res.status(404).json({message: "Workspace not found"});
            return;
        }

        const updatedWorkspace = await updateWorkspaceService({
            workspace,
            input: validated,
        })

        const plainUpdatedWorkspace: IWorkspacePlain = toWorkspacePlain(updatedWorkspace);
        res.status(200).json(successResponse({
            message: "Workspace updated successfully",
            data: plainUpdatedWorkspace
        }));
    } catch (error) {
        console.error("Error updating workspace: ", error);
        res.status(500).json(errorResponse({
            message: "Failed to update workspace",
            error: error.stack,
        }));
    }
};

export const getMyWorkspaces = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user: IUserPlain | undefined = req.user;
        if (!user) {
            res.status(401).json({message: "Unauthorized or missing user"});
            return;
        }

        const workspaces: IWorkspace[] = await getMyWorkspacesService({userId: user.id});

        const plainWorkspaces: IWorkspacePlain[] = workspaces.map(toWorkspacePlain);

        res.status(200).json(successResponse({
            message: "Workspaces fetched successfully",
            data: plainWorkspaces
        }));
    } catch (error) {
        console.error("Error fetching workspaces: ", error);
        res.status(500).json(errorResponse({
            message: "Failed to fetch workspaces",
            error: error.stack,
        }));
    }
};

export const getWorkspaceById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const workspace: IWorkspace | undefined = req.workspaceDoc;
        if (!workspace) {
            res.status(404).json({message: "Workspace not found"});
            return;
        }

        // Populate owner and members with specific user fields
        await workspace.populate([
            {path: 'owner', select: '_id name email'},
            {path: 'members', select: '_id name email'}
        ]);

        const plainWorkspace: IWorkspacePlain = toWorkspacePlain(workspace);

        res.status(200).json(successResponse({
            message: "Workspace fetched successfully",
            data: plainWorkspace
        }));
    } catch (error) {
        console.error("Error fetching workspace: ", error);
        res.status(500).json(errorResponse({
            message: "Failed to fetch workspace",
            error: error.stack,
        }));
    }
};

export const deleteWorkspace = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const workspace: IWorkspace | undefined = req.workspaceDoc;
        if (!workspace) {
            res.status(404).json({message: "Workspace not found"});
            return;
        }

        await workspace.deleteOne();

        res.status(200).json(successResponse({
            message: "Workspace successfully deleted",
            data: null
        }));
    } catch (error) {
        console.error("Error deleting workspace: ", error);
        res.status(500).json(errorResponse({
            message: "Failed to delete workspace",
            error: error.stack,
        }));
    }
};