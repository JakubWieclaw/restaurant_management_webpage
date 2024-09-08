import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { UserState } from "../../types/userTypes";
import { LoginResponse } from "../../api";

const initialState: UserState = {
  loginResponse: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ response: LoginResponse }>) {
      state.loginResponse = action.payload.response;
    },
    logout(state) {
      state.loginResponse = null;
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
