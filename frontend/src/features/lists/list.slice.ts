import {createSlice} from "@reduxjs/toolkit";
import type {IListState} from "../../api/model.states.ts";
import {createList, deleteList, fetchListsByBoardId, moveList, updateList} from "./list.thunks.ts";


const initialState: IListState = {
    listsByBoard: {},
    loading: false,
    error: null
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

                if (!state.listsByBoard[boardId]) {
                    state.listsByBoard[boardId] = [];
                }

                // Update or add each list individually
                for (const fetchedList of lists) {
                    const index = state.listsByBoard[boardId].findIndex(b => b.id === fetchedList.id);

                    if (index !== -1) {
                        // Update existing list
                        state.listsByBoard[boardId][index] = fetchedList;
                    } else {
                        // Add new list
                        state.listsByBoard[boardId].push(fetchedList);
                    }
                }
            })
            .addCase(fetchListsByBoardId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Failed to fetch lists";
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
                state.error = action.error.message ?? "Failed to create list";
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
                state.error = action.error.message ?? "Failed to update list";
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
                state.error = action.error.message ?? "Failed to update list";
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
                state.error = action.error.message ?? "Failed to delete list";
            });
    },
})

export default listSlice.reducer;