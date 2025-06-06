import type {IUserShort} from "./user.ts";

export interface IWorkspace {
    id: string;
    name: string;
    owner: IUserShort,
    members: IUserShort[]
}

export interface IWorkspaceShort {
    id: string;
    name: string;
}