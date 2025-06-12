import {createSlice} from "@reduxjs/toolkit";
import type {IBoardState} from "@/api/model.states.ts";
import {createBoard, deleteBoard, fetchBoardsByWorkspaceId, updateBoard} from "./board.thunks.ts";

const initialState: IBoardState = {
    boardsByWorkspace: {},
    loading: false,
    fetching: false,
    submitting: false,
    deleting: false,
    error: null,
    fetchError: null,
    createError: null,
    updateError: null,
    deleteError: null,
    validationErrors: [],
};

const boardSlice = createSlice({
    name: "boards",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            // Fetch board by workspaceId
            .addCase(fetchBoardsByWorkspaceId.pending, (state) => {
                state.fetching = true;
                state.fetchError = null;
                state.validationErrors = [];
            })
            .addCase(fetchBoardsByWorkspaceId.fulfilled, (state, action) => {
                state.fetching = false;
                state.fetchError = null;
                state.validationErrors = [];

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
                state.fetching = false;

                if (action.payload) {
                    state.fetchError = action.payload.message;
                    state.validationErrors = action.payload.errors ?? [];
                } else {
                    state.fetchError = action.error.message ?? "Failed to fetch boards";
                    state.validationErrors = [];
                }
            })

            // Create board
            .addCase(createBoard.pending, (state) => {
                state.submitting = true;
                state.createError = null;
                state.validationErrors = [];
            })
            .addCase(createBoard.fulfilled, (state, action) => {
                state.submitting = false;
                state.createError = null;
                state.validationErrors = [];

                const createdBoard = action.payload;
                const workspace = createdBoard.workspace;
                state.loading = false;
                if (!state.boardsByWorkspace[workspace.id]) {
                    state.boardsByWorkspace[workspace.id] = []
                }
                state.boardsByWorkspace[workspace.id].push(createdBoard);
            })
            .addCase(createBoard.rejected, (state, action) => {
                state.submitting = false;

                if (action.payload) {
                    state.createError = action.payload.message;
                    state.validationErrors = action.payload.errors ?? [];
                } else {
                    state.createError = action.error.message ?? "Failed to create board";
                    state.validationErrors = [];
                }
            })

            // Updated board
            .addCase(updateBoard.pending, (state) => {
                state.submitting = true;
                state.updateError = null;
                state.validationErrors = [];
            })
            .addCase(updateBoard.fulfilled, (state, action) => {
                state.submitting = false;
                state.updateError = null;
                state.validationErrors = [];

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
                state.submitting = false;

                if (action.payload) {
                    state.updateError = action.payload.message;
                    state.validationErrors = action.payload.errors ?? [];
                } else {
                    state.updateError = action.error.message ?? "Failed to update board";
                    state.validationErrors = [];
                }
            })

            // Delete board
            .addCase(deleteBoard.pending, (state) => {
                state.deleting = true;
                state.deleteError = null;
                state.validationErrors = [];
            })
            .addCase(deleteBoard.fulfilled, (state, action) => {
                state.deleting = false;
                state.deleteError = null;
                state.validationErrors = [];

                const boardId = action.payload;
                state.loading = false;
                for (const workspaceId in state.boardsByWorkspace) {
                    state.boardsByWorkspace[workspaceId] = state.boardsByWorkspace[workspaceId].filter(
                        (board) => board.id !== boardId
                    );
                }
            })
            .addCase(deleteBoard.rejected, (state, action) => {
                state.deleting = false;

                if (action.payload) {
                    state.deleteError = action.payload.message;
                    state.validationErrors = action.payload.errors ?? [];
                } else {
                    state.deleteError = action.error.message ?? "Failed to delete board";
                    state.validationErrors = [];
                }
            });
    },
})

export default boardSlice.reducer;