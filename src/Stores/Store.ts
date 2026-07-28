import { configureStore } from "@reduxjs/toolkit";
import userReduce from "../Reducers/userReduce";
import searchReduce from "../Reducers/searchReduce";

export const Store = configureStore({
  reducer: {
    user: userReduce,
    search: searchReduce,
  },
});

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
