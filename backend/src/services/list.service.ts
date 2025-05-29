import {CreateListInput, UpdateListInput} from "../validators/list.validators";
import List, {IList} from "../models/List";
import {IBoardPlain} from "../types";
import {MoveListInput} from "../validators/list.validators";
import mongoose from "mongoose";
import Task from "../models/Task";
import Comment from "../models/Comment";
import Board from "../models/Board";

export const createListService = async ({input, board}: {
    input: CreateListInput;
    board: IBoardPlain;
}) => {
    const list: IList = new List({
        name: input.name,
        board: board.id,
        position: input.position,
    });

    await list.save();

    // populate list with specific fields
    await list.populate([
        {path: 'board', select: '_id name'},
    ]);

    return list;
};

export const updateListService = async ({input, list}: {
    input: UpdateListInput;
    list: IList;
}) => {
    // Apply updates from req.body, but make sure to sanitize to prevent unwanted field updates
    Object.assign(list, input);

    const savedList: IList = await list.save();

    // populate list with specific fields
    await savedList.populate([
        {path: 'board', select: '_id name'},
    ]);

    return savedList;
};

export const moveListService = async ({input, list}: {
    input: MoveListInput;
    list: IList;
}) => {
    // Apply updates from req.body, but make sure to sanitize to prevent unwanted field updates
    Object.assign(list, {
        position: input.position,
    });

    const savedList: IList = await list.save();

    // populate list with specific fields
    await savedList.populate([
        {path: 'board', select: '_id name'},
    ]);

    return savedList;
};

export const getListByIdService = async ({id}: { id: string }): Promise<IList | null> => {
    const list: IList | null = await List.findById(id);
    if (!list) {
        return null;
    }

    // Populate owner and members with specific user fields
    await list.populate({
        path: 'board',
        select: '_id name owner members'
    });

    return list;
};

export const getListsByBoardService = async ({board}: { board: IBoardPlain }) => {
    const lists: IList[] = await List.find({board: board.id}).sort('position')
        .populate([
            {path: 'board', select: '_id name'},
        ]);

    return lists;
};

// Using Mongoose session for delete with multiple operations
export const deleteListWithCascadeService = async ({listId}: { listId: string }): Promise<void> => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const tasks = await Task.find({list: listId}).session(session);
        const taskIds = tasks.map(task => task._id);

        await Comment.deleteMany({task: {$in: taskIds}}).session(session);
        await Task.deleteMany({list: listId}).session(session);

        await List.findByIdAndDelete(listId).session(session);

        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};