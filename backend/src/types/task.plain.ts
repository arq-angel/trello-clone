import mongoose from "mongoose";
import {ITask} from "../models/Task";
import {IListShort, toListShort} from "./list.plain";

export interface ITaskPlain {
    id: string;
    title: string;
    description?: string;
    list: IListShort;
    position: number,
    dueDate: string;
    priority: "low" | "medium" | "high";
}

export interface ITaskShort {
    id: string;
    title: string;
}

export interface ITaskMoved {
    position: number;
    listId: string;
}

export const toTaskPlain = (task: ITask): ITaskPlain => {
    return {
        id: task._id.toString(),
        title: task.title,
        description: task.description,
        list: toListShort(task.list),
        position: task.position,
        dueDate: task.dueDate.toDateString(),
        priority: task.priority
    }
}

export const toTaskShort = (task: ITask | mongoose.Types.ObjectId | string): ITaskShort => {
    if (!task) return {id: '', title: ''};

    if (typeof task === 'string' || task instanceof mongoose.Types.ObjectId) {
        return {
            id: task.id.toString(),
            title: ''
        };
    }

    return {
        id: task._id.toString(),
        title: task.title,
    }
}