import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupFormData>();

  const onSubmit = async (data: SignupFormData) => {
    try {
      const { email, password } = data;
      const response = await axios.post(
        "https://oznnkyasreusdkcvhggc.supabase.co/auth/v1/signup",
        {
          email,
          password,
        },
        {
          headers: {
            apikey: import.meta.env.VITE_SUPABASE_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.error) {
        console.error("Error signing up:", response.data.error.message);
      } else {
        console.log("User signed up:", response.data.user);
        await axios.post(
          "https://oznnkyasreusdkcvhggc.supabase.co/rest/v1/user_roles",
          {
            user_id: response.data.user.id,
            role_id: "2",
          },
          {
            headers: {
              apikey: `${import.meta.env.VITE_SUPABASE_API_KEY}`,
              Authorization: `Bearer ${response.data.access_token}`,
              "Content-Type": "application/json",
              Prefer: "return=minimal",
            },
          }
        );

        setTimeout(() => {
          alert("Successfully signed up! Redirecting to login page...");
          navigate("/");
        }, 1000);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          console.error("Too many requests. Please try again later.");
        } else {
          console.error(
            "Signup failed:",
            error.response?.data || error.message
          );
        }
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const password = watch("password");

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-customPurpleLight">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
            className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-customPurpleDark ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              maxLength: {
                value: 16,
                message: "Password must be no more than 16 characters",
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/,
                message:
                  "Password must contain at least one uppercase letter, one lowercase letter, and one number",
              },
            })}
            className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-customPurpleDark ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
            className={`w-full p-2 border rounded ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full p-2 bg-customPurple hover:bg-customPurpleDark"
        >
          Sign Up
        </Button>
      </form>
    </div>
  );
};

export default SignUpPage;
