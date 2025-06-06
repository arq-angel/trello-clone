import {createAsyncThunk} from "@reduxjs/toolkit";
import type {IComment} from "../../models";
import {createCommentAPI, deleteCommentAPI, fetchCommentsByTaskIdAPI} from "../../api/comment.service.ts";
import {handleThunkError, type RejectedPayload} from "../../utils/handleThunkError.ts";
import type {ICreateCommentParams} from "../../schemas";

export const fetchCommentsByTaskId = createAsyncThunk<
    { taskId: string, comments: IComment[] },
    { taskId: string },
    { rejectValue: RejectedPayload }
>(
    "comments/task/taskId",
    async ({taskId}, {rejectWithValue}) => {
        try {
            const comments: IComment[] = await fetchCommentsByTaskIdAPI({taskId});
            return {taskId, comments}
        } catch (error) {
            return handleThunkError(error, rejectWithValue);
        }
    }
);

export const createComment = createAsyncThunk<
    IComment,
    ICreateCommentParams,
    { rejectValue: RejectedPayload }
>(
    "comments/create",
    async (payload: ICreateCommentParams, {rejectWithValue}) => {
        try {
            const comment: IComment = await createCommentAPI({payload});
            return comment;
        } catch (error) {
            return handleThunkError(error, rejectWithValue);
        }
    }
);

export const deleteComment = createAsyncThunk<
    string,
    { commentId: string },
    { rejectValue: RejectedPayload }
>(
    "comments/delete",
    async ({commentId}, {rejectWithValue}) => {
        try {
            const deletedCommentId = await deleteCommentAPI({commentId});
            return deletedCommentId;
        } catch (error) {
            return handleThunkError(error, rejectWithValue);
        }
    });