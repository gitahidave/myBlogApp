import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  user: null,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Call on successful login or session verification
    login: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload || null;
      state.loading = false;
    },

    // Call on user sign-out
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.loading = false;
    },

    // Update state user payload (e.g., after editing account details)
    setUser: (state, action) => {
      state.user = action.payload;
    },

    // Set initial or async loading states
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;