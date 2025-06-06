import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
import type {IUser} from "../../models";
import {loginUser, registerUser} from "./auth.thunks.ts";

interface AuthState {
    token: string | null;
    user: IUser | null;
    loading: boolean;
    error: string | null;
}

const tokenFromStorage = localStorage.getItem("token");
let userFromStorage: IUser | null = null;
try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
        userFromStorage = JSON.parse(storedUser);
    }
} catch {
    userFromStorage = null; // fallback in case of bad JSON
}


const initialState: AuthState = {
    token: tokenFromStorage ?? null,
    user: userFromStorage ?? null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ token: string; user: IUser }>) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("user", JSON.stringify(action.payload.user));
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },
    },
    extraReducers: (builder) => {
        builder
            // Register user
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                const {token, user} = action.payload;

                // this is same as dispatching the setCredentials
                state.token = token;
                state.user = user;

                state.loading = false;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message ?? "Registration failed";
            })

            // Login user
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                const {token, user} = action.payload;

                // this is same as dispatching the setCredentials
                state.token = token;
                state.user = user;

                state.loading = false;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message ?? "Registration failed";
            });
    }

});

export const {setCredentials, logout} = authSlice.actions;
export default authSlice.reducer;