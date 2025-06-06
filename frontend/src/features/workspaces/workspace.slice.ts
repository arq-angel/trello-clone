import {createSlice} from "@reduxjs/toolkit";
import type {IWorkspaceState} from "../../api/model.states.ts";
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
    error: null
};

const workspaceSlice = createSlice({
    name: "workspaces",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            // Fetch workspace by workspaceId
            .addCase(fetchSingleWorkspaceByWorkspaceId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSingleWorkspaceByWorkspaceId.fulfilled, (state, action) => {
                state.loading = false;
                const fetchedWorkspace = action.payload;
                const index = state.workspaces.findIndex(w => w.id === fetchedWorkspace.id);

                if (index !== -1) {
                    // Update existing workspace
                    state.workspaces[index] = fetchedWorkspace;
                } else {
                    // Add new workspace
                    state.workspaces.push(fetchedWorkspace);
                }
            })
            .addCase(fetchSingleWorkspaceByWorkspaceId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Failed to fetch workspace";
            })

            // Fetch workspaces
            .addCase(fetchWorkspaces.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWorkspaces.fulfilled, (state, action) => {
                state.loading = false;
                state.workspaces = action.payload;
                state.error = null;
            })
            .addCase(fetchWorkspaces.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Failed to fetch workspaces";
            })

            // Create workspace
            .addCase(createWorkspace.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createWorkspace.fulfilled, (state, action) => {
                state.loading = false;
                state.workspaces.push(action.payload)
            })
            .addCase(createWorkspace.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Failed to create workspace";
            })

            // Update workspace
            .addCase(updateWorkspace.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateWorkspace.fulfilled, (state, action) => {
                state.loading = false;
                const updatedWorkspace = action.payload;
                const index = state.workspaces.findIndex(w => w.id === updatedWorkspace.id);

                if (index !== -1) {
                    // Replace the existing workspace at index
                    state.workspaces[index] = updatedWorkspace;
                } else {
                    // Optionally, add it if not found
                    state.workspaces.push(updatedWorkspace);
                }
            })
            .addCase(updateWorkspace.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Failed to update workspace";
            })

            // Delete workspace
            .addCase(deleteWorkspace.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteWorkspace.fulfilled, (state, action) => {
                state.loading = false;
                state.workspaces = state.workspaces.filter(workspace => workspace.id !== action.payload)
            })
            .addCase(deleteWorkspace.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Failed to delete workspace";
            });
    },
})

export default workspaceSlice.reducer;