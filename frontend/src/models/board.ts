import type {IUserShort} from "./user.ts";
import type {IWorkspaceShort} from "./workspace.ts";

export interface IBoard {
    id: string;
    name: string;
    owner: IUserShort,
    members: IUserShort[],
    workspace: IWorkspaceShort,
}

export interface IBoardShort {
    id: string;
    name: string;
}