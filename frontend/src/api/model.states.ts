import type {IBoard, IComment, IList, ITask, IWorkspace} from "../models";

export interface IWorkspaceState {
    workspaces: IWorkspace[]
    loading: boolean
    error: string | null
}

export interface IBoardState {
    boardsByWorkspace: {
        [workspaceId: string]: IBoard[];
    }
    loading: boolean;
    error: string | null;
}

export interface IListState {
    listsByBoard: {
        [boardId: string]: IList[];
    }
    loading: boolean;
    error: string | null;
}

export interface ITaskState {
    tasksByList: {
        [listId: string]: ITask[];
    };
    loading: boolean;
    error: string | null;
}

export interface ICommentState {
    commentsByTask: {
        [taskId: string]: IComment[];
    }
    loading: boolean;
    error: string | null;
}