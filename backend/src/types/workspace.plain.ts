import {IWorkspace} from "../models/Workspace";
import {IUserShort, toUserShort} from "./user.plain";
import mongoose from "mongoose";

export interface IWorkspacePlain {
    id: string;
    name: string;
    owner: IUserShort;
    members: IUserShort[];
}

export interface IWorkspaceShort {
    id: string;
    name: string;
}

export const toWorkspacePlain = (workspace: IWorkspace): IWorkspacePlain => {
    return {
        id: workspace._id.toString(),
        name: workspace.name,
        owner: toUserShort(workspace.owner),
        members: workspace.members.map(toUserShort),
    };
};

export const toWorkspaceShort = (workspace: IWorkspace | mongoose.Types.ObjectId | string): IWorkspaceShort => {
    if (!workspace) return {id: '', name: ''};

    // Helper to convert workspaceId which can be either ObjectId or populated workspace doc
    if (typeof workspace === 'string' || workspace instanceof mongoose.Types.ObjectId) {
        // If not populated, just return minimal with id only (name missing)
        return {id: workspace.toString(), name: ''};
    }
    // Populated user object
    return {
        id: workspace._id?.toString() ?? workspace.toString(),
        name: workspace.name ?? '',
    }
}
