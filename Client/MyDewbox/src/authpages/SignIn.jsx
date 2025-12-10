import React, { useState } from "react";
import { useForm } from "react-hook-form";
import AuthCarousel from "../components/AuthCarousel";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Phone, Lock } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { login } from '../services/api';
import { useAuthStore } from '../store/authstore';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Img from '../assets/DMLogo.png';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

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
  rememberMe: yup.boolean(),
});

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login: updateAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await login(data.mobile, data.password);
      // Ensure the token is the user id and not undefined
      if (!result.token) {
        toast.error("Login failed: No token returned from server.");
        return;
      }
      localStorage.setItem('token', result.token);

      // Handle remember me
      if (data.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      updateAuth(result.user);
      toast.success("Login successful!");
      navigate("/dashboard"); // Always go to dashboard after sign in
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred during login. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen grid md:grid-cols-2 grid-cols-1'>
      {/* Left side - Carousel (hidden on mobile) */}
      <div className="hidden md:block h-screen">
        <AuthCarousel />
      </div>

      {/* Right side - Sign In Form */}
      <div className='flex items-center justify-center p-4 md:p-8 bg-[var(--color-background)] min-h-screen'>
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Logo (visible on mobile) */}
          <div className="md:hidden flex flex-col items-center mb-8">
            <img src={Img} alt="MyDewbox Logo" className="h-16 w-16 mb-3" />
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">MyDewbox</h1>
          </div>

          {/* Clean Card Container */}
          <Card variant="elevated" padding="lg" className="bg-[var(--color-surface-elevated)]">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Welcome back</h2>
              <p className="text-[var(--color-text-secondary)]">Sign in to your account to continue</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Phone Number Input */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-[var(--color-text-primary)]">
                  Phone Number
                </label>
                <div className="relative">
                  <PhoneInput
                    country={'ng'}
                    value={getValues('mobile')}
                    onChange={(phone) => setValue('mobile', phone, { shouldValidate: true })}
                    inputClass="!w-full !h-12 !text-base !pl-12 !bg-[var(--color-background)] !border-[var(--color-border)] !text-[var(--color-text-primary)] !rounded-lg focus:!border-primary-500 focus:!ring-1 focus:!ring-primary-500 transition-colors"
                    buttonClass="!bg-[var(--color-surface)] !border-[var(--color-border)] !rounded-l-lg hover:!bg-[var(--color-surface-hover)]"
                    dropdownClass="!bg-[var(--color-surface-elevated)] !text-[var(--color-text-primary)]"
                    containerClass="!w-full"
                  />
                  {errors.mobile && (
                    <p className="text-sm text-red-500 mt-1">{errors.mobile.message}</p>
                  )}
                </div>
              </div>

              {/* Password Input */}
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                icon={<Lock size={20} />}
                error={errors.password?.message}
                required
                {...register("password")}
              />

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("rememberMe")}
                    className="w-4 h-4 rounded border-[var(--color-border)] text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-[var(--color-text-primary)]">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => toast.info("Password reset feature coming soon")}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
              >
                Sign In
              </Button>
            </form>

            {/* Create Account Link */}
            <div className="mt-6 text-center">
              <p className="text-[var(--color-text-secondary)]">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/subscribeto")}
                  className="text-primary-600 hover:text-primary-700 font-semibold"
                >
                  Create account
                </button>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SignIn;