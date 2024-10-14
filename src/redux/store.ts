import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "../redux/todoSlice";
import todosEditReducer from "../redux/todoEditSlice";

export const store = configureStore({
  reducer: { todos: todoReducer, todosEdit: todosEditReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
