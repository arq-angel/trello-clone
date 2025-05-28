import {CreateCommentInput} from "../validators/comment.validators";
import {ITaskPlain, IUserPlain} from "../types";
import Comment from "../models/Comment";

export const createCommentService = async ({user, task, input}: {
    user: IUserPlain,
    task: ITaskPlain,
    input: CreateCommentInput
}) => {
    const comment = new Comment({
        text: input.text,
        task: task.id,
        author: user.id
    });

    await comment.save();

    // populate comment with specific fields
    await comment.populate([
        {path: "task", select: "_id title"},
        {path: "author", select: "_id name email"}
    ]);

    return comment;
}

export const getCommentsByTaskService = async ({task}: { task: ITaskPlain }) => {
    const comments = await Comment.find({task: task.id}).sort({createdAt: -1})
        .populate([
            {path: "task", select: "_id title"},
            {path: "author", select: "_id name email"}
        ]);

    return comments;
}

export const getCommentsByIdService = async ({task}: { task: ITaskPlain }) => {
    const comment = await Comment.findById({task: task.id})
        .populate([
            {path: "author", select: "_id name email"},
            {
                path: 'task',
                select: '_id title',
                populate: {
                    path: 'list',
                    select: '_id name',
                    populate: {
                        path: 'board',
                        select: '_id name owner members'
                    }
                }
            }
        ]);

    return comment;
}