import { useAppDispatch, useAppSelector } from "@/hooks";
import toast from "react-hot-toast";
import { handleApiError } from "@/utils/handleApiError";
import type { IComment } from "@/models";
import type { FieldValues, UseFormSetError } from "react-hook-form";
import { useCallback } from "react";
import {
    createComment,
    deleteComment,
    fetchCommentsByTaskId,
} from "@/features/comments/comment.thunks.ts";

export const useCommentActions = <TFieldValues extends FieldValues = FieldValues>(
    setError?: UseFormSetError<TFieldValues>
) : {
    createComment: typeof createCommentAction;
    deleteComment: typeof deleteCommentAction;
    fetchAllComments: typeof fetchAllCommentsAction;
}=> {
    const dispatch = useAppDispatch();

    const createCommentAction = useCallback(async (text: string, taskId: string) => {
        try {
            const newComment: IComment = await dispatch(createComment({ text, taskId })).unwrap();
            toast.success("Comment created successfully.");
            return { success: true, data: newComment };
        } catch (error) {
            handleApiError(error, setError);
            return { success: false, error };
        }
    }, [dispatch, setError]);

    const deleteCommentAction = useCallback(async (commentId: string) => {
        try {
            await dispatch(deleteComment({ commentId })).unwrap();
            toast.success("Comment deleted successfully.");
            return { success: true };
        } catch (error) {
            handleApiError(error, setError);
            return { success: false, error };
        }
    }, [dispatch, setError]);

    const fetchAllCommentsAction = useCallback(async (taskId: string) => {
        try {
            const comments = await dispatch(fetchCommentsByTaskId({ taskId })).unwrap();
            return { success: true, data: comments };
        } catch (error) {
            handleApiError(error, setError);
            return { success: false, error };
        }
    }, [dispatch, setError]);

    return {
        createComment: createCommentAction,
        deleteComment: deleteCommentAction,
        fetchAllComments: fetchAllCommentsAction,
    };
};

export const useCommentState = () => {
    return useAppSelector((state) => state.comments);
};

export const useComments = (taskId?: string): IComment[] => {
    const { commentsByTask } = useCommentState();
    if (!taskId) return [];
    return commentsByTask[taskId] ?? [];
};

export const useCommentsLoading = (): boolean =>
    useAppSelector((state) => state.comments.fetching);

export const useCommentsError = (): string | null =>
    useAppSelector((state) => state.comments.fetchError);
