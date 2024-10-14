// components/AdminPanel.tsx
import React, { useEffect, useState } from "react";
import {
  User,
  fetchAllUsers,
  updateUserRole,
  deleteUser,
} from "../api/userApi";

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Kullanıcıları getir
  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchAllUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      console.log(err);
      setError("Kullanıcılar yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Rol değiştirme işlemi
  const handleRoleChange = async (userId: string, currentRole: 1 | 2) => {
    try {
      const newRole = currentRole === 1 ? 2 : 1;
      await updateUserRole(userId, newRole);
      await loadUsers(); // Listeyi yenile
    } catch (err) {
      console.log(err);
      setError("Rol güncellenemedi");
    }
  };

  // Kullanıcı silme işlemi
  const handleDelete = async (userId: string) => {
    if (!window.confirm("Kullanıcıyı silmek istediğinizden emin misiniz?"))
      return;

    try {
      await deleteUser(userId);
      await loadUsers(); // Listeyi yenile
    } catch (err) {
      console.log(err);
      setError("Kullanıcı silinemedi");
    }
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Kullanıcı Yönetimi</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">UserID</th>
            <th className="border p-2">Rol</th>
            <th className="border p-2">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id}>
              <td className="border p-2">{user.user_id}</td>
              <td className="border p-2">{user.role_id}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleRoleChange(user.user_id, user.role_id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                >
                  {user.role_id === 1 ? "User Yap" : "Admin Yap"}
                </button>
                <button
                  onClick={() => handleDelete(user.user_id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Sil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
