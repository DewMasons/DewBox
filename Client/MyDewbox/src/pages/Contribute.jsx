import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Heart, TrendingUp, Users, CheckCircle2, ArrowRight, Wallet, PiggyBank, Check, CreditCard } from "lucide-react";
import { apiService } from "../services/api";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import { useAuthStore } from "../store/authstore";

const schema = yup.object().shape({
    amount: yup
        .number()
        .typeError("Amount must be a number")
        .positive("Amount must be greater than 0")
        .required("Amount is required"),
    description: yup.string().max(200, "Description must be less than 200 characters"),
    contributionType: yup.string().required("Please select a contribution type"),
    paymentMethod: yup.string().required("Please select a payment method"),
});

const Contribute = () => {
    const [showSuccess, setShowSuccess] = useState(false);
    const [contributionAmount, setContributionAmount] = useState(0);
    const [selectedType, setSelectedType] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    
    // Get subscriber data for email
    const { data: subscriberData } = useQuery({
        queryKey: ['subscriber'],
        queryFn: () => apiService.getSubscriber(),
    });
    
    const contributionTypes = [
        { 
            id: "ica", 
            title: "ICA", 
            subtitle: "Investment Cooperative Account",
            description: "Join an investment cooperative group. Rotating collection",
            icon: TrendingUp,
            color: "ocean-blue",
            features: ["Yearly commitment", "Earns interest", "Rotating collection"]
        },
        { 
            id: "esusu", 
            title: "e-susu", 
            subtitle: "Rotating Savings",
            description: "Join a savings rotation group",
            icon: Users,
            color: "bright-cyan",
            features: ["Monthly rotation", "Community savings", "Collective growth"]
        },
        { 
            id: "piggy", 
            title: "Piggy", 
            subtitle: "Flexible Savings",
            description: "Save at your own pace",
            icon: PiggyBank,
            color: "deep-teal",
            features: ["Flexible withdrawals", "No commitments", "Your personal wallet"]
        },
    ];

    const paymentMethods = [
        {
            id: "wallet",
            title: "Wallet",
            subtitle: "Pay from your wallet balance",
            icon: Wallet,
            color: "ocean-blue"
        },
        {
            id: "bank",
            title: "Bank Card",
            subtitle: "Pay with debit/credit card",
            icon: CreditCard,
            color: "bright-cyan"
        }
    ];
    
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isValid },
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
    });

    // Contribution mutation
    const mutation = useMutation({
        mutationFn: (data) => apiService.contribute(data),
        onSuccess: (response) => {
            // Wallet payment success
            setContributionAmount(response.data?.amount || 0);
            setShowSuccess(true);
            const typeLabel = contributionTypes.find(t => t.id === selectedType)?.title || 'Contribution';
            toast.success(`${typeLabel} contribution added successfully! 🎉`);
            queryClient.invalidateQueries(['transactions']);
            queryClient.invalidateQueries(['subscriber']);
            queryClient.invalidateQueries(['contributionInfo']);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to contribute. Please try again");
        },
    });

    // Load Paystack script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const onSubmit = async (data) => {
        // If e-susu is selected, redirect to coop page
        if (data.contributionType === 'esusu') {
            toast.info('e-susu contributions are managed through cooperatives. Redirecting...');
            setTimeout(() => {
                window.location.href = '/coops';
            }, 1500);
            return;
        }

        // If bank payment is selected, initiate Paystack payment
        if (data.paymentMethod === 'bank') {
            const email = subscriberData?.data?.subscriber?.email || user?.email;
            
            if (!email) {
                toast.error('Email not found. Please update your profile.');
                return;
            }

            // Initialize Paystack
            const PaystackPop = window.PaystackPop;
            if (!PaystackPop) {
                toast.error('Payment system not loaded. Please refresh the page.');
                return;
            }

            const handler = PaystackPop.setup({
                key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_live_97216478fbe511ebcbb27563d08f7fde0a03ff89',
                email: email,
                amount: parseFloat(data.amount) * 100, // Convert to kobo
                currency: 'NGN',
                ref: `CONT-${Date.now()}-${Math.random().toString(36).substring(7)}`,
                metadata: {
                    contributionType: data.contributionType.toUpperCase(),
                    description: data.description || 'Contribution',
                    custom_fields: [
                        {
                            display_name: "Contribution Type",
                            variable_name: "contribution_type",
                            value: data.contributionType.toUpperCase()
                        }
                    ]
                },
                callback: function(response) {
                    // Payment successful
                    toast.success('Payment successful! Processing contribution...');
                    
                    // Verify payment and process contribution
                    apiService.verifyContribution(response.reference)
                        .then((verifyResponse) => {
                            setContributionAmount(verifyResponse.data?.amount || data.amount);
                            setShowSuccess(true);
                            const typeLabel = contributionTypes.find(t => t.id === selectedType)?.title || 'Contribution';
                            toast.success(`${typeLabel} contribution processed successfully! 🎉`);
                            queryClient.invalidateQueries(['transactions']);
                            queryClient.invalidateQueries(['subscriber']);
                            queryClient.invalidateQueries(['contributionInfo']);
                        })
                        .catch((error) => {
                            toast.error(error.response?.data?.message || 'Failed to process contribution');
                        });
                },
                onClose: function() {
                    toast.info('Payment cancelled');
                }
            });

            handler.openIframe();
            return;
        }

        // Wallet payment
        mutation.mutate({
            amount: data.amount,
            type: data.contributionType.toUpperCase(),
            description: data.description || 'Contribution',
            paymentMethod: 'wallet',
        });
    };

    const handleNewContribution = () => {
        setShowSuccess(false);
        setContributionAmount(0);
        setSelectedType('');
        setSelectedPaymentMethod('');
        reset();
    };

    const handleTypeSelect = (typeId) => {
        setSelectedType(typeId);
        setValue('contributionType', typeId, { shouldValidate: true });
    };

    const handlePaymentMethodSelect = (methodId) => {
        setSelectedPaymentMethod(methodId);
        setValue('paymentMethod', methodId, { shouldValidate: true });
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
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="text-green-600" size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">
                            Contribution Successful
                        </h2>
                        <p className="text-base text-[var(--color-text-secondary)] mb-6">
                            You've contributed <span className="font-bold text-green-600">₦{contributionAmount.toLocaleString()}</span>
                        </p>
                        
                        <div className="bg-[var(--color-surface-elevated)] rounded-lg p-6 mb-6">
                            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                                Your contribution is now working for you. Earn returns and grow your wealth with the community.
                            </p>
                            <div className="flex items-center justify-center gap-8 text-sm">
                                <div className="text-center">
                                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mx-auto mb-2">
                                        <TrendingUp className="text-green-600" size={20} />
                                    </div>
                                    <p className="font-medium text-[var(--color-text-primary)]">Earn Returns</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 rounded-lg bg-[var(--color-primary-light)] flex items-center justify-center mx-auto mb-2">
                                        <Users className="text-[var(--color-primary)]" size={20} />
                                    </div>
                                    <p className="font-medium text-[var(--color-text-primary)]">Build Together</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center mx-auto mb-2">
                                        <Heart className="text-red-600" size={20} />
                                    </div>
                                    <p className="font-medium text-[var(--color-text-primary)]">Build Wealth</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="secondary"
                                onClick={handleNewContribution}
                                fullWidth
                            >
                                Contribute More
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
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="mb-8">
                <div className="w-12 h-12 rounded-lg bg-[var(--color-primary-light)] flex items-center justify-center mb-4">
                    <TrendingUp className="text-[var(--color-primary)]" size={24} />
                </div>
                <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
                    Make a Contribution
                </h1>
                <p className="text-[var(--color-text-secondary)]">
                    Contribute and earn returns with the community
                </p>
            </div>

            <Card variant="elevated" padding="lg">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Contribution Type Selection */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-3">
                            Select Contribution Type
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {contributionTypes.map((type) => {
                                const Icon = type.icon;
                                const isSelected = selectedType === type.id;
                                return (
                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => handleTypeSelect(type.id)}
                                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                                            isSelected
                                                ? 'border-ocean-blue bg-ice-blue'
                                                : 'border-gray-200 hover:border-gray-300 bg-white'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                isSelected ? 'bg-ocean-blue' : 'bg-gray-100'
                                            }`}>
                                                <Icon className={isSelected ? 'text-white' : 'text-gray-600'} size={20} />
                                            </div>
                                            {isSelected && (
                                                <div className="w-6 h-6 rounded-full bg-ocean-blue flex items-center justify-center">
                                                    <Check className="text-white" size={14} />
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">
                                            {type.title}
                                        </h3>
                                        <p className="text-xs text-[var(--color-text-secondary)] mb-2">
                                            {type.subtitle}
                                        </p>
                                        <p className="text-xs text-[var(--color-text-secondary)]">
                                            {type.description}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                        {errors.contributionType && (
                            <p className="text-red-500 text-sm mt-2">{errors.contributionType.message}</p>
                        )}
                    </div>

                    {/* Show features when type is selected */}
                    {selectedType && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-ice-blue border border-sky-blue rounded-xl p-4"
                        >
                            <h4 className="font-medium text-dark-navy mb-2">
                                {contributionTypes.find(t => t.id === selectedType)?.title} Features:
                            </h4>
                            <ul className="space-y-1">
                                {contributionTypes.find(t => t.id === selectedType)?.features.map((feature, idx) => (
                                    <li key={idx} className="text-sm text-dark-navy flex items-center gap-2">
                                        <Check size={14} className="text-ocean-blue" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    )}

                    {/* Payment Method Selection */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-3">
                            Select Payment Method
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {paymentMethods.map((method) => {
                                const Icon = method.icon;
                                const isSelected = selectedPaymentMethod === method.id;
                                return (
                                    <button
                                        key={method.id}
                                        type="button"
                                        onClick={() => handlePaymentMethodSelect(method.id)}
                                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                                            isSelected
                                                ? 'border-ocean-blue bg-ice-blue'
                                                : 'border-gray-200 hover:border-gray-300 bg-white'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                isSelected ? 'bg-ocean-blue' : 'bg-gray-100'
                                            }`}>
                                                <Icon className={isSelected ? 'text-white' : 'text-gray-600'} size={20} />
                                            </div>
                                            {isSelected && (
                                                <div className="w-6 h-6 rounded-full bg-ocean-blue flex items-center justify-center">
                                                    <Check className="text-white" size={14} />
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">
                                            {method.title}
                                        </h3>
                                        <p className="text-xs text-[var(--color-text-secondary)]">
                                            {method.subtitle}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                        {errors.paymentMethod && (
                            <p className="text-red-500 text-sm mt-2">{errors.paymentMethod.message}</p>
                        )}
                    </div>

                    <Input
                        type="number"
                        label="Contribution Amount (₦)"
                        placeholder="Enter amount to contribute"
                        error={errors.amount?.message}
                        {...register("amount")}
                    />

                    <Input
                        type="text"
                        label="Note (Optional)"
                        placeholder="Add a note about your contribution"
                        error={errors.description?.message}
                        {...register("description")}
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        loading={mutation.isPending}
                        disabled={!isValid || mutation.isPending}
                        icon={<TrendingUp size={20} />}
                    >
                        {mutation.isPending ? 'Processing...' : 'Contribute Now'}
                    </Button>
                </form>
            </Card>

            <div className="mt-6 text-center">
                <p className="text-sm text-[var(--color-text-secondary)]">
                    All contributions are recorded and earn returns over time
                </p>
            </div>
        </motion.div>
    );
};

export default Contribute;
