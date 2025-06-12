import {useAppDispatch, useAppSelector} from "@/hooks";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import {
    createWorkspace,
    deleteWorkspace,
    fetchSingleWorkspaceByWorkspaceId,
    fetchWorkspaces,
    updateWorkspace
} from "@/features/workspaces/workspace.thunks";
import {setSelectedWorkspace} from "@/features/workspaces/selectedWorkspace.slice";
import {handleApiError} from "@/utils/handleApiError";
import type {IWorkspace} from "@/models";
import type {FieldValues, UseFormSetError} from "react-hook-form";
import {useCallback} from "react";

export const useWorkspaceActions = <TFieldValues extends FieldValues = FieldValues>(
    setError?: UseFormSetError<TFieldValues>
): {
    createWorkspace: typeof createWorkspaceAction;
    deleteWorkspace: typeof deleteWorkspaceAction;
    updateWorkspace: typeof updateWorkspaceAction;
    fetchWorkspace: typeof fetchWorkspaceAction;
    fetchAllWorkspaces: typeof fetchAllWorkspacesAction;
} => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const createWorkspaceAction = useCallback(async (name: string) => {
        try {
            const newWorkspace: IWorkspace = await dispatch(createWorkspace({name})).unwrap();
            dispatch(setSelectedWorkspace(newWorkspace));
            toast.success("Workspace created successfully.");
            navigate(`/workspaces/${newWorkspace.id}/boards`);
            return {success: true, data: newWorkspace};
        } catch (error) {
            handleApiError(error, setError);
            return {success: false, error};
        }
    }, [dispatch, navigate, setError]);

    const deleteWorkspaceAction = useCallback(async (workspaceId: string) => {
        try {
            await dispatch(deleteWorkspace({workspaceId})).unwrap();
            toast.success("Workspace deleted successfully.");
            return {success: true};
        } catch (error) {
            handleApiError(error, setError);
            return {success: false, error};
        }
    }, [dispatch, setError]);

    const updateWorkspaceAction = useCallback(async (workspaceId: string, name: string) => {
        try {
            const updatedWorkspace = await dispatch(updateWorkspace({workspaceId, payload: {name}})).unwrap();
            toast.success("Workspace updated successfully.");
            return {success: true, data: updatedWorkspace};
        } catch (error) {
            handleApiError(error, setError);
            return {success: false, error};
        }
    }, [dispatch, setError]);

    const fetchWorkspaceAction = useCallback(async (workspaceId: string) => {
        try {
            const workspace = await dispatch(fetchSingleWorkspaceByWorkspaceId({workspaceId})).unwrap();
            return {success: true, data: workspace};
        } catch (error) {
            handleApiError(error, setError);
            return {success: false, error};
        }
    }, [dispatch, setError]);

    const fetchAllWorkspacesAction = useCallback(async () => {
        try {
            const workspaces = await dispatch(fetchWorkspaces()).unwrap();
            return {success: true, data: workspaces};
        } catch (error) {
            handleApiError(error, setError);
            return {success: false, error};
        }
    }, [dispatch, setError]);

    return {
        createWorkspace: createWorkspaceAction,
        deleteWorkspace: deleteWorkspaceAction,
        updateWorkspace: updateWorkspaceAction,
        fetchWorkspace: fetchWorkspaceAction,
        fetchAllWorkspaces: fetchAllWorkspacesAction,
    };
};

export const useWorkspaceState = () => {
    return useAppSelector((state) => state.workspaces);
};

export const useWorkspace = (workspaceId?: string) => {
    const {workspaces} = useWorkspaceState();
    return workspaces.find((w) => w.id === workspaceId);
};

export const useWorkspaceLoading = () => {
    return useAppSelector((state) => state.workspaces.fetching);
};

export const useWorkspaceError = () => {
    return useAppSelector((state) => state.workspaces.fetchError);
};