import {createSlice} from "@reduxjs/toolkit";
import type {ICommentState} from "../../api/model.states.ts";
import {createComment, deleteComment, fetchCommentsByTaskId} from "./comment.thunks.ts";

const initialState: ICommentState = {
    commentsByTask: {},
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

const commentSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch comments
            .addCase(fetchCommentsByTaskId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCommentsByTaskId.fulfilled, (state, action) => {
                const {taskId, comments} = action.payload;
                state.loading = false;
                state.commentsByTask[taskId] = comments;
            })
            .addCase(fetchCommentsByTaskId.rejected, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.error = action.payload.message;
                    state.validationErrors = action.payload.errors ?? [];
                } else {
                    state.error = action.error.message ?? "Failed to fetch comments";
                    state.validationErrors = [];
                }
            })

            // Create comment
            .addCase(createComment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createComment.fulfilled, (state, action) => {
                const comment = action.payload;
                const task = comment.task;
                state.loading = false;
                if (!state.commentsByTask[task.id]) {
                    state.commentsByTask[task.id] = [];
                }
                state.commentsByTask[task.id].push(comment);
            })
            .addCase(createComment.rejected, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.error = action.payload.message;
                    state.validationErrors = action.payload.errors ?? [];
                } else {
                    state.error = action.error.message ?? "Failed to create comment";
                    state.validationErrors = [];
                }
            })

            // Delete comment
            .addCase(deleteComment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                const commentId = action.payload;
                state.loading = false;
                for (const taskId in state.commentsByTask) {
                    state.commentsByTask[taskId] = state.commentsByTask[taskId].filter(
                        (comment) => comment.id !== commentId
                    );
                }
            })
            .addCase(deleteComment.rejected, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.error = action.payload.message;
                    state.validationErrors = action.payload.errors ?? [];
                } else {
                    state.error = action.error.message ?? "Failed to delete comment";
                    state.validationErrors = [];
                }
            });
    },
})

export default commentSlice.reducer;