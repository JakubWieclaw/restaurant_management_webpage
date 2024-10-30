import { combineReducers } from "@reduxjs/toolkit";

import cartReducer from "./slices/cartSlice";
import userReducer from "./slices/userSlice";
import configReducer from "./slices/configSlice";

const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
  config: configReducer,
});

export default rootReducer;
