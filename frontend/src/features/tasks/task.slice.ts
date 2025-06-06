import {createSlice} from "@reduxjs/toolkit";
import type {ITaskState} from "../../api/model.states.ts";
import {createTask, deleteTask, fetchTasksByListId, moveTask, updateTask} from "./task.thunks.ts";

const initialState: ITaskState = {
    tasksByList: {},
    loading: false,
    error: null,
};

const taskSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            // Fetch tasks by listId
            .addCase(fetchTasksByListId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasksByListId.fulfilled, (state, action) => {
                state.loading = false;
                const {listId, tasks} = action.payload;

                if (!state.tasksByList[listId]) {
                    state.tasksByList[listId] = [];
                }

                // Update or add each task individually
                for (const fetchedTask of tasks) {
                    const index = state.tasksByList[listId].findIndex(b => b.id === fetchedTask.id);

                    if (index !== -1) {
                        // Update existing task
                        state.tasksByList[listId][index] = fetchedTask;
                    } else {
                        // Add new task
                        state.tasksByList[listId].push(fetchedTask);
                    }
                }
            })
            .addCase(fetchTasksByListId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Failed to fetch tasks";
            })

            // Create task
            .addCase(createTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                const createdTask = action.payload;
                const list = createdTask.list;
                state.loading = false;
                if (!state.tasksByList[list.id]) {
                    state.tasksByList[list.id] = [];
                }
                state.tasksByList[list.id].push(createdTask);

                // After upserting the task into the array
                state.tasksByList[list.id].sort((a, b) => a.position - b.position);
            })
            .addCase(createTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Failed to create task";
            })

            // Update task
            .addCase(updateTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const updatedTask = action.payload;
                const listId = updatedTask.list?.id;
                if (!listId) return;

                state.loading = false;

                // Ensure the lists's tasks array exists in the state
                if (!state.tasksByList[listId]) {
                    state.tasksByList[listId] = [];
                }

                const tasks = state.tasksByList[listId];
                const index = tasks.findIndex(task => task.id === updatedTask.id);

                if (index !== -1) {
                    // Replace the existing list with the updated one
                    tasks[index] = updatedTask;
                } else {
                    // If not found (edge case), add the list
                    tasks.push(updatedTask);

                    // After upserting the task into the array
                    state.tasksByList[listId].sort((a, b) => a.position - b.position);
                }
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Failed to update list";
            })

            // Move task
            .addCase(moveTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(moveTask.fulfilled, (state, action) => {
                const updatedTask = action.payload;
                const listId = updatedTask.list?.id;
                if (!listId) return;

                state.loading = false;

                // Ensure the lists's tasks array exists in the state
                if (!state.tasksByList[listId]) {
                    state.tasksByList[listId] = [];
                }

                const tasks = state.tasksByList[listId];
                const index = tasks.findIndex(task => task.id === updatedTask.id);

                if (index !== -1) {
                    // Replace the existing list with the updated one
                    tasks[index] = updatedTask;
                } else {
                    // If not found (edge case), add the list
                    tasks.push(updatedTask);

                    // After upserting the task into the array
                    state.tasksByList[listId].sort((a, b) => a.position - b.position);
                }
            })
            .addCase(moveTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Failed to update list";
            })

            // Delete task
            .addCase(deleteTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                const taskId = action.payload;
                state.loading = false;
                for (const listId in state.tasksByList) {
                    state.tasksByList[listId] = state.tasksByList[listId].filter(
                        (task) => task.id !== taskId
                    );
                }
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Failed to delete task";
            });
    },
});

export default taskSlice.reducer;
