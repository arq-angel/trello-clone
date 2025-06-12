import type {IBoard, IComment, IList, ITask, IWorkspace} from "@/models";

interface ValidationError {
    path: (string | number)[];
    message: string
}

export interface IWorkspaceState {
    workspaces: IWorkspace[];
    loading: boolean;
    fetching: boolean;
    submitting: boolean;
    deleting: boolean;
    error: string | null;
    fetchError: string | null;
    createError: string | null;
    updateError: string | null;
    deleteError: string | null;
    validationErrors?: ValidationError[];
}

export interface IBoardState {
    boardsByWorkspace: {
        [workspaceId: string]: IBoard[];
    }
    loading: boolean;
    fetching: boolean;
    submitting: boolean;
    deleting: boolean;
    error: string | null;
    fetchError: string | null;
    createError: string | null;
    updateError: string | null;
    deleteError: string | null;
    validationErrors?: ValidationError[];
}

export interface IListState {
    listsByBoard: {
        [boardId: string]: IList[];
    }
    loading: boolean;
    fetching: boolean;
    submitting: boolean;
    deleting: boolean;
    error: string | null;
    fetchError: string | null;
    createError: string | null;
    updateError: string | null;
    deleteError: string | null;
    validationErrors?: ValidationError[];
}

export interface ITaskState {
    tasksByList: {
        [listId: string]: ITask[];
    };
    loading: boolean;
    fetching: boolean;
    submitting: boolean;
    deleting: boolean;
    error: string | null;
    fetchError: string | null;
    createError: string | null;
    updateError: string | null;
    deleteError: string | null;
    validationErrors?: ValidationError[];
}

export interface ICommentState {
    commentsByTask: {
        [taskId: string]: IComment[];
    }
    loading: boolean;
    fetching: boolean;
    submitting: boolean;
    deleting: boolean;
    error: string | null;
    fetchError: string | null;
    createError: string | null;
    updateError: string | null;
    deleteError: string | null;
    validationErrors?: ValidationError[];
}