import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to verify cookie on initial page load
export const checkAuth = createAsyncThunk(
    "auth/checkAuth",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("http://localhost:5000/api/users/check-auth", {
                withCredentials: true // CRITICAL for cookies
            });
            return response.data.message; // returns boolean true/false
        } catch (error) {
            return rejectWithValue(false);
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        isLoggedIn: false,
        loading: true // Begins as true on application start
    },
    reducers: {
        setAuthSuccess: (state, action) => {
            state.isLoggedIn = true;
            state.user = action.payload;
            state.loading = false;
        },
        logoutSuccess: (state) => {
            state.isLoggedIn = false;
            state.user = null;
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkAuth.pending, (state) => {
                state.loading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload; // true or false
                state.loading = false; // FLIPS LOADING OFF
            })
            .addCase(checkAuth.rejected, (state) => {
                state.isLoggedIn = false;
                state.loading = false; // FLIPS LOADING OFF EVEN ON ERROR
            });
    }
});

export const { setAuthSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;