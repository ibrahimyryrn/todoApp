import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { getCookies } from "../utils/cookies";
import axios from "axios";
import { TodoType } from "../Types/TodoType";

interface ModalProps {
  onClose: () => void;
}

function ModalSearch({ onClose }: ModalProps) {
  const [todos, setTodos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user_id, access_token } = getCookies();
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const fetchTodos = async () => {
      if (searchTerm) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/todos`,
            {
              params: {
                user_id: `eq.${user_id}`, // user_id'ye göre filtreleme
                title: `ilike.%${searchTerm}%`, // title'da searchTerm'e göre arama
              },
              headers: {
                Authorization: `Bearer ${access_token}`,
                apikey: `${import.meta.env.VITE_SUPABASE_API_KEY}`,
                "Content-Type": "application/json",
              },
            }
          );
          setTodos(response.data);
        } catch (error) {
          console.error("Error fetching todos:", error);
        }
      }
    };

    fetchTodos();
  }, [user_id, access_token, searchTerm]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="relative rounded-lg shadow-lg w-96 bg-customPurpleLight p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-customPurple">SEARCH</h3>
          <button
            className="text-customPurple hover:text-customPurpleDark"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-2 rounded-md border border-gray-300"
            placeholder="Search here"
          />
        </div>

        <div className="space-y-2">
          {todos.length > 0 ? (
            todos.map((todo: TodoType) => (
              <div
                key={todo.id}
                className="flex justify-between h-16 w-full bg-white rounded"
              >
                <div className="m-3">
                  <div className="text-customPurple">{todo.title}</div>
                  <div>{todo.description}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-customPurple">
              No results found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModalSearch;
