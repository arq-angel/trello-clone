import {createAsyncThunk} from "@reduxjs/toolkit";
import type {IList} from "../../models";
import {
    createListAPI,
    deleteListAPI,
    fetchListsByBoardIdAPI, fetchSingleListByListIdAPI,
    moveListAPI,
    updateListAPI
} from "../../api/list.service.ts";
import {handleThunkError, type RejectedPayload} from "../../utils/handleThunkError.ts";
import type {
    ICreateListParams,
    IMoveListParams,
    IUpdateListParams
} from "../../schemas";

export const fetchSingleListByListId = createAsyncThunk<
    IList,
    { listId: string },
    { rejectValue: RejectedPayload }
>(
    "lists/fetchSingle",
    async ({listId}, {rejectWithValue}) => {
        try {
            const list: IList = await fetchSingleListByListIdAPI({listId});
            return list; // return so it goes to `.fulfilled`
        } catch (error) {
            return handleThunkError(error, rejectWithValue); // return the rejectWithValue
        }
    }
);

export const fetchListsByBoardId = createAsyncThunk<
    { boardId: string, lists: IList[] },
    { boardId: string },
    { rejectValue: RejectedPayload }
>(
    "lists/board/boardId",
    async ({boardId}, {rejectWithValue}) => {
        try {
            const lists: IList[] = await fetchListsByBoardIdAPI({boardId});
            return {boardId, lists}
        } catch (error) {
            return handleThunkError(error, rejectWithValue);
        }
    }
);

export const createList = createAsyncThunk<
    IList,
    ICreateListParams,
    { rejectValue: RejectedPayload }
>(
    "lists/create",
    async (payload: ICreateListParams, {rejectWithValue}) => {
        try {
            const list: IList = await createListAPI({payload});
            return list;
        } catch (error) {
            return handleThunkError(error, rejectWithValue);
        }
    }
);

export const updateList = createAsyncThunk<
    IList,
    { listId: string, payload: IUpdateListParams },
    { rejectValue: RejectedPayload }
>(
    "lists/update",
    async ({listId, payload}, {rejectWithValue}) => {
        try {
            const list: IList = await updateListAPI({listId, payload});
            return list;
        } catch (error) {
            return handleThunkError(error, rejectWithValue);
        }
    }
);

export const moveList = createAsyncThunk<
    IList,
    { listId: string, payload: IMoveListParams },
    { rejectValue: RejectedPayload }
>(
    "lists/move",
    async ({listId, payload}, {rejectWithValue}) => {
        try {
            const list: IList = await moveListAPI({listId, payload});
            return list;
        } catch (error) {
            return handleThunkError(error, rejectWithValue);
        }
    }
);

export const deleteList = createAsyncThunk<
    string,
    { listId: string },
    { rejectValue: RejectedPayload }
>(
    "lists/delete",
    async ({listId}, {rejectWithValue}) => {
        try {
            const deletedListId = await deleteListAPI({listId});
            return deletedListId;
        } catch (error) {
            return handleThunkError(error, rejectWithValue);
        }
    });
