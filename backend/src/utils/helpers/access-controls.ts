import Workspace, {IWorkspace} from "../../models/Workspace";
import Board, {IBoard} from "../../models/Board";
import List, {IList} from "../../models/List";
import Task, {ITask} from "../../models/Task";
import Comment, {IComment} from "../../models/Comment";
import {IUser} from "../../models/User";

export const userHasWorkspaceAccess = async ({workspace, userId}: {
    workspace: IWorkspace,
    userId: string
}): Promise<boolean> => {
    const populatedWorkspace = await Workspace.findById(workspace._id)
        .populate<{
            owner: IUser;
            members: IUser[];
        }>([
            {path: 'owner', select: '_id name email'},
            {path: 'members', select: '_id name email'},
        ]);

    const owner: IUser | undefined = populatedWorkspace?.owner;
    const members: IUser[] | undefined = populatedWorkspace?.members;

    if (!owner || !members) {
        console.warn("Workspace owner or members not found during access check");
        return false;
    }

    // Here both owner and members are populated with IUser objects so i have to use _id
    const isOwner = owner._id.toString() === userId;
    const isMember = members.some(memberObject => memberObject._id.toString() === userId);

    return isOwner || isMember;
};

export const userHasBoardAccess = async ({board, userId}: { board: IBoard, userId: string }): Promise<boolean> => {
    const populatedBoard = await Board.findById(board._id)
        .populate<{
            owner: IUser;
            members: IUser[]
        }>([
            {path: 'owner', select: '_id name email'},
            {path: 'members', select: '_id name email'},
        ]);

    const owner: IUser | undefined = populatedBoard?.owner;
    const members: IUser[] | undefined = populatedBoard?.members;

    if (!owner || !members) {
        console.warn("Board owner or members not found during access check");
        return false;
    }

    // Here both owner and members are populated with IUser objects so i have to use _id
    const isOwner = owner._id.toString() === userId;
    const isMember = members.some(memberObject => memberObject._id.toString() === userId);

    return isOwner || isMember;
};

export const userHasListAccess = async ({list, userId}: { list: IList, userId: string }): Promise<boolean> => {
    const populatedList = await List.findById(list._id)
        .populate<{
            board: IBoard;
        }>({
            path: 'board',
            select: '_id name owner members workspace',
        });

    if (!populatedList?.board) {
        console.warn("List, or board not found during access check");
        return false;
    }

    const board: IBoard = populatedList.board;

    if (!board?.owner || !board?.members) {
        console.warn("Board or its owner/members not found during access check");
        return false;
    }

    // Here both owner and members are only ObjectId so i have to use without _id
    const isOwner = board.owner.toString() === userId;
    const isMember = board.members.some(memberId => memberId.toString() === userId);

    return isOwner || isMember;
};

export const userHasTaskAccess = async ({task, userId}: { task: ITask, userId: string }): Promise<boolean> => {
    const populatedTask = await Task.findById(task._id)
        .populate<{
            list: IList & {
                board: IBoard;
            };
        }>({
            path: "list",
            select: "_id name board position",
            populate: {
                path: "board",
                select: "_id name owner members workspace"
            }
        });

    if (!populatedTask?.list?.board) {
        console.warn("Task, list, or board not found during access check");
        return false;
    }

    const board: IBoard = populatedTask.list.board;

    if (!board?.owner || !board?.members) {
        console.warn("Board or its owner/members not found during access check");
        return false;
    }

    // Here both owner and members are only ObjectId so i have to use without _id
    const isOwner = board.owner.toString() === userId;
    const isMember = board.members.some(memberId => memberId.toString() === userId);

    return isOwner || isMember;
};

export const UserHasCommentAccess = async ({comment, userId}: {
    comment: IComment,
    userId: string
}): Promise<boolean> => {
    const populatedComment = await Comment.findById(comment._id)
        .populate<{
            task: ITask & {
                list: IList & {
                    board: IBoard;
                };
            };
        }>({
            path: "task",
            select: "_id title description list position dueDate priority",
            populate: {
                path: "list",
                select: "_id name board position",
                populate: {
                    path: "board",
                    select: "_id name owner members workspace",
                }
            }
        });

    if (!populatedComment?.task?.list?.board) {
        console.warn("Comment, task, list, or board not found during access check");
        return false;
    }

    const board: IBoard = populatedComment.task.list.board;

    if (!board?.owner) {
        console.warn("Board or its owner not found during access check");
        return false;
    }

    // Here both owner and members are only ObjectId so i have to use without _id
    const isOwner = board.owner.toString() === userId;
    const isAuthor = populatedComment.author.toString() === userId;

    return isOwner || isAuthor;
}
