import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TodoType } from "../Types/TodoType";

export interface TodoInitialState {
  todosEdit: TodoType;
}

export const initialState = {
  todosEdit: {} as TodoType,
};

export const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    setEditTodo: (state: TodoInitialState, action: PayloadAction<TodoType>) => {
      state.todosEdit = action.payload;
    },
    clearEditTodo: (state: TodoInitialState) => {
      state.todosEdit = {} as TodoType;
    },
  },
});

export const { setEditTodo, clearEditTodo } = todoSlice.actions;
export default todoSlice.reducer;
