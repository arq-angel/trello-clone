import {createAsyncThunk} from "@reduxjs/toolkit";
import type {IBoard} from "../../models";
import {
    createBoardAPI,
    deleteBoardAPI,
    fetchBoardsByWorkspaceIdAPI,
    fetchSingleBoardByBoardIdAPI,
    updateBoardAPI
} from "../../api/board.service.ts";
import {handleThunkError, type RejectedPayload} from "../../utils/handleThunkError.ts";
import type {ICreateBoardParams, IUpdateBoardParams} from "../../schemas";

export const fetchSingleBoardByBoardId = createAsyncThunk<
    IBoard,
    { boardId: string },
    { rejectValue: RejectedPayload }
>(
    "boards/fetchSingle",
    async ({boardId}, {rejectWithValue}) => {
        try {
            const board: IBoard = await fetchSingleBoardByBoardIdAPI({boardId});
            return board; // return so it goes to `.fulfilled`
        } catch (error) {
            return handleThunkError(error, rejectWithValue); // return the rejectWithValue
        }
    }
);

export const fetchBoardsByWorkspaceId = createAsyncThunk<
    { workspaceId: string, boards: IBoard[] },
    { workspaceId: string },
    { rejectValue: RejectedPayload }
>(
    "boards/workspace/workspaceId",
    async ({workspaceId}, {rejectWithValue}) => {
        try {
            const boards: IBoard[] = await fetchBoardsByWorkspaceIdAPI({workspaceId});
            return {workspaceId, boards}
        } catch (error) {
            return handleThunkError(error, rejectWithValue);
        }
    }
);

export const createBoard = createAsyncThunk<
    IBoard,
    ICreateBoardParams,
    { rejectValue: RejectedPayload }
>(
    "boards/create",
    async (payload: ICreateBoardParams, {rejectWithValue}) => {
        try {
            const board: IBoard = await createBoardAPI({payload});
            return board;
        } catch (error) {
            return handleThunkError(error, rejectWithValue);
        }
    }
);

export const updateBoard = createAsyncThunk<
    IBoard,
    { boardId: string, payload: IUpdateBoardParams },
    { rejectValue: RejectedPayload }
>(
    "boards/update",
    async ({boardId, payload}, {rejectWithValue}) => {
        try {
            const board: IBoard = await updateBoardAPI({boardId, payload});
            return board;
        } catch (error) {
            return handleThunkError(error, rejectWithValue);
        }
    }
);

export const deleteBoard = createAsyncThunk<
    string,
    { boardId: string },
    { rejectValue: RejectedPayload }
>(
    "boards/delete",
    async ({boardId}, {rejectWithValue}) => {
        try {
            const deletedBoardId = await deleteBoardAPI({boardId});
            return deletedBoardId;
        } catch (error) {
            return handleThunkError(error, rejectWithValue);
        }
    });