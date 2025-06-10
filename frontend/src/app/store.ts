import {configureStore} from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth.slice";
import workspaceReducer from "../features/workspaces/workspace.slice";
import boardReducer from "../features/boards/board.slice";
import listReducer from "../features/lists/list.slice";
import taskReducer from "../features/tasks/task.slice";
import commentReducer from "../features/comments/comment.slice";
import selectedWorkspaceReducer from "../features/workspaces/selectedWorkspace.slice.ts";
import selectedBoardReducer from "../features/boards/selectedBoard.slice.ts";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        workspaces: workspaceReducer,
        boards: boardReducer,
        lists: listReducer,
        tasks: taskReducer,
        comments: commentReducer,

        selectedWorkspace: selectedWorkspaceReducer,
        selectedBoard: selectedBoardReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;