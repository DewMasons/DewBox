import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import clsx from "clsx";
import { FaSpinner } from "react-icons/fa";
import { apiService } from "../services/api";

const schema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    pin: yup.string().required("PIN is required"),
    amount: yup
        .number()
        .typeError("Amount must be a number")
        .positive("Amount must be positive")
        .required("Amount is required"),
    currency: yup.string().required("Currency is required"),
});

const Contribute = () => {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const paystackPublicKey = "your-paystack-public-key";
    const currencyApiKey = "2708fb8247ae950fce0062b6";
    const currencyApiUrl = `https://v6.exchangerate-api.com/v6/${currencyApiKey}/latest/NGN`;

    const { data: currencies, isLoading } = useQuery({
        queryKey: ["currencies"],
        queryFn: async () => {
            const response = await axios.get(currencyApiUrl);
            return response.data.conversion_rates;
        },
    });

    const mutation = useMutation({
        mutationFn: (data) => apiService.contribute(data),
        onSuccess: () => {
            toast.success("Contribution successful!");
            reset();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Contribution failed");
        },
    });

    const amount = watch("amount");
    const currency = watch("currency");

    useEffect(() => {
        const convertToNGN = async () => {
            if (amount && currency) {
                try {
                    const response = await axios.get(currencyApiUrl);
                    const rate = response.data.conversion_rates[currency];
                    const convertedAmount = amount / rate;
                    setValue("amountNGN", convertedAmount.toFixed(2));
                } catch (error) {
                    toast.error("Currency conversion failed. Please try again.");
                }
            }
        };
        convertToNGN();
    }, [amount, currency, setValue]);

    const onSubmit = async (data) => {
        mutation.mutate({
            ...data,
            type: "CONTRIBUTION",
        });
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-md mx-auto p-4"
        >
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-gray-200/50">
                <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Contribute to MyDewbox
                </h2>
                {/* Contribution Type Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-purple-50 rounded-xl p-4 flex flex-col items-center">
                        <span className="text-sm font-semibold text-purple-700 mb-2">
                            Monthly
                        </span>
                        <span className="text-2xl font-bold text-purple-800">00</span>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 flex flex-col items-center">
                        <span className="text-sm font-semibold text-blue-700 mb-2">
                            Weekly
                        </span>
                        <span className="text-2xl font-bold text-blue-800">00</span>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center">
                        <span className="text-sm font-semibold text-gray-700 mb-2">None</span>
                        <span className="text-2xl font-bold text-gray-800">00</span>
                    </div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <input
                            type="email"
                            placeholder="E-mail"
                            {...register("email")}
                            className={clsx(
                                "w-full px-4 py-3 rounded-lg",
                                "bg-white/50",
                                "border border-gray-200",
                                "focus:ring-2 focus:ring-purple-500 focus:border-transparent",
                                "outline-none transition-all duration-200",
                                errors.email && "border-red-500 focus:ring-red-500"
                            )}
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.email.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Enter your PIN"
                            {...register("pin")}
                            className={clsx(
                                "w-full px-4 py-3 rounded-lg",
                                "bg-white/50",
                                "border border-gray-200",
                                "focus:ring-2 focus:ring-purple-500 focus:border-transparent",
                                "outline-none transition-all duration-200",
                                errors.pin && "border-red-500 focus:ring-red-500"
                            )}
                        />
                        {errors.pin && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.pin.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <select
                            {...register("currency")}
                            className={clsx(
                                "w-full text-gray-800 px-4 py-3 rounded-lg",
                                "bg-white/50",
                                "border border-gray-200",
                                "focus:ring-2 focus:ring-purple-500 focus:border-transparent",
                                "outline-none transition-all duration-200",
                                errors.currency && "border-red-500 focus:ring-red-500"
                            )}
                        >
                            <option className="text-gray-800" value="">Select Currency</option>
                            {isLoading ? (
                                <option disabled>Loading...</option>
                            ) : (
                                currencies &&
                                Object.keys(currencies).map((currency) => (
                                    <option key={currency} value={currency}>
                                        {currency}
                                    </option>
                                ))
                            )}
                        </select>
                        {errors.currency && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.currency.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Amount"
                            {...register("amount")}
                            className={clsx(
                                "w-full px-4 py-3 rounded-lg",
                                "bg-white/50",
                                "border border-gray-200",
                                "focus:ring-2 focus:ring-purple-500 focus:border-transparent",
                                "outline-none transition-all duration-200",
                                errors.amount && "border-red-500 focus:ring-red-500"
                            )}
                        />
                        {errors.amount && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.amount.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Amount in NGN"
                            {...register("amountNGN")}
                            readOnly
                            className={clsx(
                                "w-full px-4 py-3 rounded-lg",
                                "bg-gray-100/50",
                                "border border-gray-200",
                                "cursor-not-allowed"
                            )}
                        />
                    </div>
                    <motion.button
                        type="submit"
                        className={clsx(
                            "w-full px-6 py-3 rounded-lg",
                            "bg-gradient-to-r from-purple-600 to-indigo-600",
                            "text-white font-medium",
                            "hover:from-purple-700 hover:to-indigo-700",
                            "focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
                            "transform transition-all duration-200",
                            "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <FaSpinner className="animate-spin mx-auto" />
                        ) : (
                            "Contribute"
                        )}
                    </motion.button>
                </form>
            </div>
        </motion.section>
    );
};

export default Contribute;