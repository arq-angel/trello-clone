import {IList} from "../models/List";
import {IBoardShort, toBoardShort} from "./board.plain";
import mongoose from "mongoose";

export interface IListPlain {
    id: string;
    name: string;
    board: IBoardShort;
    position: number;
}

export interface IListShort {
    id: string;
    name: string;
}

export const toListPlain = (list: IList): IListPlain => {
    return {
        id: list._id.toString(),
        name: list.name,
        board: toBoardShort(list.board),
        position: list.position,
    }
}

export const toListShort = (list: IList | mongoose.Types.ObjectId | string): IListShort => {
    if (!list) return {id: '', name: ''};

    if (typeof list === 'string' || list instanceof mongoose.Types.ObjectId) {
        return {
            id: list.toString(),
            name: ''
        }
    }

    return {
        id: list._id.toString(),
        name: list.name,
    }
}