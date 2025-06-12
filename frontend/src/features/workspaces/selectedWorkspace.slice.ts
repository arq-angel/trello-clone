import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {IWorkspace} from "@/models";

const selectedWorkspaceSlice = createSlice({
    name: "selectedWorkspace",
    initialState: null as IWorkspace | null,
    reducers: {
        setSelectedWorkspace: (state, action: PayloadAction<IWorkspace | null>) => action.payload,
    },
});

export const {setSelectedWorkspace} = selectedWorkspaceSlice.actions;
export default selectedWorkspaceSlice.reducer;