import Workspace, {IWorkspace} from "../models/Workspace";
import {CreateWorkspaceInput, UpdateWorkspaceInput} from "../validators/workspace.validators";
import {IUserPlain} from "../types";
import mongoose from "mongoose";
import Board from "../models/Board";
import List from "../models/List";
import Task from "../models/Task";
import Comment from "../models/Comment";

export const createWorkspaceService = async ({input, user}: {
    input: CreateWorkspaceInput,
    user: IUserPlain
}): Promise<IWorkspace> => {
    const workspace: IWorkspace = await Workspace.create({
        name: input.name,
        owner: user.id, // using the user id from user obtained from auth middleware
        members: [user.id] // using the user id from user obtained from auth middleware
    });

    // Populate owner and members with specific user fields
    await workspace.populate([
        {path: 'owner', select: '_id name email'},
        {path: 'members', select: '_id name email'}
    ]);

    return workspace;
};

export const updateWorkspaceService = async ({workspace, input}: {
    workspace: IWorkspace,
    input: UpdateWorkspaceInput,
}): Promise<IWorkspace> => {
    // Apply updates from req.body, but make sure to sanitize to prevent unwanted field updates
    Object.assign(workspace, input);

    const savedWorkspace: IWorkspace = await workspace.save();

    // Populate owner and members with specific user fields
    await savedWorkspace.populate([
        {path: 'owner', select: '_id name email'},
        {path: 'members', select: '_id name email'}
    ]);

    return savedWorkspace;
};

export const getWorkspaceByIdService = async ({id}: { id: string }): Promise<IWorkspace | null> => {
    const workspace: IWorkspace | null = await Workspace.findById(id);
    if (!workspace) {
        return null;
    }

    // Populate owner and members with specific user fields
    await workspace.populate([
        {path: 'owner', select: '_id name email'},
        {path: 'members', select: '_id name email'}
    ]);

    return workspace;
};

export const getMyWorkspacesService = async ({userId}: { userId: string }): Promise<IWorkspace[]> => {
    const workspaces: IWorkspace[] = await Workspace.find({members: userId})
        .populate([
            {path: "owner", select: "_id name email"},
            {path: "members", select: "_id name email"}
        ]);

    return workspaces;
};

// Using Mongoose session for delete with multiple operations
export const deleteWorkspaceWithCascadeService = async ({workspaceId}: { workspaceId: string }): Promise<void> => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const boards = await Board.find({workspace: workspaceId}).session(session);
        const boardIds = boards.map(board => board._id);

        const lists = await List.find({board: {$in: boardIds}}).session(session);
        const listIds = lists.map(list => list._id);

        const tasks = await Task.find({list: {$in: listIds}}).session(session);
        const taskIds = tasks.map(task => task._id);

        await Comment.deleteMany({task: {$in: taskIds}}).session(session);
        await Task.deleteMany({list: {$in: listIds}}).session(session);
        await List.deleteMany({board: {$in: boardIds}}).session(session);
        await Board.deleteMany({workspace: workspaceId}).session(session);

        await Workspace.findByIdAndDelete(workspaceId).session(session);

        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

