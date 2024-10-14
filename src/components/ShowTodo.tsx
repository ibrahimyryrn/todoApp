import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "./Button";
import {
  faArrowLeftLong,
  faArrowRightLong,
  faCheck,
  faPencil,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { getTodoWithId, updateIsCompleted } from "../api/endpoints";
import CreateTodo from "../components/CreateTodo";
import { getCookies } from "../utils/cookies";
import { TodoType } from "../Types/TodoType";
import { useCallback, useEffect, useState } from "react";
import Modal from "./Modal";
import { useDispatch, useSelector } from "react-redux";
import { setTodo } from "../redux/todoSlice";
import { RootState } from "../redux/store";
import axios from "axios";
import ModalEdit from "./ModalEdit";
import { setEditTodo } from "../redux/todoEditSlice";
import EditTodo from "./EditTodo";
import ModalCompleted from "./ModalCompleted";
import ModalSearch from "./ModalSearch";

interface ShowTodoProps {
  isCompletedModalOpen: boolean;
  handleIsCompletedModalClose: () => void;
  isSearchModalOpen: boolean;
  handleIsSearchModalClose: () => void;
}

function ShowTodo({
  isCompletedModalOpen,
  isSearchModalOpen,
  handleIsCompletedModalClose,
  handleIsSearchModalClose,
}: ShowTodoProps) {
  const dispatch = useDispatch();

  const todo = useSelector((state: RootState) => state.todos.todos);
  const todoEdit = useSelector((state: RootState) => state.todosEdit.todosEdit);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [flag, setFlag] = useState(false);

  const { access_token, user_id } = getCookies();

  const [todos, setTodos] = useState<TodoType[]>([]); //fetcTodos ile çekip burada tutup ekrana bastırıyorum

  const [holdId, setHoldId] = useState<number | undefined>(undefined); //edit için id burada tutuyorum
  const [editTitle, setEditTitle] = useState(""); //modalda input içinde gözükmesi için
  const [editDescription, setEditDescription] = useState(""); //modalda input içinde gözükmesi için

  //PAGİNATİON PARTH

  const [currentPage, setCurrentPage] = useState(1);
  const todosPerPage = 5; //gösterilecek kayıt sayısı
  const [totalTodos, setTotalTodos] = useState(0);

  //TODOLARI ÇEKME İŞLEMİ
  const fetchTodos = useCallback(async () => {
    const start = (currentPage - 1) * todosPerPage;
    const end = start + todosPerPage - 1;

    try {
      if (user_id && access_token) {
        const todoList = await getTodoWithId(user_id, start, end);
        setTodos(todoList);
      }
    } catch (error) {
      console.error("Todos alınırken hata oluştu:", error);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user_id, access_token, todo, todoEdit, flag, currentPage]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  //TOPLAM TODO SAYISINI ÇEKİP İNDEX BELİRLEME
  useEffect(() => {
    const fetchTotalTodos = async () => {
      const { user_id } = getCookies();
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SUPABASE_URL
          }/rest/v1/todos?user_id=eq.${user_id}&is_completed=eq.false&select=*`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_API_KEY}`,
              apikey: `${import.meta.env.VITE_SUPABASE_API_KEY}`,
              Prefer: "count=exact",
            },
          }
        );
        // content-range formatı "0-9/100" şeklinde, "/" sonrası toplam sayıyı alıyoruz
        const contentRange = response.headers["content-range"];
        const total = contentRange ? contentRange.split("/")[1] : 0;
        setTotalTodos(total);

        return total;
      } catch (error) {
        console.error("Error fetching total todos:", error);
      }
    };
    fetchTotalTodos();
  }, [todos]);
  const totalPages = Math.ceil(totalTodos / todosPerPage);

  // Sayfa numarasını değiştiren fonksiyon
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  //Yeni todo ekleme modal'ı
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = (title: string, description: string) => {
    if (!user_id) {
      console.error("User ID is missing");
      return;
    }
    const payload = {
      user_id,
      title,
      description,
    };
    dispatch(setTodo(payload));
  };
  //Silme işlemi
  const handleDeleteTodo = async (todoId: number | undefined) => {
    await axios.delete(
      `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/todos?id=eq.${todoId}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          apikey: `${import.meta.env.VITE_SUPABASE_API_KEY}`,
        },
      }
    );
    fetchTodos();
  };

  //Edit için yeni bir modal
  const handleModalEditClose = () => {
    setIsModalEditOpen(false);
  };
  const handleModalEditSubmit = (
    title: string,
    description: string,
    id: number | undefined
  ) => {
    if (!user_id) {
      console.error("User ID is missing");
      return;
    }

    const payload = {
      id,
      user_id,
      title,
      description,
    };
    dispatch(setEditTodo(payload));
    setHoldId(undefined); //redux'a gönderdikten sonra tekrar undefined'a çekiyorum
  };

  //Edit için modal'ı açıyorum ve id tutma işlemi
  const handleEditTodo = (
    id: number | undefined,
    title: string,
    description: string
  ) => {
    setIsModalEditOpen(true);
    setHoldId(id);
    setEditTitle(title);
    setEditDescription(description);
  };

  const handleCheckedTodo = async (
    is_completed: boolean | undefined,
    id: number | undefined
  ) => {
    await updateIsCompleted(id, !is_completed);
    setFlag((prev) => !prev); //reRender olması için
  };

  const flagChanged = () => {
    setFlag((prev) => !prev);
  }; //ModalCompleted'dan geliyor reRender olması için

  return (
    <>
      {isModalOpen ? "" : <CreateTodo />}
      {isModalEditOpen ? "" : <EditTodo />}

      {/*ORTA KISIM*/}

      <div className="relative flex-grow bg-customPurpleLight">
        {isSearchModalOpen ? (
          <ModalSearch onClose={handleIsSearchModalClose} />
        ) : (
          ""
        )}

        {isCompletedModalOpen ? (
          <ModalCompleted
            onClose={handleIsCompletedModalClose}
            flagChanged={flagChanged}
          />
        ) : (
          ""
        )}
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
        />
        <ModalEdit
          isOpen={isModalEditOpen}
          onClose={handleModalEditClose}
          onSubmit={handleModalEditSubmit}
          id={holdId}
          editTitle={editTitle}
          editDescription={editDescription}
        />
        <div className="m-32">
          {todos.map((todo: TodoType) =>
            todo.is_completed ? (
              ""
            ) : (
              <div
                key={todo.id}
                className="flex mb-2 justify-between h-16 w-full bg-white rounded"
              >
                <div className="m-3">
                  <div className="text-customPurple">{todo.title}</div>
                  <div>{todo.description}</div>
                </div>
                <div className="m-3 grid gap-x-2 grid-cols-3">
                  <button
                    onClick={() =>
                      handleEditTodo(todo.id, todo.title, todo.description)
                    }
                  >
                    <FontAwesomeIcon icon={faPencil} />
                  </button>
                  <button onClick={() => handleDeleteTodo(todo.id)}>
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                  <button
                    onClick={() =>
                      handleCheckedTodo(todo.is_completed, todo.id)
                    }
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
        <div className="absolute bottom-4 flex justify-center items-center w-full gap-x-4">
          {/* Önceki sayfa */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FontAwesomeIcon
              icon={faArrowLeftLong}
              className="text-black
              "
            />
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={
                currentPage === index + 1
                  ? "text-customPurpleDark font-bold"
                  : "text-customPurple"
              }
            >
              {index + 1}
            </button>
          ))}

          {/* Sonraki sayfa */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={todos.length < todosPerPage}
          >
            <FontAwesomeIcon
              icon={faArrowRightLong}
              className="text-black
              "
            />
          </button>
        </div>
        <div className="absolute bottom-4 right-4 flex justify-center items-center bg-customPurpleDark h-16 w-16 rounded-full">
          <div className="relative">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="absolute -bottom-5 -left-4 -right-4 text-white text-5xl"
            >
              +
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ShowTodo;
