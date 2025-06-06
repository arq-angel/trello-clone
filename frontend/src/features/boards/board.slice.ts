import {createSlice} from "@reduxjs/toolkit";
import type {IBoardState} from "../../api/model.states.ts";
import {createBoard, deleteBoard, fetchBoardsByWorkspaceId, updateBoard} from "./board.thunks.ts";

const initialState: IBoardState = {
    boardsByWorkspace: {},
    loading: false,
    error: null
};

const boardSlice = createSlice({
    name: "boards",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            // Fetch board by workspaceId
            .addCase(fetchBoardsByWorkspaceId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBoardsByWorkspaceId.fulfilled, (state, action) => {
                state.loading = false;
                const {workspaceId, boards} = action.payload;

                if (!state.boardsByWorkspace[workspaceId]) {
                    state.boardsByWorkspace[workspaceId] = [];
                }

                // Update or add each board individually
                for (const fetchedBoard of boards) {
                    const index = state.boardsByWorkspace[workspaceId].findIndex(b => b.id === fetchedBoard.id);

                    if (index !== -1) {
                        // Update existing board
                        state.boardsByWorkspace[workspaceId][index] = fetchedBoard;
                    } else {
                        // Add new board
                        state.boardsByWorkspace[workspaceId].push(fetchedBoard);
                    }
                }
            })
            .addCase(fetchBoardsByWorkspaceId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Failed to fetch boards";
            })

            // Create board
            .addCase(createBoard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBoard.fulfilled, (state, action) => {
                const createdBoard = action.payload;
                const workspace = createdBoard.workspace;
                state.loading = false;
                if (!state.boardsByWorkspace[workspace.id]) {
                    state.boardsByWorkspace[workspace.id] = []
                }
                state.boardsByWorkspace[workspace.id].push(createdBoard);
            })
            .addCase(createBoard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Failed to create board";
            })

            // Updated board
            .addCase(updateBoard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBoard.fulfilled, (state, action) => {
                const updatedBoard = action.payload;
                const workspaceId = updatedBoard.workspace.id;
                state.loading = false;

                // Ensure the workspace's boards array exists in the state
                if (!state.boardsByWorkspace[workspaceId]) {
                    state.boardsByWorkspace[workspaceId] = [];
                }

                const index = state.boardsByWorkspace[workspaceId].findIndex(b => b.id === updatedBoard.id);

                if (index !== -1) {
                    // Update existing board
                    state.boardsByWorkspace[workspaceId][index] = updatedBoard;
                } else {
                    // Add new board
                    state.boardsByWorkspace[workspaceId].push(updatedBoard);
                }
            })
            .addCase(updateBoard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Failed to update board";
            })

            // Delete board
            .addCase(deleteBoard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteBoard.fulfilled, (state, action) => {
                const boardId = action.payload;
                state.loading = false;
                for (const workspaceId in state.boardsByWorkspace) {
                    state.boardsByWorkspace[workspaceId] = state.boardsByWorkspace[workspaceId].filter(
                        (board) => board.id !== boardId
                    );
                }
            })
            .addCase(deleteBoard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Failed to delete board";
            });
    },
})

export default boardSlice.reducer;