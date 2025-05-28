import {IWorkspace} from "../../models/Workspace";
import {IBoard} from "../../models/Board";
import List, {IList} from "../../models/List";
import Task from "../../models/Task";

export const userHasWorkspaceAccess = async ({workspace, userId}: { workspace: IWorkspace, userId: string }): Promise<boolean> => {
    const populatedWorkspace = await Workspace.findById(workspace._id)
        .populate([
            {path: 'owner', select: '_id name email'},
            {path: 'members', select: '_id name email'},
        ]);

    if (!populatedWorkspace) {
        console.warn("Workplace not found during access check");
        return false;
    }

    const isOwner = populatedWorkspace.owner.toString() === userId;
    const isMember = populatedWorkspace.members.some(member => member._id.toString() === userId);
    return isOwner || isMember;
}

export const userHasBoardAccess = async ({board, userId}: { board: IBoard, userId: string }): Promise<boolean> => {
    const populatedBoard = await Workspace.findById(workspace._id)
        .populate([
            {path: 'owner', select: '_id name email'},
            {path: 'members', select: '_id name email'},
        ]);

    if (!populatedBoard) {
        console.warn("Workplace not found during access check");
        return false;
    }

    const isOwner = populatedBoard.owner.toString() === userId;
    const isMember = populatedBoard.members.some(member => member._id.toString() === userId);
    return isOwner || isMember;
}

export const userHasListAccess = async ({list, userId}: { list: IList, userId: string }): Promise<boolean> => {
    const populatedList = await List.findById(list._id)
        .populate({
            path: 'board',
            select: '_id name owner members',
        });

    if (!populatedList) {
        console.warn("List not found during access check");
        return false;
    }

    const board = populatedList.board as IBoard | null;
    if (!board) {
        console.warn("Board not found in list during access check");
        return false;
    }

    const isOwner = board.owner.toString() === userId;
    const isMember = board.members.some((member) => member._id.toString() === userId);

    return isOwner || isMember;
}

export const userHasTaskAccess = async ({task, userId}: { task: ITask, userId: string }): Promise<boolean> => {
    const populatedTask = await Task.findById(task._id)
        .populate({
            path: "list",
            populate: {
                path: "board",
                select: "owner members"
            }
        });

    if (!populatedTask) {
        console.warn("Task not found during access check");
        return false;
    }

    const list = populatedTask.list as IList | null;
    if (!list) {
        console.warn("List not found in task during access check");
        return false;
    }

    const board = list.board as IBoard | null;
    if (!board) {
        console.warn("Board not found in list during access check");
        return false;
    }

    const isOwner = board.owner.toString() === userId;
    const isMember = board.members.some((member) => member._id.toString() === userId);

    return isOwner || isMember;
}

export const UserHasCommentAccess = async ({comment, userId}: {
    comment: IComment,
    userId: string
}): Promise<boolean> => {
    const populatedComment = await Comment.findById(comment._id)
        .populate({
            path: "task",
            populate: {
                path: "list",
                populate: {
                    path: "board",
                    select: "owner members"
                }
            }
        });
    if (!populatedComment) {
        console.warn("Comment not found in comment during access check");
        return false;
    }


    const task = populatedComment.task as ITask | null;
    if (!task) {
        console.warn("Task not found in task during access check");
        return false;
    }

    const list = task.list as IList | null;
    if (!list) {
        console.warn("List not found in task during access check");
        return false;
    }

    const board = list.board as IBoard | null;
    if (!board) {
        console.warn("Board not found in list during access check");
        return false;
    }

    const isOwner = board.owner.toString() === userId;
    const isAuthor = populatedComment.author.toString() === userId;

    return isOwner || isAuthor;
}