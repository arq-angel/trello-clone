import {useAppDispatch, useAppSelector} from "@/hooks";
import toast from "react-hot-toast";
import {handleApiError} from "@/utils/handleApiError";
import type {IList} from "@/models";
import type {FieldValues, UseFormSetError} from "react-hook-form";
import {useCallback} from "react";
import {
    createList,
    deleteList,
    fetchListsByBoardId,
    fetchSingleListByListId,
    moveList,
    updateList,
} from "@/features/lists/list.thunks.ts";

export const useListActions = <TFieldValues extends FieldValues = FieldValues>(
    setError?: UseFormSetError<TFieldValues>
): {
    createList: typeof createListAction;
    deleteList: typeof deleteListAction;
    updateList: typeof updateListAction;
    moveList: typeof moveListAction;
    fetchList: typeof fetchListAction;
    fetchAllLists: typeof fetchAllListsAction;
} => {
    const dispatch = useAppDispatch();

    const createListAction = useCallback(async (name: string, boardId: string, position: number) => {
        try {
            const newList: IList = await dispatch(createList({name, boardId, position})).unwrap();
            toast.success("List created successfully.");
            return {success: true, data: newList};
        } catch (error) {
            handleApiError(error, setError);
            return {success: false, error};
        }
    }, [dispatch, setError]);

    const deleteListAction = useCallback(async (listId: string) => {
        try {
            await dispatch(deleteList({listId})).unwrap();
            toast.success("List deleted successfully.");
            return {success: true};
        } catch (error) {
            handleApiError(error, setError);
            return {success: false, error};
        }
    }, [dispatch, setError]);

    const updateListAction = useCallback(async (listId: string, name: string, position: number) => {
        try {
            const updatedList = await dispatch(updateList({listId, payload: {name, position}})).unwrap();
            toast.success("List updated successfully.");
            return {success: true, data: updatedList};
        } catch (error) {
            handleApiError(error, setError);
            return {success: false, error};
        }
    }, [dispatch, setError]);

    const moveListAction = useCallback(async (listId: string, position: number) => {
        try {
            const movedList = await dispatch(moveList({listId, payload: {position}})).unwrap();
            toast.success("List moved successfully.");
            return {success: true, data: movedList};
        } catch (error) {
            handleApiError(error, setError);
            return {success: false, error};
        }
    }, [dispatch, setError]);

    const fetchListAction = useCallback(async (listId: string) => {
        try {
            const list = await dispatch(fetchSingleListByListId({listId})).unwrap();
            return {success: true, data: list};
        } catch (error) {
            handleApiError(error, setError);
            return {success: false, error};
        }
    }, [dispatch, setError]);

    const fetchAllListsAction = useCallback(async (boardId: string) => {
        try {
            const lists = await dispatch(fetchListsByBoardId({boardId})).unwrap();
            return {success: true, data: lists};
        } catch (error) {
            handleApiError(error, setError);
            return {success: false, error};
        }
    }, [dispatch, setError]);

    return {
        createList: createListAction,
        deleteList: deleteListAction,
        updateList: updateListAction,
        moveList: moveListAction,
        fetchList: fetchListAction,
        fetchAllLists: fetchAllListsAction,
    };
};

export const useListState = () => {
    return useAppSelector((state) => state.lists);
};

export const useLists = (boardId?: string): IList[] => {
    const {listsByBoard} = useListState();
    if (!boardId) return [];
    return listsByBoard[boardId] ?? [];
};

export const useListsLoading = (): boolean =>
    useAppSelector((state) => state.lists.fetching);

export const useListsError = (): string | null =>
    useAppSelector((state) => state.lists.fetchError);
