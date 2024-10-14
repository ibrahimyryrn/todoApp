// src/services/api.ts
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { TodoType } from "../Types/TodoType";
import { getCookies, setCookies } from "../utils/cookies";

// Axios instance oluştur
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SUPABASE_URL,
  headers: {
    apikey: import.meta.env.VITE_SUPABASE_API_KEY,
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const { access_token } = getCookies();
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - token yenileme mantığı
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post(
          `${
            import.meta.env.VITE_SUPABASE_URL
          }/auth/v1/token?grant_type=refresh_token`,
          { refresh_token: refreshToken },
          {
            headers: {
              apikey: import.meta.env.VITE_SUPABASE_API_KEY,
              "Content-Type": "application/json",
            },
          }
        );

        const { access_token, refresh_token } = response.data;
        setCookies(access_token, refresh_token, response.data.user.id);
        localStorage.setItem("refreshToken", refresh_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// sadece false olanları çağır
export const getTodoWithId = async (
  user_id: string | null,
  start: number,
  end: number
): Promise<TodoType[]> => {
  if (!user_id) {
    throw new Error("User ID is missing!");
  }

  try {
    const response: AxiosResponse<TodoType[]> = await api.get(
      `/rest/v1/todos?user_id=eq.${user_id}&is_completed=eq.false&select=*`,
      {
        headers: {
          Range: `${start}-${end}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("An error occurred while fetching the ToDos:", error);
    throw new Error("Could not fetch the ToDos.");
  }
};

export const getTodo = async (user_id: string | null): Promise<TodoType[]> => {
  if (!user_id) {
    throw new Error("User ID is missing!");
  }

  try {
    const response: AxiosResponse<TodoType[]> = await api.get(
      `/rest/v1/todos?user_id=eq.${user_id}`
    );
    return response.data;
  } catch (error) {
    console.error("An error occurred while fetching the ToDos:", error);
    throw new Error("Could not fetch the ToDos.");
  }
};

export const postTodo = async (
  todo: TodoType
): Promise<AxiosResponse<TodoType>> => {
  try {
    const response: AxiosResponse<TodoType> = await api.post(
      `/rest/v1/todos`,
      todo
    );
    return response;
  } catch (error) {
    console.error("An error occurred while sending the ToDos", error);
    throw new Error("Could not send the ToDos");
  }
};

export const updateTodo = async (
  id: number | undefined,
  title: string,
  description: string
): Promise<TodoType> => {
  try {
    const response: AxiosResponse<TodoType> = await api.patch(
      `/rest/v1/todos?id=eq.${id}`,
      { title, description },
      {
        headers: {
          Prefer: "return=minimal",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("An error occurred while updating the ToDo:", error);
    throw new Error("Could not update the ToDo");
  }
};

export const updateIsCompleted = async (
  id: number | undefined,
  is_completed: boolean | undefined
): Promise<TodoType> => {
  try {
    const response: AxiosResponse<TodoType> = await api.patch(
      `/rest/v1/todos?id=eq.${id}`,
      { is_completed },
      {
        headers: {
          Prefer: "return=minimal",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("An error occurred while updating the ToDo status:", error);
    throw new Error("Could not update the ToDo status");
  }
};

export default api;

export const getUserRole = async (user_id: string) => {
  const response = await api.get(
    `/rest/v1/user_roles?user_id=eq.${user_id}&select=role_id`
  );
  return response.data;
};

export const getRoleName = async (role_id: number) => {
  const response = await api.get(`/rest/v1/roles?id=eq.${role_id}`);
  return response.data;
};
