import Task, {ITask} from "../models/Task";
import Comment from "../models/Comment";
import {CreateTaskInput, UpdateTaskInput, MoveTaskInput} from "../validators/task.validators";
import {IListPlain} from "../types";
import mongoose from "mongoose";

export const createTaskService = async ({input, list}: {
    input: CreateTaskInput,
    list: IListPlain
}) => {

    const task = new Task({
        title: input.title,
        description: input.description ?? '',
        list: list.id,
        position: input.position,
        dueDate: input.dueDate,
        priority: input.priority,
    })

    await task.save();

    await task.populate([
        {path: "list", select: "_id name"},
    ]);

    return task;
};

export const updatedTaskService = async ({input, task, list}: {
    input: UpdateTaskInput,
    task: ITask,
    list: IListPlain
}): Promise<ITask> => {
    Object.assign(task, {
        title: input.title,
        description: input.description ?? '',
        list: list.id,
        position: input.position,
        dueDate: input.dueDate,
        priority: input.priority,
    });

    const savedTask: ITask = await task.save();

    // populate with specific fields
    await savedTask.populate([
        {path: "list", select: "_id name"},
    ]);

    return savedTask;
};

export const moveTaskService = async ({input, task, list}: {
    input: MoveTaskInput,
    task: ITask,
    list: IListPlain
}): Promise<ITask> => {
    Object.assign(task, {
        list: list.id,
        position: input.position,
    });

    const savedTask: ITask = await task.save();

    // populate with specific fields
    await savedTask.populate([
        {path: "list", select: "_id name"},
    ]);

    return savedTask;
}

export const getTaskByIdService = async ({id}: { id: string }): Promise<ITask | null> => {
    const task: ITask | null = await Task.findById(id);
    if (!task) {
        return null;
    }

    // Populate owner and members with specific user fields
    await task.populate({
        path: 'list',
        select: '_id name',
        populate: {
            path: 'board',
            select: '_id name owner members',
        }
    });

    return task;
};

export const getTasksByListService = async ({list}: { list: IListPlain }) => {
    const tasks: ITask[] = await Task.find({list: list.id}).sort('position')
        .populate([
            {path: 'list', select: '_id name'},
        ]);

    return tasks;
};

// Using Mongoose session for delete with multiple operations
export const deleteTaskWithCascadeService = async ({taskId}: { taskId: string }): Promise<void> => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        await Comment.deleteMany({task: taskId}).session(session);

        await Task.findByIdAndDelete(taskId).session(session);

        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};