import {createSlice} from "@reduxjs/toolkit";
import type {IWorkspaceState} from "@/api/model.states.ts";
import {
    createWorkspace,
    deleteWorkspace,
    fetchSingleWorkspaceByWorkspaceId,
    fetchWorkspaces,
    updateWorkspace
} from "./workspace.thunks.ts";

const initialState: IWorkspaceState = {
    workspaces: [],
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

const workspaceSlice = createSlice({
    name: "workspaces",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            // Fetch workspace by workspaceId
            .addCase(fetchSingleWorkspaceByWorkspaceId.pending, (state) => {
                state.fetching = true;
                state.fetchError = null;
                state.validationErrors = [];
            })
            .addCase(fetchSingleWorkspaceByWorkspaceId.fulfilled, (state, action) => {
                state.fetching = false;
                state.fetchError = null;
                state.validationErrors = [];

                const fetchedWorkspace = action.payload;
                const index = state.workspaces.findIndex(w => w.id === fetchedWorkspace.id);
                if (index !== -1) {
                    state.workspaces[index] = fetchedWorkspace;
                } else {
                    state.workspaces.push(fetchedWorkspace);
                }
            })
            .addCase(fetchSingleWorkspaceByWorkspaceId.rejected, (state, action) => {
                state.fetching = false;

                if (action.payload) {
                    state.fetchError = action.payload.message;
                    state.validationErrors = action.payload.errors ?? [];
                } else {
                    state.fetchError = action.error.message ?? "Failed to fetch workspace";
                    state.validationErrors = [];
                }
            })

            // Fetch workspaces
            .addCase(fetchWorkspaces.pending, (state) => {
                state.fetching = true;
                state.fetchError = null;
                state.validationErrors = [];
            })
            .addCase(fetchWorkspaces.fulfilled, (state, action) => {
                state.fetching = false;
                state.fetchError = null;
                state.validationErrors = [];

                state.workspaces = action.payload;
            })
            .addCase(fetchWorkspaces.rejected, (state, action) => {
                state.fetching = false;

                if (action.payload) {
                    state.fetchError = action.payload.message;
                    state.validationErrors = action.payload.errors ?? [];
                } else {
                    state.fetchError = action.error.message ?? "Failed to fetch workspaces";
                    state.validationErrors = [];
                }
            })

            // Create workspace
            .addCase(createWorkspace.pending, (state) => {
                state.submitting = true;
                state.createError = null;
                state.validationErrors = [];
            })
            .addCase(createWorkspace.fulfilled, (state, action) => {
                state.submitting = false;
                state.createError = null;
                state.validationErrors = [];

                state.workspaces.push(action.payload);
            })
            .addCase(createWorkspace.rejected, (state, action) => {
                state.submitting = false;

                if (action.payload) {
                    state.createError = action.payload.message;
                    state.validationErrors = action.payload.errors ?? [];
                } else {
                    state.createError = action.error.message ?? "Failed to create workspace";
                    state.validationErrors = [];
                }
            })


            // Update workspace
            .addCase(updateWorkspace.pending, (state) => {
                state.submitting = true;
                state.updateError = null;
                state.validationErrors = [];
            })
            .addCase(updateWorkspace.fulfilled, (state, action) => {
                state.submitting = false;
                state.updateError = null;
                state.validationErrors = [];

                const updatedWorkspace = action.payload;
                const index = state.workspaces.findIndex(w => w.id === updatedWorkspace.id);
                if (index !== -1) {
                    state.workspaces[index] = updatedWorkspace;
                } else {
                    state.workspaces.push(updatedWorkspace);
                }
            })
            .addCase(updateWorkspace.rejected, (state, action) => {
                state.submitting = false;

                if (action.payload) {
                    state.updateError = action.payload.message;
                    state.validationErrors = action.payload.errors ?? [];
                } else {
                    state.updateError = action.error.message ?? "Failed to update workspace";
                    state.validationErrors = [];
                }
            })

            // Delete workspace
            .addCase(deleteWorkspace.pending, (state) => {
                state.deleting = true;
                state.deleteError = null;
                state.validationErrors = [];
            })
            .addCase(deleteWorkspace.fulfilled, (state, action) => {
                state.deleting = false;
                state.deleteError = null;
                state.validationErrors = [];

                state.workspaces = state.workspaces.filter(workspace => workspace.id !== action.payload);
            })
            .addCase(deleteWorkspace.rejected, (state, action) => {
                state.deleting = false;

                if (action.payload) {
                    state.deleteError = action.payload.message;
                    state.validationErrors = action.payload.errors ?? [];
                } else {
                    state.deleteError = action.error.message ?? "Failed to delete workspace";
                    state.validationErrors = [];
                }
            });
    },
})

export default workspaceSlice.reducer;