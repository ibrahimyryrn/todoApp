import { useCallback, useEffect, useState } from "react";
import { TodoType } from "../Types/TodoType";
import { getCookies } from "../utils/cookies";
import { getTodo, updateIsCompleted } from "../api/endpoints";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

interface ModalProps {
  onClose: () => void;
  flagChanged: () => void;
}

function ModalCompleted({ onClose, flagChanged }: ModalProps) {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const { access_token, user_id } = getCookies();
  const [flag, setFlag] = useState(false);

  const fetchTodos = useCallback(async () => {
    try {
      if (user_id && access_token) {
        const todoList = await getTodo(user_id);
        setTodos(todoList);
      }
    } catch (error) {
      console.error("Todos alınırken hata oluştu:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user_id, access_token, flag]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleCheckTodoReverse = async (
    is_completed: boolean | undefined,
    id: number | undefined
  ) => {
    await updateIsCompleted(id, !is_completed);
    flagChanged();
    setFlag((prev) => !prev);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="relative  rounded-lg shadow-lg w-96  bg-customPurpleLight">
        <h3 className="text-customPurple absolute top-2 left-2 ">
          COMPLETED TASK
        </h3>
        <button
          className="absolute top-2 right-2 text-customPurple hover:text-customPurpleDark"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <div className="m-12">
          {todos.map((todo: TodoType) =>
            todo.is_completed ? (
              <div
                key={todo.id}
                className="flex mb-2 justify-between h-16 w-full bg-white rounded"
              >
                <div className="m-3">
                  <div className="text-customPurple">{todo.title}</div>
                  <div>{todo.description}</div>
                </div>
                <div className="grid grid-cols-2">
                  <button
                    onClick={() =>
                      handleCheckTodoReverse(todo.is_completed, todo.id)
                    }
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                </div>
              </div>
            ) : (
              ""
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default ModalCompleted;
