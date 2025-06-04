import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { FaWallet, FaUniversity, FaExchangeAlt, FaMoneyBillWave, FaUserFriends, FaArrowLeft } from "react-icons/fa";
import clsx from "clsx";
import apiService from "../services/api";

const schema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    amount: yup.number().positive("Amount must be positive").required("Amount is required"),
    pin: yup.string().min(4, "PIN must be at least 4 digits").required("PIN is required"),
});

const TransactionOption = ({ type, icon: Icon, label, onClick, isActive }) => (
    <motion.div
        className={clsx(
            "p-6 rounded-2xl cursor-pointer",
            "bg-white shadow-md hover:shadow-lg border border-gray-200",
            "transition-all duration-200",
            isActive && "ring-2 ring-blue-500"
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
    >
        <div className="flex items-center gap-4">
            <div className={clsx(
                "p-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600",
                isActive && "from-blue-700 to-indigo-700"
            )}>
                <Icon className="text-white text-xl" />
            </div>
            <span className="font-medium text-gray-900">{label}</span>
        </div>
    </motion.div>
);

const FormInput = ({ label, error, ...props }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <input
            className={clsx(
                "w-full px-4 py-2 rounded-lg",
                "bg-white/50 border border-gray-200",
                "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                "outline-none transition-all duration-200",
                error && "border-red-500 focus:ring-red-500"
            )}
            {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
);

const FormButton = ({ children, secondary, ...props }) => (
    <motion.button
        className={clsx(
            "px-6 py-2 rounded-lg font-medium",
            "transform transition-all duration-200",
            secondary
                ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
    >
        {children}
    </motion.button>
);

const transactionOptions = [
    { 
        id: 'deposit',
        type: 'deposit', 
        icon: FaWallet, 
        label: 'Fund Wallet',
        title: 'Fund Wallet'
    },
    { 
        id: 'withdraw',
        type: 'withdraw', 
        icon: FaUniversity, 
        label: 'Withdraw',
        title: 'Withdraw Funds'
    },
    { 
        id: 'transfer',
        type: 'transfer', 
        icon: FaExchangeAlt, 
        label: 'Pay to Bank',
        title: 'Pay to Bank Account'
    },
    { 
        id: 'wallet',
        type: 'wallet', 
        icon: FaMoneyBillWave, 
        label: 'Send to User',
        title: 'Send to User'
    }
];

const Transactions = () => {
    const [activeTransaction, setActiveTransaction] = useState(null);
    const queryClient = useQueryClient();
    
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    // Fetch banks using API service
    const { data: banks, isLoading } = useQuery({
        queryKey: ['banks'],
        queryFn: () => apiService.getBanks()
    });

    // Create mutations for different transaction types
    const depositMutation = useMutation({
        mutationFn: (data) => apiService.createTransaction({ 
            ...data, 
            type: 'CONTRIBUTION'
        }),
        onSuccess: () => {
            toast.success("Deposit successful!");
            queryClient.invalidateQueries(['transactions']);
            reset();
            setActiveTransaction(null);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to process deposit");
        }
    });

    const withdrawMutation = useMutation({
        mutationFn: (data) => apiService.createTransaction({ 
            ...data, 
            type: 'WITHDRAWAL'
        }),
        onSuccess: () => {
            toast.success("Withdrawal successful!");
            queryClient.invalidateQueries(['transactions']);
            reset();
            setActiveTransaction(null);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to process withdrawal");
        }
    });

    const transferMutation = useMutation({
        mutationFn: (data) => apiService.createTransaction({ 
            ...data, 
            type: 'TRANSFER'
        }),
        onSuccess: () => {
            toast.success("Transfer successful!");
            queryClient.invalidateQueries(['transactions']);
            reset();
            setActiveTransaction(null);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to process transfer");
        }
    });

    const verifyBankMutation = useMutation({
        mutationFn: (data) => apiService.verifyBankAccount(data),
        onSuccess: (data) => {
            toast.success(`Account verified: ${data.accountName}`);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to verify account");
        }
    });

    const handleTransaction = (data, type) => {
        switch (type) {
            case 'deposit':
                depositMutation.mutate(data);
                break;
            case 'withdraw':
                withdrawMutation.mutate(data);
                break;
            case 'transfer':
                transferMutation.mutate(data);
                break;
            case 'wallet':
                transferMutation.mutate({ ...data, isWalletTransfer: true });
                break;
            default:
                break;
        }
    };

    const verifyBank = async (accountNumber, bankCode) => {
        verifyBankMutation.mutate({ accountNumber, bankCode });
    };

    const renderActiveForm = () => {
        if (!activeTransaction) return null;

        const formProps = {
            animate: { opacity: 1, y: 0 },
            initial: { opacity: 0, y: 20 },
            transition: { duration: 0.3 },
            exit: { opacity: 0, y: -20 }
        };

        switch (activeTransaction) {
            case 'deposit':
                return (
                    <motion.form 
                        key="deposit-form"
                        className={clsx(
                            "mt-8 p-6 rounded-xl",
                            "bg-white/80 backdrop-blur-sm",
                            "border border-gray-200/50",
                            "shadow-lg"
                        )}
                        onSubmit={handleSubmit(handleTransaction)}
                        {...formProps}
                    >
                        <h3 className="flex items-center gap-2 text-xl font-semibold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            <FaWallet className="text-blue-600" /> Fund Wallet
                        </h3>
                        <FormInput
                            type="email"
                            label="Email"
                            {...register("email")}
                            error={errors.email?.message}
                        />
                        <FormInput
                            type="number"
                            label="Amount"
                            {...register("amount")}
                            error={errors.amount?.message}
                        />
                        <div className="mt-6 flex gap-4">
                            <FormButton type="button" secondary onClick={() => setActiveTransaction(null)}>
                                <FaArrowLeft className="mr-2" /> Back
                            </FormButton>
                            <FormButton type="submit">Pay with Paystack</FormButton>
                        </div>
                    </motion.form>
                );
            case 'withdraw':
                return (
                    <motion.form 
                        key="withdraw-form"
                        className={clsx(
                            "mt-8 p-6 rounded-xl",
                            "bg-white/80 backdrop-blur-sm",
                            "border border-gray-200/50",
                            "shadow-lg"
                        )}
                        onSubmit={handleSubmit((data) => handleTransaction(data, "withdraw"))}
                        {...formProps}
                    >
                        <h3 className="flex items-center gap-2 text-xl font-semibold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            <FaUniversity className="text-blue-600" /> Withdraw Funds
                        </h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bank
                            </label>
                            <select
                                {...register("bank")}
                                disabled={isLoading}
                                className={clsx(
                                    "w-full px-4 py-2 rounded-lg",
                                    "bg-white/50 border border-gray-200",
                                    "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                    "outline-none transition-all duration-200"
                                )}
                            >
                                {banks?.map((bank) => (
                                    <option key={bank.code} value={bank.code}>{bank.name}</option>
                                ))}
                            </select>
                        </div>
                        <FormInput
                            type="text"
                            label="Account Number"
                            {...register("account")}
                        />
                        <FormInput
                            type="number"
                            label="Amount"
                            {...register("amount")}
                            error={errors.amount?.message}
                        />
                        <FormInput
                            type="password"
                            label="PIN"
                            {...register("pin")}
                            error={errors.pin?.message}
                        />
                        <div className="flex gap-4 mt-6">
                            <FormButton type="button" secondary onClick={() => setActiveTransaction(null)}>
                                <FaArrowLeft className="mr-2" /> Back
                            </FormButton>
                            <FormButton type="button" secondary onClick={() => verifyBank("account", "bank")}>
                                Verify Bank
                            </FormButton>
                            <FormButton type="submit">Withdraw</FormButton>
                        </div>
                    </motion.form>
                );
            case 'transfer':
                return (
                    <motion.form 
                        key="transfer-form"
                        className={clsx(
                            "mt-8 p-6 rounded-xl",
                            "bg-white/80 backdrop-blur-sm",
                            "border border-gray-200/50",
                            "shadow-lg"
                        )}
                        onSubmit={handleSubmit((data) => handleTransaction(data, "transfer"))}
                        {...formProps}
                    >
                        <h3 className="flex items-center gap-2 text-xl font-semibold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            <FaExchangeAlt className="text-blue-600" /> Pay to Bank Account
                        </h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bank
                            </label>
                            <select
                                {...register("bank")}
                                disabled={isLoading}
                                className={clsx(
                                    "w-full px-4 py-2 rounded-lg",
                                    "bg-white/50 border border-gray-200",
                                    "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                    "outline-none transition-all duration-200"
                                )}
                            >
                                {banks?.map((bank) => (
                                    <option key={bank.code} value={bank.code}>{bank.name}</option>
                                ))}
                            </select>
                        </div>
                        <FormInput
                            type="text"
                            label="Account Number"
                            {...register("account")}
                        />
                        <FormInput
                            type="number"
                            label="Amount"
                            {...register("amount")}
                            error={errors.amount?.message}
                        />
                        <FormInput
                            type="password"
                            label="PIN"
                            {...register("pin")}
                            error={errors.pin?.message}
                        />
                        <div className="flex gap-4 mt-6">
                            <FormButton type="button" secondary onClick={() => setActiveTransaction(null)}>
                                <FaArrowLeft className="mr-2" /> Back
                            </FormButton>
                            <FormButton type="button" secondary onClick={() => verifyBank("account", "bank")}>
                                Verify Account
                            </FormButton>
                            <FormButton type="submit">Transfer</FormButton>
                        </div>
                    </motion.form>
                );
            case 'wallet':
                return (
                    <motion.form 
                        key="wallet-form"
                        className={clsx(
                            "mt-8 p-6 rounded-xl",
                            "bg-white/80 backdrop-blur-sm",
                            "border border-gray-200/50",
                            "shadow-lg"
                        )}
                        onSubmit={handleSubmit((data) => handleTransaction(data, "wallet"))}
                        {...formProps}
                    >
                        <h3 className="flex items-center gap-2 text-xl font-semibold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            <FaUserFriends className="text-blue-600" /> Send to User
                        </h3>
                        <FormInput
                            type="email"
                            label="Recipient Email"
                            {...register("email")}
                            error={errors.email?.message}
                        />
                        <FormInput
                            type="number"
                            label="Amount"
                            {...register("amount")}
                            error={errors.amount?.message}
                        />
                        <FormInput
                            type="text"
                            label="Message (Optional)"
                            {...register("message")}
                        />
                        <FormInput
                            type="password"
                            label="PIN"
                            {...register("pin")}
                            error={errors.pin?.message}
                        />
                        <div className="mt-6 flex gap-4">
                            <FormButton type="button" secondary onClick={() => setActiveTransaction(null)}>
                                <FaArrowLeft className="mr-2" /> Back
                            </FormButton>
                            <FormButton type="submit">Send Money</FormButton>
                        </div>
                    </motion.form>
                );
            default:
                return null;
        }
    };

    return (
        <motion.section
            className="max-w-4xl mx-auto p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Transactions
            </h2>
            <div className={clsx(
                "grid grid-cols-1 md:grid-cols-2 gap-6 mb-8",
                activeTransaction && "opacity-70"
            )}>
                {transactionOptions.map(({ id, type, icon, label }) => (
                    <TransactionOption
                        key={id}
                        type={type}
                        icon={icon}
                        label={label}
                        onClick={() => setActiveTransaction(id)}
                        isActive={activeTransaction === id}
                    />
                ))}
            </div>
            <AnimatePresence mode="wait">
                {renderActiveForm()}
            </AnimatePresence>
        </motion.section>
    );
};

export default Transactions;