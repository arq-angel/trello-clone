import {createSlice} from "@reduxjs/toolkit";
import type {ICommentState} from "../../api/model.states.ts";
import {createComment, deleteComment, fetchCommentsByTaskId} from "./comment.thunks.ts";

const initialState: ICommentState = {
    commentsByTask: {},
    loading: false,
    error: null
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
                state.error = action.error.message ?? "Failed to fetch comments";
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
                state.error = action.error.message ?? "Failed to create comment";
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
                state.error = action.error.message ?? "Failed to delete comment";
            });
    },
})

export default commentSlice.reducer;