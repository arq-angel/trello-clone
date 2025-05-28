import {CreateBoardInput, UpdateBoardInput} from "../validators/boards.validators";
import {IUserPlain, IWorkspacePlain} from "../types";
import Board, {IBoard} from "../models/Board";
import mongoose from "mongoose";
import List from "../models/List";
import Task from "../models/Task";
import Comment from "../models/Comment";
import Workspace from "../models/Workspace";

export const createBoardService = async ({input, workspace, user}: {
    input: CreateBoardInput,
    workspace: IWorkspacePlain,
    user: IUserPlain
}): Promise<IBoard> => {
    const board: IBoard = new Board({
        name: input.name,
        owner: user.id, // using the user id from user obtained from auth middleware
        members: [user.id], // using the user id from user obtained from auth middleware
        workspaceId: workspace.id // using the workspace id from board obtained from isWorkspaceMember middleware
    });

    await board.save();

    // Populate owner and members with specific user fields
    await board.populate([
        {path: 'owner', select: '_id name email'},
        {path: 'members', select: '_id name email'},
        {path: 'workspaceId', select: '_id name'}
    ]);

    return board;
};

export const updateBoardService = async ({board, input}: {
    board: IBoard,
    input: UpdateBoardInput,
}) => {
    // Apply updates from req.body, but make sure to sanitize to prevent unwanted field updates
    Object.assign(board, input);

    const savedBoard: IBoard = await board.save();

    // Populate owner and members with specific user fields
    await savedBoard.populate([
        {path: 'owner', select: '_id name email'},
        {path: 'members', select: '_id name email'},
        {path: 'workspaceId', select: '_id name'}
    ])

    return savedBoard;
};

export const getBoardByIdService = async ({id}: { id: string }): Promise<IBoard | null> => {
    const board: IBoard | null = await Board.findById(id);
    if (!board) {
        return null;
    }

    // Populate owner and members with specific user fields
    await board.populate([
        {path: 'owner', select: '_id name email'},
        {path: 'members', select: '_id name email'}
    ]);

    return board;
};

export const getMyBoardsService = async ({userId}: { userId: string }): Promise<IBoard[]> => {

    const boards: IBoard[] = await Board.find({members: userId})
        .populate([
            {path: 'owner', select: '_id name email'},
            {path: 'members', select: '_id name email'},
            {path: 'workspaceId', select: '_id name'}
        ]);

    return boards;
};

// Using Mongoose session for delete with multiple operations
export const deleteBoardWithCascadeService = async ({boardId}: { boardId: string }): Promise<void> => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const lists = await List.find({board: boardId}).session(session);
        const listIds = lists.map(list => list._id);

        const tasks = await Task.find({list: {$in: listIds}}).session(session);
        const taskIds = tasks.map(task => task._id);

        await Comment.deleteMany({task: {$in: taskIds}}).session(session);
        await Task.deleteMany({list: {$in: listIds}}).session(session);
        await List.deleteMany({board: boardId}).session(session);

        await Board.findByIdAndDelete(boardId).session(session);

        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};