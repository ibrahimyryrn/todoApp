import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getRoleName, getUserRole } from "../api/endpoints";
import { UserRoles } from "../enums/UserRoles";
import { getCookies } from "./cookies";

const PrivateAdminRoute: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // null for loading state
  const { user_id } = getCookies();

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        const res = await getUserRole(user_id);
        const role = await getRoleName(res[0].role_id);
        setIsAdmin(role[0].role_name === UserRoles.ADMIN);
      } catch (error) {
        console.error("Failed to fetch role", error);
        setIsAdmin(false); // or handle error differently
      }
    };

    checkAdminRole();
  }, [user_id]);

  // While waiting for the async operation, show a loading indicator (optional)
  if (isAdmin === null) {
    return <div>Loading...</div>;
  }

  // Render the route based on the role
  return isAdmin ? <Outlet /> : <Navigate to="/home" replace />;
};

export default PrivateAdminRoute;
