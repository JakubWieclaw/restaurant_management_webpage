import { combineReducers } from "@reduxjs/toolkit";

import cartReducer from "./slices/cartSlice";
import userReducer from "./slices/userSlice";

const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
  // Add other reducers here
});

export default rootReducer;
