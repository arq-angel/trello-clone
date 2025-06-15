import {createSlice} from "@reduxjs/toolkit";
import type {IListState} from "../../api/model.states.ts";
import {createList, deleteList, fetchListsByBoardId, moveList, updateList} from "./list.thunks.ts";


const initialState: IListState = {
    listsByBoard: {},
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

const listSlice = createSlice({
    name: "lists",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            // Fetch lists by boardId
            .addCase(fetchListsByBoardId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchListsByBoardId.fulfilled, (state, action) => {
                state.loading = false;
                const {boardId, lists} = action.payload;

                // Sort lists by position before storing them
                const sortedLists = [...lists].sort((a, b) => a.position - b.position);

                // Replace the lists for this board
                state.listsByBoard[boardId] = sortedLists;
            })
            .addCase(fetchListsByBoardId.rejected, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.error = action.payload.message;
                    state.validationErrors = action.payload.errors ?? [];
                } else {
                    state.error = action.error.message ?? "Failed to fetch lists";
                    state.validationErrors = [];
                }
            })

            // Create list
            .addCase(createList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createList.fulfilled, (state, action) => {
                const createdList = action.payload;
                const board = createdList.board;
                state.loading = false;
                if (!state.listsByBoard[board.id]) {
                    state.listsByBoard[board.id] = []
                }
                state.listsByBoard[board.id].push(createdList);

                // After upserting the task into the array
                state.listsByBoard[board.id].sort((a, b) => a.position - b.position);

            })
            .addCase(createList.rejected, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.error = action.payload.message;
                    state.validationErrors = action.payload.errors ?? [];
                } else {
                    state.error = action.error.message ?? "Failed to create list";
                    state.validationErrors = [];
                }
            })

            // Updated list
            .addCase(updateList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateList.fulfilled, (state, action) => {
                const updatedList = action.payload;
                const boardId = updatedList.board.id;
                state.loading = false;

                // Ensure the board's lists array exists in the state
                if (!state.listsByBoard[boardId]) {
                    state.listsByBoard[boardId] = [];
                }

                const lists = state.listsByBoard[boardId];
                const index = lists.findIndex(list => list.id === updatedList.id);

                if (index !== -1) {
                    // Replace the existing board with the updated one
                    lists[index] = updatedList;
                } else {
                    // If not found (edge case), add the board
                    lists.push(updatedList);

                    // After upserting the task into the array
                    state.listsByBoard[boardId].sort((a, b) => a.position - b.position);
                }
            })
            .addCase(updateList.rejected, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.error = action.payload.message;
                    state.validationErrors = action.payload.errors ?? [];
                } else {
                    state.error = action.error.message ?? "Failed to update list";
                    state.validationErrors = [];
                }
            })

            // Move list
            .addCase(moveList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(moveList.fulfilled, (state, action) => {
                const updatedList = action.payload;
                const boardId = updatedList.board.id;
                state.loading = false;

                // Ensure the board's lists array exists in the state
                if (!state.listsByBoard[boardId]) {
                    state.listsByBoard[boardId] = [];
                }

                const lists = state.listsByBoard[boardId];
                const index = lists.findIndex(b => b.id === updatedList.id);

                if (index !== -1) {
                    // Replace the existing board with the updated one
                    lists[index] = updatedList;
                } else {
                    // If not found (edge case), add the board
                    lists.push(updatedList);

                    // After upserting the task into the array
                    state.listsByBoard[boardId].sort((a, b) => a.position - b.position);
                }
            })
            .addCase(moveList.rejected, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.error = action.payload.message;
                    state.validationErrors = action.payload.errors ?? [];
                } else {
                    state.error = action.error.message ?? "Failed to move list";
                    state.validationErrors = [];
                }
            })

            // Delete list
            .addCase(deleteList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteList.fulfilled, (state, action) => {
                const listId = action.payload;
                state.loading = false;
                for (const boardId in state.listsByBoard) {
                    state.listsByBoard[boardId] = state.listsByBoard[boardId].filter(
                        (list) => list.id !== listId
                    );
                }
            })
            .addCase(deleteList.rejected, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.error = action.payload.message;
                    state.validationErrors = action.payload.errors ?? [];
                } else {
                    state.error = action.error.message ?? "Failed to delete list";
                    state.validationErrors = [];
                }
            });
    },
})

export default listSlice.reducer;