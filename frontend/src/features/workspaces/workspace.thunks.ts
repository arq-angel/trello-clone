import {createAsyncThunk} from "@reduxjs/toolkit";
import {
    createWorkspaceAPI, deleteWorkspaceAPI,
    fetchAllWorkspacesAPI,
    fetchSingleWorkspaceByWorkspaceIdAPI, updateWorkspaceAPI
} from "@/api/workspace.service.ts";
import type {IWorkspace} from "@/models";
import {handleThunkError, type RejectedPayload} from "@/utils/handleThunkError.ts";
import {type ICreateWorkspaceParams} from "@/schemas";

export const fetchSingleWorkspaceByWorkspaceId = createAsyncThunk<
    IWorkspace, // Return type of fulfilled action
    { workspaceId: string }, // Argument type
    { rejectValue: RejectedPayload } // Type for rejectWithValue
>(
    "workspaces/fetchSingle",
    async ({workspaceId}, {rejectWithValue}) => {
        try {
            const workspace: IWorkspace = await fetchSingleWorkspaceByWorkspaceIdAPI({workspaceId});
            return workspace; // return so it goes to `.fulfilled`
        } catch (error) {
            return handleThunkError(error, rejectWithValue); // return the rejectWithValue
        }
    }
);

export const fetchWorkspaces = createAsyncThunk<
    IWorkspace[],
    void,
    { rejectValue: RejectedPayload }
>("workspaces/fetchAll",
    async (_, {rejectWithValue}) => {
        try {
            const workspaces: IWorkspace[] = await fetchAllWorkspacesAPI();
            return workspaces; // ✅ Return fetched data
        } catch (error) {
            return handleThunkError(error, rejectWithValue); // ✅ Return rejection
        }
    }
);

export const createWorkspace = createAsyncThunk<
    IWorkspace,
    ICreateWorkspaceParams,
    { rejectValue: RejectedPayload }
>(
    "workspaces/create",
    async (payload: ICreateWorkspaceParams, {rejectWithValue}) => {
        try {
            const workspace: IWorkspace = await createWorkspaceAPI({payload});
            return workspace;
        } catch (error) {
            return handleThunkError(error, rejectWithValue);
        }
    }
);

export const updateWorkspace = createAsyncThunk<
    IWorkspace,
    { workspaceId: string; payload: ICreateWorkspaceParams },
    { rejectValue: RejectedPayload }
>(
    "workspaces/update",
    async ({workspaceId, payload}, {rejectWithValue}) => {
        try {
            const workspace: IWorkspace = await updateWorkspaceAPI({workspaceId, payload});
            return workspace;
        } catch (error) {
            return handleThunkError(error, rejectWithValue);
        }
    }
);


export const deleteWorkspace = createAsyncThunk<
    string,                                   // return type (workspaceId)
    { workspaceId: string },                 // thunk argument
    { rejectValue: RejectedPayload }         // rejection type
>(
    "workspaces/delete",
    async ({workspaceId}, {rejectWithValue}) => {
        try {
            const deletedWorkspaceId = await deleteWorkspaceAPI({workspaceId});
            return deletedWorkspaceId;
        } catch (error) {
            return handleThunkError(error, rejectWithValue);
        }
    }
);