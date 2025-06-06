import type {IBoardShort} from "./board.ts";

export interface IList {
    id: string;
    name: string;
    position: number;
    board: IBoardShort;
}

export interface IListShort {
    id: string;
    name: string;
}