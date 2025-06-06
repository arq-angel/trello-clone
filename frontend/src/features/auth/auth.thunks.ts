import {createAsyncThunk} from "@reduxjs/toolkit";
import type {IRegisterUserParams, ILoginUserParams} from "../../schemas/auth.schema";
import {loginUserAPI, registerUserAPI} from "../../api/auth.service";
import {setCredentials} from "./auth.slice";
import type {IUser} from "../../models";
import {handleThunkError, type RejectedPayload} from "../../utils/handleThunkError.ts";

export const registerUser = createAsyncThunk<
    { token: string; user: IUser },
    IRegisterUserParams,
    { rejectValue: RejectedPayload }
>(
    "auth/register",
    async (payload: IRegisterUserParams, {dispatch, rejectWithValue}) => {
        try {
            // registerUserAPI returns { user, token }
            const response = await registerUserAPI({payload});

            // destructure user and token directly (no .data)
            const {token, user} = response;

            dispatch(setCredentials({token, user}));

            return {token, user}; // Let the slice handle state update
        } catch (error) {
            return handleThunkError(error, rejectWithValue);
        }
    }
);


// Assumes the API response format: { success: true, data: { token, user } }
export const loginUser = createAsyncThunk<
    { token: string; user: IUser },         // return type on success
    ILoginUserParams,                    // argument type
    { rejectValue: { message: string } }   // reject type
>(
    "auth/login",
    async (payload: ILoginUserParams, {dispatch, rejectWithValue}) => {
        try {
            // registerUserAPI returns { user, token }
            const response = await loginUserAPI({payload});

            // destructure user and token directly (no .data)
            const {token, user} = response;

            dispatch(setCredentials({token, user}));

            return {token, user};
        } catch (error) {
            return handleThunkError(error, rejectWithValue);
        }
    }
);