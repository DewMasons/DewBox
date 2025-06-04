import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authstore";
import clsx from "clsx";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import apiService from "../services/api";

const schema = yup.object().shape({
    amount: yup
        .number()
        .positive("Amount must be positive")
        .required("Amount is required"),
    currency: yup.string().required("Currency is required"),
});

const FirstContribute = () => {
    const navigate = useNavigate();
    const { user, setHasContributed } = useAuthStore();

    // Only fetch subscriber if user is logged in
    const { data: subscriberData, isLoading, error } = useQuery({
        queryKey: ["subscriber"],
        queryFn: () => user ? apiService.getSubscriber() : Promise.resolve({ data: { subscriber: {} } }),
        enabled: !!user,
        retry: 1,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    const subscriber = subscriberData?.data?.subscriber;
    const subscriberCurrency = subscriber?.currency || "NGN";
    const userEmail = user?.email || "";

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            email: userEmail,
            currency: subscriberCurrency,
        },
    });

    // Update form values when data loads
    useEffect(() => {
        if (userEmail) {
            setValue("email", userEmail);
        }
        if (subscriberCurrency) {
            setValue("currency", subscriberCurrency);
        }
    }, [userEmail, subscriberCurrency, setValue]);

    const handleContribute = async (data) => {
        if (!user) {
            toast.error("Please sign in to contribute");
            navigate("/signin");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Authentication required");
                navigate("/signin");
                return;
            }

            const response = await axios.post(
                "/users/transactions/contribute",
                { 
                    amount: parseFloat(data.amount), 
                    currency: subscriberCurrency 
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                setHasContributed(true);
                toast.success('Contribution successful!');
                navigate("/dashboard");
            } else {
                toast.error(response.data.message || 'Contribution failed');
            }
        } catch (error) {
            console.error("Contribution error:", error);
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.error || 
                               'Failed to process contribution';
            toast.error(errorMessage);
        }
    };

    // Show sign-in prompt if user is not logged in
    if (!user) {
        return (
            <motion.div 
                className="flex items-center justify-center min-h-screen bg-gray-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full border border-gray-200 text-center">
                    <h2 className="text-2xl font-bold mb-4 text-blue-900">Sign in to Contribute</h2>
                    <p className="mb-4 text-gray-600">You must be signed in to make your first contribution.</p>
                    <button 
                        className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 px-4 rounded-lg font-semibold transition-colors" 
                        onClick={() => navigate('/signin')}
                    >
                        Go to Sign In
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="flex items-center justify-center min-h-screen bg-gray-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="bg-white rounded-xl p-6 shadow-lg max-w-md w-full border border-gray-200">
                {/* Loading and Error Messages */}
                {isLoading && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-700 text-sm text-center">Loading your currency settings...</p>
                    </div>
                )}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm text-center">Unable to load currency settings. Defaulting to NGN.</p>
                    </div>
                )}

                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Make Your First Contribution</h2>
                
                <form onSubmit={handleSubmit(handleContribute)} className="space-y-6">
                    {/* Esusu Circle Info */}
                    <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                        <h3 className="text-lg font-semibold text-purple-800 mb-2">Esusu Savings Circle</h3>
                        <p className="text-purple-600 mb-4">Join the monthly savings rotation</p>
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-purple-800">$500/month</span>
                            <span className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">Active</span>
                        </div>
                    </div>

                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            {...register("email")}
                            value={userEmail}
                            readOnly
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-blue-900 font-semibold cursor-not-allowed"
                        />
                    </div>

                    {/* Amount Field */}
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                            Contribution Amount
                        </label>
                        <input
                            type="number"
                            id="amount"
                            step="0.01"
                            min="0"
                            placeholder="Enter amount"
                            {...register("amount")}
                            className={clsx(
                                "w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors",
                                errors.amount 
                                    ? "border-red-300 bg-red-50" 
                                    : "border-gray-300 hover:border-gray-400"
                            )}
                        />
                        {errors.amount && (
                            <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
                        )}
                    </div>

                    {/* Currency Field */}
                    <div>
                        <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                            Currency
                        </label>
                        <input
                            type="text"
                            id="currency"
                            value={subscriberCurrency}
                            readOnly
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-blue-900 font-semibold cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            This is the currency you selected during subscription.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 pt-4">
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed transition-colors font-semibold"
                        >
                            {isLoading ? "Processing..." : "Contribute"}
                        </button>
                        <button 
                            type="button" 
                            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition-colors" 
                            onClick={() => navigate('/dashboard')}
                        >
                            Contribute Later
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default FirstContribute;