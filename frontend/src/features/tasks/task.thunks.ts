import {createAsyncThunk} from "@reduxjs/toolkit";
import type {ITask} from "../../models";
import {
    createTaskAPI,
    deleteTaskAPI, fetchSingleTaskByTaskIdAPI,
    fetchTasksByListIdAPI,
    moveTaskAPI,
    updateTaskAPI
} from "../../api/task.service.ts";
import {handleThunkError, type RejectedPayload} from "../../utils/handleThunkError.ts";
import type {ICreateTaskParams, IMoveTaskParams, IUpdateTaskParams} from "../../schemas";

export const fetchSingleTaskByTaskId = createAsyncThunk<
    ITask,
    { taskId: string },
    { rejectValue: RejectedPayload }
>(
    "tasks/fetchSingle",
    async ({taskId}, {rejectWithValue}) => {
        try {
            const task: ITask = await fetchSingleTaskByTaskIdAPI({taskId});
            return task;
        } catch (error) {
            return handleThunkError(error, rejectWithValue);
        }
    }
);

export const fetchTasksByListId = createAsyncThunk<
    { listId: string, tasks: ITask[] },
    { listId: string },
    { rejectValue: RejectedPayload }
>(
    "tasks/list/listId",
    async ({listId}, {rejectWithValue}) => {
        try {
            const tasks: ITask[] = await fetchTasksByListIdAPI({listId});
            return {listId, tasks}
        } catch (error) {
            return handleThunkError(error, rejectWithValue);
        }
    }
);

export const createTask = createAsyncThunk<
    ITask,
    ICreateTaskParams,
    { rejectValue: RejectedPayload }
>(
    "tasks/create",
    async (payload: ICreateTaskParams, {rejectWithValue}) => {
        try {
            const task: ITask = await createTaskAPI({payload});
            return task;
        } catch (error) {
            return handleThunkError(error, rejectWithValue);
        }
    }
);

export const updateTask = createAsyncThunk<
    ITask,
    { taskId: string, payload: IUpdateTaskParams },
    { rejectValue: RejectedPayload }
>(
    "tasks/update",
    async ({taskId, payload}, {rejectWithValue}) => {
        try {
            const task: ITask = await updateTaskAPI({taskId, payload});
            return task;
        } catch (error) {
            return handleThunkError(error, rejectWithValue);
        }
    }
);

export const moveTask = createAsyncThunk<
    ITask,
    { taskId: string, payload: IMoveTaskParams },
    { rejectValue: RejectedPayload }
>(
    "tasks/move",
    async ({taskId, payload}, {rejectWithValue}) => {
        try {
            const task: ITask = await moveTaskAPI({taskId, payload});
            return task;
        } catch (error) {
            return handleThunkError(error, rejectWithValue);
        }
    }
);

export const deleteTask = createAsyncThunk<
    string,
    { taskId: string },
    { rejectValue: RejectedPayload }
>(
    "tasks/delete",
    async ({taskId}, {rejectWithValue}) => {
        try {
            const deletedTaskId = await deleteTaskAPI({taskId});
            return deletedTaskId;
        } catch (error) {
            return handleThunkError(error, rejectWithValue);
        }
    });