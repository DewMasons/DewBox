import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import AuthCarousel from "../components/AuthCarousel";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import clsx from "clsx";
import "react-toastify/dist/ReactToastify.css";
import { login, checkAuth } from '../services/api';
import { useAuthStore } from '../store/authstore';

// Use phone as login identifier
const schema = yup.object().shape({
  mobile: yup
    .string()
    .required("Phone number is required")
    .matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login: updateAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const result = await login(data.mobile, data.password);
      // Ensure the token is the user id and not undefined
      if (!result.token) {
        toast.error("Login failed: No token returned from server.");
        return;
      }
      localStorage.setItem('token', result.token);
      // Debug: log token to console
      console.log('Token set in localStorage:', result.token);
      updateAuth(result.user);
      toast.success("Login successful!");
      navigate("/dashboard"); // Always go to dashboard after sign in
    } catch (error) {
      console.error("Authentication error:", error);
      const errorMessage = error.response?.data?.message || "An error occurred during login. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className='min-h-screen grid md:grid-cols-2 grid-cols-1'>
      <div className="hidden md:block h-screen">
        <AuthCarousel />
      </div>
      <div className='flex items-center justify-center p-4 md:p-8 bg-gray-50 min-h-screen overflow-y-auto'>
        <motion.div
          className="bg-white p-4 md:p-8 rounded-lg shadow-lg w-full max-w-md relative"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl text-black font-bold text-center mb-2">Sign In</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-group">
              <label htmlFor="mobile" className="font-bold">
                Phone Number
              </label>
              <input
                type="text"
                id="mobile"
                {...register("mobile")}
                className={clsx(
                  "input input-bordered w-full",
                  errors.mobile && "border-red-500"
                )}
                placeholder="Enter your phone number"
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>
              )}
            </div>
            <div className="form-group relative">
              <label htmlFor="password" className="font-bold">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                {...register("password")}
                className={clsx(
                  "input input-bordered w-full",
                  errors.password && "border-red-500"
                )}
                placeholder="Enter your password"
              />
              <span
                className="absolute right-3 top-10 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Sign In
            </button>
          </form>
          <p className="text-center text-black mt-4">
            Don't have an account?{" "}
            <span
              className="text-blue-900 underline cursor-pointer"
              onClick={() => navigate("/subscribeto")}
            >
              Subscribe Now 
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignIn;