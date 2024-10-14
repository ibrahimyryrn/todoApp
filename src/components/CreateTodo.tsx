import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useEffect } from "react";
import { getCookies } from "../utils/cookies";
import { postTodo } from "../api/endpoints";
import { clearTodo } from "../redux/todoSlice";

function CreateTodo() {
  const todo = useSelector((state: RootState) => state.todos.todos);
  const { access_token } = getCookies();
  const dispatch = useDispatch();

  useEffect(() => {
    const pushTodo = async () => {
      if (todo.title && todo.description) {
        try {
          if (todo && access_token) {
            await postTodo(todo, access_token);
            dispatch(clearTodo());
          }
        } catch (error) {
          console.error("Todolar gönderililrken bir hata oluştu", error);
        }
      }
    };

    pushTodo();
  }, [todo, access_token, dispatch]);

  return <></>;
}

export default CreateTodo;
