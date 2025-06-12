import {useAppDispatch, useAppSelector} from "@/hooks";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import {handleApiError} from "@/utils/handleApiError";
import type {IBoard} from "@/models";
import type {FieldValues, UseFormSetError} from "react-hook-form";
import {useCallback} from "react";
import {
    createBoard,
    deleteBoard,
    fetchBoardsByWorkspaceId,
    fetchSingleBoardByBoardId,
    updateBoard
} from "@/features/boards/board.thunks.ts";
import {setSelectedBoard} from "@/features/boards/selectedBoard.slice.ts";

export const useBoardActions = <TFieldValues extends FieldValues = FieldValues>(
    setError?: UseFormSetError<TFieldValues>
): {
    createBoard: typeof createBoardAction;
    deleteBoard: typeof deleteBoardAction;
    updateBoard: typeof updateBoardAction;
    fetchBoard: typeof fetchBoardAction;
    fetchAllBoards: typeof fetchAllBoardsAction;
} => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const createBoardAction = useCallback(async (name: string, workspaceId: string) => {
        try {
            const newBoard: IBoard = await dispatch(createBoard({name, workspaceId})).unwrap();
            dispatch(setSelectedBoard(newBoard));
            toast.success("Board created successfully.");
            navigate(`/workspaces/${workspaceId}/boards/${newBoard.id}/lists`);
            return {success: true, data: newBoard};
        } catch (error) {
            handleApiError(error, setError);
            return {success: false, error};
        }
    }, [dispatch, navigate, setError]);

    const deleteBoardAction = useCallback(async (boardId: string) => {
        try {
            await dispatch(deleteBoard({boardId})).unwrap();
            toast.success("Board deleted successfully.");
            return {success: true};
        } catch (error) {
            handleApiError(error, setError);
            return {success: false, error};
        }
    }, [dispatch, setError]);

    const updateBoardAction = useCallback(async (boardId: string, name: string, workspaceId: string) => {
        try {
            const updatedBoard = await dispatch(updateBoard({boardId, payload: {name, workspaceId}})).unwrap();
            toast.success("Board updated successfully.");
            return {success: true, data: updatedBoard};
        } catch (error) {
            handleApiError(error, setError);
            return {success: false, error};
        }
    }, [dispatch, setError]);

    const fetchBoardAction = useCallback(async (boardId: string) => {
        try {
            const board = await dispatch(fetchSingleBoardByBoardId({boardId})).unwrap();
            return {success: true, data: board};
        } catch (error) {
            handleApiError(error, setError);
            return {success: false, error};
        }
    }, [dispatch, setError]);

    const fetchAllBoardsAction = useCallback(async (workspaceId: string) => {
        try {
            const boards = await dispatch(fetchBoardsByWorkspaceId({workspaceId})).unwrap();
            return {success: true, data: boards};
        } catch (error) {
            handleApiError(error, setError);
            return {success: false, error};
        }
    }, [dispatch, setError]);

    return {
        createBoard: createBoardAction,
        deleteBoard: deleteBoardAction,
        updateBoard: updateBoardAction,
        fetchBoard: fetchBoardAction,
        fetchAllBoards: fetchAllBoardsAction,
    };
};

export const useBoardState = () => {
    return useAppSelector((state) => state.boards);
};

export const useBoards = (workspaceId?: string): IBoard[] => {
    const {boardsByWorkspace} = useBoardState();
    if (!workspaceId) return [];
    return boardsByWorkspace[workspaceId] ?? [];
};

export const useBoardsLoading = () => {
    return useAppSelector((state) => state.boards.fetching);
};

export const useBoardsError = () => {
    return useAppSelector((state) => state.boards.fetchError);
};