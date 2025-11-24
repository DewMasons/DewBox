import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Heart, TrendingUp, Users, CheckCircle2, ArrowRight } from "lucide-react";
import { apiService } from "../services/api";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";

const schema = yup.object().shape({
    amount: yup
        .number()
        .typeError("Amount must be a number")
        .positive("Amount must be greater than 0")
        .required("Amount is required"),
    description: yup.string().max(200, "Description must be less than 200 characters"),
});

const Contribute = () => {
    const [showSuccess, setShowSuccess] = useState(false);
    const [contributionAmount, setContributionAmount] = useState(0);
    const [contributionType, setContributionType] = useState('');
    const queryClient = useQueryClient();
    
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
    });

    // Fetch contribution info
    const { data: contributionInfo } = useQuery({
        queryKey: ['contributionInfo'],
        queryFn: async () => {
            const response = await apiService.getContributionInfo();
            return response.data;
        }
    });

    // Contribution mutation
    const mutation = useMutation({
        mutationFn: (data) => apiService.contribute(data),
        onSuccess: (response) => {
            setContributionAmount(response.data?.amount || 0);
            setContributionType(response.data?.type || '');
            setShowSuccess(true);
            const message = response.data?.type === 'ICA' 
                ? "ICA savings added! Earning yearly interest 🎉"
                : "Piggy savings added successfully! 🎉";
            toast.success(message);
            queryClient.invalidateQueries(['transactions']);
            queryClient.invalidateQueries(['subscriber']);
            queryClient.invalidateQueries(['contributionInfo']);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to save. Please try again");
        },
    });

    const onSubmit = async (data) => {
        mutation.mutate({
            amount: data.amount,
            description: data.description || 'Savings contribution',
        });
    };

    const handleNewContribution = () => {
        setShowSuccess(false);
        setContributionAmount(0);
        reset();
    };

    if (showSuccess) {
        return (
            <motion.div
                className="max-w-2xl mx-auto p-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Card variant="elevated" padding="lg">
                    <div className="text-center">
                        <div className="w-20 h-20 rounded-full bg-[#059669] flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="text-white" size={48} />
                        </div>
                        <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-3">
                            Thank You! 🎉
                        </h2>
                        <p className="text-lg text-[var(--color-text-secondary)] mb-6">
                            You've saved <span className="font-bold text-[#059669]">₦{contributionAmount.toLocaleString()}</span> successfully
                        </p>
                        
                        <div className="bg-[var(--color-surface)] rounded-xl p-6 mb-6">
                            <p className="text-[var(--color-text-secondary)] mb-4">
                                Your savings are now working for you. Earn returns and grow your wealth with the community.
                            </p>
                            <div className="flex items-center justify-center gap-8 text-sm">
                                <div className="text-center">
                                    <TrendingUp className="text-[#059669] mx-auto mb-2" size={24} />
                                    <p className="font-medium text-[var(--color-text-primary)]">Earn Returns</p>
                                </div>
                                <div className="text-center">
                                    <Users className="text-[#0066FF] mx-auto mb-2" size={24} />
                                    <p className="font-medium text-[var(--color-text-primary)]">Save Together</p>
                                </div>
                                <div className="text-center">
                                    <Heart className="text-[#dc2626] mx-auto mb-2" size={24} />
                                    <p className="font-medium text-[var(--color-text-primary)]">Build Wealth</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={handleNewContribution}
                                fullWidth
                            >
                                Save More
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => window.location.href = '/dashboard'}
                                fullWidth
                                icon={<ArrowRight size={20} />}
                            >
                                Go to Dashboard
                            </Button>
                        </div>
                    </div>
                </Card>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="max-w-2xl mx-auto p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="mb-8 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0066FF] to-[#059669] flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="text-white" size={32} />
                </div>
                <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                    Add to Savings
                </h1>
                <p className="text-[var(--color-text-secondary)]">
                    Save money and earn returns with the community
                </p>
            </div>

            <Card variant="elevated" padding="lg">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {contributionInfo && (
                        <div className={`rounded-xl p-6 mb-6 border-2 ${
                            contributionInfo.type === 'ICA' 
                                ? 'bg-[#E6F0FF] border-[#0066FF]' 
                                : 'bg-[#fef3c7] border-[#d97706]'
                        }`}>
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    contributionInfo.type === 'ICA' ? 'bg-[#0066FF]' : 'bg-[#d97706]'
                                }`}>
                                    <TrendingUp className="text-white" size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-[var(--color-text-primary)] mb-2">
                                        {contributionInfo.type === 'ICA' ? '📈 ICA - Investment Cooperative' : '🐷 Piggy Savings'}
                                    </h3>
                                    <p className="text-sm text-[var(--color-text-secondary)] mb-3">
                                        {contributionInfo.description}
                                    </p>
                                    <div className="text-xs text-[var(--color-text-secondary)]">
                                        {contributionInfo.type === 'ICA' ? (
                                            <>
                                                <p>✓ Yearly commitment with interest</p>
                                                <p>✓ Funds transfer to admin wallet</p>
                                                <p>✓ Withdraw at year end</p>
                                            </>
                                        ) : (
                                            <>
                                                <p>✓ Monthly savings</p>
                                                <p>✓ Stays in your wallet</p>
                                                <p>✓ Withdraw at month end</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <Input
                        type="number"
                        label="Savings Amount (₦)"
                        placeholder="Enter amount to save"
                        error={errors.amount?.message}
                        {...register("amount")}
                    />

                    <Input
                        type="text"
                        label="Note (Optional)"
                        placeholder="Add a note about your savings"
                        error={errors.description?.message}
                        {...register("description")}
                    />

                    <div className="bg-[#dcfce7] border border-[#059669] rounded-lg p-4">
                        <p className="text-sm text-[#059669] font-medium">
                            💰 Your savings will earn returns and help you build wealth
                        </p>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        loading={mutation.isPending}
                        disabled={!isValid || mutation.isPending}
                        icon={<TrendingUp size={20} />}
                    >
                        {mutation.isPending ? 'Processing...' : 'Save Now'}
                    </Button>
                </form>
            </Card>

            <div className="mt-6 text-center">
                <p className="text-sm text-[var(--color-text-secondary)]">
                    All savings are recorded and earn returns over time
                </p>
            </div>
        </motion.div>
    );
};

export default Contribute;
