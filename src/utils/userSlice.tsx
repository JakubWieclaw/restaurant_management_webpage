import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserState } from "../types/userTypes";

const initialState: UserState = {
  loggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // login(state, action: PayloadAction<UserInfo>) {
    login(state) {
      state.loggedIn = true;
    },
    logout(state) {
      state.loggedIn = false;
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
