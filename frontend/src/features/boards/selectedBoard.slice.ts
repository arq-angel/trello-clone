import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {IBoard} from "@/models";

const selectedBoardSlice = createSlice({
    name: "selectedBoard",
    initialState: null as IBoard | null,
    reducers: {
        setSelectedBoard: (state, action: PayloadAction<IBoard | null>) => action.payload,
    },
});

export const {setSelectedBoard} = selectedBoardSlice.actions;
export default selectedBoardSlice.reducer;