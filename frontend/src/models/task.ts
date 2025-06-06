import type {IListShort} from "./list.ts";

export type Priority = 'low' | 'medium' | 'high';

export interface ITask {
    id: string;
    title: string;
    description?: string;
    position: number;
    dueDate: string;
    priority: Priority;
    list: IListShort;
}

export interface ITaskShort {
    id: string;
    title: string;
}