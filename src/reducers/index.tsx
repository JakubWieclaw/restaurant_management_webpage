import { combineReducers } from "redux";

import userReducer from "./slices/userSlice";
import cartReducer from "./slices/cartSlice";

const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
  // Add other reducers here
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
