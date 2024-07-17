import { combineReducers } from "redux";

import userReducer from "../utils/userSlice";

const rootReducer = combineReducers({
  user: userReducer,
  // Add other reducers here
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
