import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TodoType } from "../Types/TodoType";

export interface TodoInitialState {
  todos: TodoType;
}

export const initialState = {
  todos: {} as TodoType,
};

export const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    setTodo: (state: TodoInitialState, action: PayloadAction<TodoType>) => {
      state.todos = action.payload;
    },
    clearTodo: (state: TodoInitialState) => {
      state.todos = {} as TodoType;
    },
  },
});

export const { setTodo, clearTodo } = todoSlice.actions;
export default todoSlice.reducer;
