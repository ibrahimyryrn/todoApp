import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useEffect } from "react";
import { getCookies } from "../utils/cookies";

import { clearEditTodo } from "../redux/todoEditSlice";
import { updateTodo } from "../api/endpoints";

function EditTodo() {
  const todo = useSelector((state: RootState) => state.todosEdit.todosEdit);
  const { access_token } = getCookies();
  const dispatch = useDispatch();

  useEffect(() => {
    const EditTodoWithId = async () => {
      if (todo.title && todo.description) {
        try {
          if (todo && access_token) {
            await updateTodo(todo.id, todo.title, todo.description);
            dispatch(clearEditTodo());
          }
        } catch (error) {
          console.error("Todolar gönderililrken bir hata oluştu", error);
        }
      }
    };

    EditTodoWithId();
  }, [todo, access_token, dispatch]);

  return <></>;
}

export default EditTodo;
