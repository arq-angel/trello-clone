import type {IUserShort} from "./user.ts";
import type {ITaskShort} from "./task.ts";

export interface IComment {
    id: string;
    text: string;
    task: ITaskShort;
    author: IUserShort
}