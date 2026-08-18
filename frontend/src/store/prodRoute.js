import { createSlice } from "@reduxjs/toolkit";
import config from "../config/config.js";

// Determine environment mode safely (defaults to "development")
const currentEnv = import.meta.env?.MODE || "development";

// Get API URL with multiple fallback safety checks
const getInitialApiUrl = () => {
  if (config && config[currentEnv]?.apiUrl) {
    return config[currentEnv].apiUrl;
  }
  return config?.development?.apiUrl || "http://localhost:5000";
};

const prodSlice = createSlice({
  name: "prod",
  initialState: {
    link: getInitialApiUrl(),
    environment: currentEnv,
  },
  reducers: {
    // Allows dynamic API URL switching (useful for testing or staging environments)
    setBackendUrl: (state, action) => {
      state.link = action.payload;
    },
  },
});

export const { setBackendUrl } = prodSlice.actions;
export default prodSlice.reducer;