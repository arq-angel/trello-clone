import {IUserShort, toUserShort} from "./user.plain";
import {IBoard} from "../models/Board";
import {IWorkspaceShort, toWorkspaceShort} from "./workspace.plain";
import mongoose from "mongoose";

export interface IBoardPlain {
    id: string;
    name: string;
    owner: IUserShort;
    members: IUserShort[];
    workspaceId: IWorkspaceShort;
}

export interface IBoardShort {
    id: string;
    name: string;
}

export const toBoardPlain = (board: IBoard): IBoardPlain => {
    return {
        id: board._id.toString(),
        name: board.name,
        owner: toUserShort(board.owner),
        members: board.members.map(toUserShort),
        workspaceId: toWorkspaceShort(board.workspaceId),
    };
};

export const toBoardShort = (board: IBoard | mongoose.Types.ObjectId | string): IBoardShort => {
    if (!board) return {id: '', name: ''};

    if (typeof board === 'string' || board instanceof mongoose.Types.ObjectId) {
        return {id: board.toString(), name: ''};
    }

    return {
        id: board._id.toString() ?? '',
        name: board.name ?? '',
    }
}