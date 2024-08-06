import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { UserState } from "../types/userTypes";

const initialState: UserState = {
  loggedIn: false,
  token: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ token: string }>) {
      state.loggedIn = true;
      state.token = action.payload.token;
    },
    logout(state) {
      state.loggedIn = false;
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
