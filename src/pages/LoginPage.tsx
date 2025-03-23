import { useForm } from "react-hook-form";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setCookies } from "../utils/cookies";
import { getRoleName, getUserRole } from "../api/endpoints";
import { UserRoles } from "../enums/UserRoles";

// Axios instance oluşturuyoruz
const api = axios.create({
  baseURL: "https://oznnkyasreusdkcvhggc.supabase.co/auth/v1",
  headers: {
    apikey: `${import.meta.env.VITE_SUPABASE_API_KEY}`,
    "Content-Type": "application/json",
  },
});

// Axios interceptor ekleyerek token yenileme mantığını kuruyoruz
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Eğer hata 401 (Unauthorized) ise ve bu ilk deneme ise
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh token ile yeni access token al
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await api.post("/token?grant_type=refresh_token", {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token } = response.data;

        // Yeni tokenları kaydet
        setCookies(access_token, refresh_token, response.data.user.id);

        // Orijinal isteği yeni token ile tekrarla
        api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (error) {
        // Refresh token da geçersizse kullanıcıyı login sayfasına yönlendir
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: "ibo@ibo.com",
      password: "12345",
    },
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const { email, password } = data;
      const response = await api.post("/token?grant_type=password", {
        email,
        password,
      });

      if (response.data.error) {
        if (response.data.error.message.includes("Invalid login credentials")) {
          alert("Invalid credentials, please try again.");
        } else if (response.data.error.message.includes("No user found")) {
          alert("No account found with this email. Please sign up.");
        }
      } else {
        console.log(response.data);
        const { access_token, refresh_token, user } = response.data;

        // Token'ları ve kullanıcı bilgilerini kaydet
        setCookies(access_token, refresh_token, user.id);

        // Access token'ı axios instance'ına default olarak ekle
        api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

        localStorage.setItem("refreshToken", refresh_token);
        const res = await getUserRole(user.id);
        const role = await getRoleName(res[0].role_id);

        setTimeout(() => {
          alert("Successfully login! Redirecting to home page...");
          if (role[0].role_name === UserRoles.ADMIN) {
            navigate("/admin");
            return;
          }
          navigate("/home");
        }, 1000);
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-customPurpleLight">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-customPurpleDark"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password", { required: "Password is required" })}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-customPurpleDark"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full p-2 bg-customPurple hover:bg-customPurpleDark"
        >
          Login
        </Button>

        <div className="mt-4 text-center">
          <p className="text-sm font-medium">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-blue-500 hover:text-customPurpleDark"
            >
              Sign up
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
