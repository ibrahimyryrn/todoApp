import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getCookies } from "./cookies";

const PrivateRoute: React.FC = () => {
  const { access_token } = getCookies();

  return access_token ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
