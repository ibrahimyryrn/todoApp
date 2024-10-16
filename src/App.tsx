import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Homepage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import PrivateRoute from "./utils/PrivateRoute";
import AdminPage from "./pages/AdminPage";
import PrivateAdminRoute from "./utils/PrivateAdminRoute";

function App() {
  return (
    <div className="flex justify-center items-center flex-col m-0 p-0 w-full">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Homepage />} />
          <Route element={<PrivateAdminRoute />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
