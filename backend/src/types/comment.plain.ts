import {IComment} from "../models/Comment";
import {IUserShort, toUserShort} from "./user.plain";
import {ITaskShort, toTaskShort} from "./task.plain";

export interface ICommentPlain {
    id: string;
    text: string;
    task: ITaskShort;
    author: IUserShort;
}

export const toCommentPlain = (comment: IComment): ICommentPlain => {
    return {
        id: comment._id.toString(),
        text: comment.text,
        task: toTaskShort(comment.task),
        author: toUserShort(comment.author)
    }
}