import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Config } from "../../api";

const initialState: Record<"config", Config> = {
  config: {
    restaurantName: "SZR",
    postalCode: "60-965",
    city: "Poznań",
    street: "ul. Piotrowo 2",
    phoneNumber: "123-456-789",
    email: "a@a",
    logoUrl: "icons8-meal.svg",
  },
};

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setConfig(state, action: PayloadAction<Config>) {
      state.config = action.payload;
    },
  },
});

export const { setConfig } = configSlice.actions;

export default configSlice.reducer;
