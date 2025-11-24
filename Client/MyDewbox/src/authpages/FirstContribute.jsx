import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/authstore";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import apiService from "../services/api";
import { Check, ArrowRight, ArrowLeft, Sparkles, CreditCard, Wallet, DollarSign } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";

const FirstContribute = () => {
  const navigate = useNavigate();
  const { user, setHasContributed } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [contributionType, setContributionType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: subscriberData, isLoading } = useQuery({
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

  const steps = [
    { id: 0, title: "Welcome", icon: Sparkles },
    { id: 1, title: "Type", icon: Wallet },
    { id: 2, title: "Amount", icon: DollarSign },
    { id: 3, title: "Payment", icon: CreditCard },
    { id: 4, title: "Confirm", icon: Check },
  ];

  const contributionTypes = [
    { id: "esusu", title: "Esusu Circle", description: "Join monthly savings rotation", recommended: true },
    { id: "personal", title: "Personal Savings", description: "Save at your own pace" },
    { id: "group", title: "Group Savings", description: "Save with friends or family" },
  ];

  const paymentMethods = [
    { id: "card", title: "Debit/Credit Card", icon: "💳" },
    { id: "bank", title: "Bank Transfer", icon: "🏦" },
    { id: "wallet", title: "Digital Wallet", icon: "📱" },
  ];

  const handleContribute = async () => {
    if (!user) {
      toast.error("Please sign in to contribute");
      navigate("/signin");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required");
        navigate("/signin");
        return;
      }

      // Step 1: Initialize Paystack payment (first payment is a fee)
      const depositResponse = await apiService.createTransaction({
        type: 'FEE',
        amount: parseFloat(amount)
      });

      if (depositResponse.status === 'success' && depositResponse.data?.authorization_url) {
        // Open Paystack payment page
        window.location.href = depositResponse.data.authorization_url;
        
        // Note: After payment, user will be redirected back
        // The contribution will be made automatically after successful payment
        // or user can make it manually from the dashboard
      } else {
        toast.error('Failed to initialize payment');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         'Failed to process payment';
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 0) {
      setCurrentStep(1);
    } else if (currentStep === 1 && contributionType) {
      setCurrentStep(2);
    } else if (currentStep === 2 && amount) {
      setCurrentStep(3);
    } else if (currentStep === 3 && paymentMethod) {
      handleContribute();
    } else if (currentStep === 4) {
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    navigate("/dashboard");
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  if (!user) {
    return (
      <motion.div 
        className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Card padding="lg" className="max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Sign in to Contribute</h2>
          <p className="mb-6 text-gray-600">You must be signed in to make your first contribution.</p>
          <Button 
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => navigate('/signin')}
          >
            Go to Sign In
          </Button>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === index;
              const isCompleted = currentStep > index;
              
              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <motion.div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                        isCompleted ? 'bg-success-500' :
                        isActive ? 'bg-primary-500' :
                        'bg-gray-200'
                      }`}
                      initial={false}
                      animate={{
                        scale: isActive ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon className={`w-6 h-6 ${
                        isCompleted || isActive ? 'text-white' : 'text-gray-400'
                      }`} />
                    </motion.div>
                    <span className={`text-xs font-medium ${
                      isActive ? 'text-primary-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 rounded ${
                      isCompleted ? 'bg-success-500' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <Card padding="lg" className="min-h-[400px] relative overflow-hidden">
          <AnimatePresence mode="wait" custom={currentStep}>
            <motion.div
              key={currentStep}
              custom={currentStep}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Step 0: Welcome */}
              {currentStep === 0 && (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <Sparkles className="w-20 h-20 mx-auto mb-6 text-primary-500" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Welcome to MyDewbox!
                  </h2>
                  <p className="text-lg text-gray-600 mb-2">
                    Let's get you started with your first contribution
                  </p>
                  <p className="text-sm text-gray-500">
                    This will only take a minute
                  </p>
                </div>
              )}

              {/* Step 1: Contribution Type */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Choose Your Savings Type
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Select how you'd like to save
                  </p>
                  <div className="space-y-3">
                    {contributionTypes.map((type) => (
                      <motion.button
                        key={type.id}
                        onClick={() => setContributionType(type.id)}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                          contributionType === type.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900">{type.title}</h3>
                              {type.recommended && (
                                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                                  Recommended
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                          </div>
                          {contributionType === type.id && (
                            <Check className="w-6 h-6 text-primary-500" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Amount */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Enter Amount
                  </h2>
                  <p className="text-gray-600 mb-6">
                    How much would you like to contribute?
                  </p>
                  <div className="space-y-4">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-4xl font-bold text-gray-400">
                        {subscriberCurrency === 'NGN' ? '₦' : '$'}
                      </span>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-16 pr-4 py-6 text-5xl font-bold border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none text-center"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="flex gap-2">
                      {[100, 500, 1000, 5000].map((preset) => (
                        <button
                          key={preset}
                          onClick={() => setAmount(preset.toString())}
                          className="flex-1 py-2 px-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                        >
                          {subscriberCurrency === 'NGN' ? '₦' : '$'}{preset}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Payment Method */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Select Payment Method
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Choose how you'd like to pay
                  </p>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <motion.button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                          paymentMethod === method.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{method.icon}</span>
                            <h3 className="font-semibold text-gray-900">{method.title}</h3>
                          </div>
                          {paymentMethod === method.id && (
                            <Check className="w-6 h-6 text-primary-500" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Success */}
              {currentStep === 4 && (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                  >
                    <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check className="w-12 h-12 text-success-500" />
                    </div>
                  </motion.div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Contribution Successful!
                  </h2>
                  <p className="text-lg text-gray-600 mb-6">
                    You've successfully contributed {subscriberCurrency} {amount}
                  </p>
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <div className="space-y-3 text-left">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-semibold text-gray-900 capitalize">{contributionType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-semibold text-gray-900">{subscriberCurrency} {amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment:</span>
                        <span className="font-semibold text-gray-900 capitalize">{paymentMethod}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8">
            {currentStep > 0 && currentStep < 4 && (
              <Button
                variant="outline"
                size="lg"
                onClick={handleBack}
                icon={<ArrowLeft size={20} />}
              >
                Back
              </Button>
            )}
            
            {currentStep < 4 && (
              <Button
                variant="ghost"
                size="lg"
                onClick={handleSkip}
                className="ml-auto"
              >
                Skip for now
              </Button>
            )}

            <Button
              variant="primary"
              size="lg"
              fullWidth={currentStep === 0}
              onClick={handleNext}
              loading={isSubmitting}
              disabled={
                (currentStep === 1 && !contributionType) ||
                (currentStep === 2 && !amount) ||
                (currentStep === 3 && !paymentMethod)
              }
              icon={currentStep === 4 ? null : <ArrowRight size={20} />}
              iconPosition="right"
            >
              {currentStep === 0 ? "Get Started" :
               currentStep === 3 ? "Confirm & Pay" :
               currentStep === 4 ? "Go to Dashboard" :
               "Continue"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FirstContribute;
