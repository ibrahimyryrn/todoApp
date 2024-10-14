// services/userApi.ts    ADMİN PANEL
import axios from "axios";

// Tipler
export interface User {
  user_id: string;
  email: string;
  role_id: 1 | 2;
  created_at: string;
}

// API istekleri için özel axios instance
const supabaseApi = axios.create({
  baseURL: import.meta.env.VITE_SUPABASE_URL,
  headers: {
    apikey: import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
    "Content-Type": "application/json",
  },
});

// Tüm kullanıcıları getir
export const fetchAllUsers = async (): Promise<User[]> => {
  try {
    const response = await supabaseApi.get("/rest/v1/user_roles?select=*");
    return response.data;
  } catch (error) {
    console.error("Kullanıcılar getirilirken hata:", error);
    throw error;
  }
};

// Kullanıcı rolünü güncelle
export const updateUserRole = async (
  userId: string,
  newRole: 1 | 2
): Promise<void> => {
  try {
    await supabaseApi.patch(
      `/rest/v1/user_roles?user_id=eq.${userId}`,
      {
        role_id: newRole,
      },
      {
        headers: {
          Prefer: "return=minimal",
        },
      }
    );
  } catch (error) {
    console.error("Rol güncellenirken hata:", error);
    throw error;
  }
};

// Kullanıcı sil
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    await supabaseApi.delete(`/rest/v1/users?id=eq.${userId}`);
  } catch (error) {
    console.error("Kullanıcı silinirken hata:", error);
    throw error;
  }
};
