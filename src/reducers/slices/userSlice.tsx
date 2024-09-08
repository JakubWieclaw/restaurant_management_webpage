import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { UserState } from "../../types/userTypes";

const initialState: UserState = {
  loggedIn: false,
  token: "",
  isAdmin: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{ response: { token: string; isAdmin: boolean } }>
    ) {
      state.loggedIn = true;
      state.token = action.payload.response.token;
      state.isAdmin = action.payload.response.isAdmin;
    },
    logout(state) {
      state.loggedIn = false;
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
