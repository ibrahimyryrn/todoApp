import Button from "./Button";
import { getCookies, removeCookies } from "../utils/cookies";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Header() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { access_token } = getCookies();
    const refreshToken = localStorage.getItem("refreshToken"); // Refresh token'ı al

    try {
      // Önce access token ile logout
      await axios.post(
        "https://oznnkyasreusdkcvhggc.supabase.co/auth/v1/logout",
        {
          refresh_token: refreshToken, // Refresh token'ı da gönder
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            apikey: `${import.meta.env.VITE_SUPABASE_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Local temizlik işlemleri
      localStorage.removeItem("refreshToken"); // Refresh token'ı localStorage'dan sil
      removeCookies(); // Access token ve diğer cookie'leri sil

      // Axios default headers'ı temizle (eğer kullanıyorsanız)
      delete axios.defaults.headers.common["Authorization"];

      setTimeout(() => {
        alert("Successfully logout! Redirecting to login page...");
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Logout failed", error);

      // Hata durumunda da local temizlik işlemlerini yap
      localStorage.removeItem("refreshToken");
      removeCookies();

      alert(
        "Logout failed, but local session cleared. Redirecting to login page..."
      );
      navigate("/");
    }
  };

  return (
    <>
      <div className="flex justify-between w-screen h-16 bg-customPurpleDark">
        <div className="flex justify-center items-center ml-4 text-white text-3xl">
          <p>TODO APP</p>
        </div>
        <Button className="mr-4 p-2 bg-customPurpleDark" onClick={handleLogout}>
          LOGOUT
        </Button>
      </div>
    </>
  );
}

export default Header;
