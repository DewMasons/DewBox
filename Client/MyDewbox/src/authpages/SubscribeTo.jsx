import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Phone, MapPin, Calendar, ArrowRight, ArrowLeft, Check } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import AuthCarousel from "../components/AuthCarousel";
import { apiService } from "../services/api";
import { useAuthStore } from '../store/authstore';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Img from '../assets/DMLogo.png';

const phoneRegex = /^(?:\+?[1-9]{1,3} ?[0-9]{10}|0[1-9]{10})$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Multi-step validation schemas
const step1Schema = yup.object().shape({
  firstname: yup.string().required("First name is required").min(2),
  othername: yup.string().required("Middle name is required").min(2),
  surname: yup.string().required("Surname is required").min(2),
  email: yup.string().required("Email is required").matches(emailRegex, "Invalid email format"),
});

const step2Schema = yup.object().shape({
  mobile: yup.string().required("Mobile number is required").matches(phoneRegex, "Invalid mobile number"),
  alternatePhone: yup.string().required("Alternate phone is required").matches(phoneRegex, "Invalid phone number"),
  dob: yup.date().required("Date of Birth is required").max(new Date(), "Invalid date"),
  gender: yup.string().required("Gender is required"),
});

const step3Schema = yup.object().shape({
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

const step4Schema = yup.object().shape({
  address1: yup.string().required("Address is required").min(5),
  city: yup.string().required("City is required"),
  state: yup.string().required("State/Region is required"),
  country: yup.string().required("Country is required"),
  currency: yup.string().required("Currency is required"),
});

const step5Schema = yup.object().shape({
  nextOfKinName: yup.string().required("Next of kin name is required").min(2),
  nextOfKinContact: yup.string().required("Next of kin contact is required").matches(phoneRegex, "Invalid phone number"),
  referral: yup.string().optional(),
  referralPhone: yup.string().optional(),
});

const SubscribeTo = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const { login: updateAuth } = useAuthStore();

  const totalSteps = 5;

  // Get schema for current step
  const getSchema = () => {
    switch (currentStep) {
      case 1: return step1Schema;
      case 2: return step2Schema;
      case 3: return step3Schema;
      case 4: return step4Schema;
      case 5: return step5Schema;
      default: return step1Schema;
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
  } = useForm({
    resolver: yupResolver(getSchema()),
    mode: "onChange",
  });

  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid) {
      const values = getValues();
      setFormData({ ...formData, ...values });
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data) => {
    const finalData = { ...formData, ...data };
    setIsLoading(true);
    
    try {
      const response = await apiService.register({
        ...finalData,
        referral: finalData.referral || "",
        referralPhone: finalData.referralPhone || "",
      });

      toast.success("Registration successful!");
      
      // Auto-login after registration
      if (response.token) {
        localStorage.setItem('token', response.token);
        updateAuth(response.user);
        navigate("/firstcontribute");
      } else {
        navigate("/signin");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <Input
              label="First Name"
              type="text"
              placeholder="John"
              icon={<User size={20} />}
              error={errors.firstname?.message}
              required
              {...register("firstname")}
            />
            <Input
              label="Middle Name"
              type="text"
              placeholder="Michael"
              icon={<User size={20} />}
              error={errors.othername?.message}
              required
              {...register("othername")}
            />
            <Input
              label="Surname"
              type="text"
              placeholder="Doe"
              icon={<User size={20} />}
              error={errors.surname?.message}
              required
              {...register("surname")}
            />
            <Input
              label="Email"
              type="email"
              placeholder="john@example.com"
              icon={<Mail size={20} />}
              error={errors.email?.message}
              required
              {...register("email")}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <PhoneInput
                country={'ng'}
                value={formData.mobile || ''}
                onChange={(value, country) => {
                  // Safely handle the onChange event
                  const event = {
                    target: {
                      name: 'mobile',
                      value: value
                    }
                  };
                  const mobileField = register("mobile");
                  if (mobileField.onChange) {
                    mobileField.onChange(event);
                  }
                }}
                inputClass="w-full"
                containerClass="phone-input-container"
                inputProps={{
                  name: 'mobile',
                  required: true,
                }}
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alternate Phone <span className="text-red-500">*</span>
              </label>
              <PhoneInput
                country={'ng'}
                value={formData.alternatePhone || ''}
                onChange={(value, country) => {
                  const event = {
                    target: {
                      name: 'alternatePhone',
                      value: value
                    }
                  };
                  const alternatePhoneField = register("alternatePhone");
                  if (alternatePhoneField.onChange) {
                    alternatePhoneField.onChange(event);
                  }
                }}
                inputClass="w-full"
                containerClass="phone-input-container"
                inputProps={{
                  name: 'alternatePhone',
                  required: true,
                }}
              />
              {errors.alternatePhone && (
                <p className="text-red-500 text-sm mt-1">{errors.alternatePhone.message}</p>
              )}
            </div>
            <Input
              label="Date of Birth"
              type="date"
              icon={<Calendar size={20} />}
              error={errors.dob?.message}
              required
              {...register("dob")}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                {...register("gender")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <Input
              label="Password"
              type="password"
              placeholder="Create a strong password"
              icon={<Lock size={20} />}
              error={errors.password?.message}
              required
              {...register("password")}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your password"
              icon={<Lock size={20} />}
              error={errors.confirmPassword?.message}
              required
              {...register("confirmPassword")}
            />
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3">
              <p className="text-xs text-cyan-800">
                Password must be at least 6 characters long.
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <Input
              label="Address"
              type="text"
              placeholder="123 Main Street"
              icon={<MapPin size={20} />}
              error={errors.address1?.message}
              required
              {...register("address1")}
            />
            <Input
              label="City"
              type="text"
              placeholder="Lagos"
              icon={<MapPin size={20} />}
              error={errors.city?.message}
              required
              {...register("city")}
            />
            <Input
              label="State/Region"
              type="text"
              placeholder="Lagos State"
              icon={<MapPin size={20} />}
              error={errors.state?.message}
              required
              {...register("state")}
            />
            <Input
              label="Country"
              type="text"
              placeholder="Nigeria"
              icon={<MapPin size={20} />}
              error={errors.country?.message}
              required
              {...register("country")}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency <span className="text-red-500">*</span>
              </label>
              <select
                {...register("currency")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="">Select currency</option>
                <option value="NGN">NGN - Nigerian Naira</option>
                <option value="USD">USD - US Dollar</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="EUR">EUR - Euro</option>
              </select>
              {errors.currency && (
                <p className="text-red-500 text-sm mt-1">{errors.currency.message}</p>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <Input
              label="Next of Kin Name"
              type="text"
              placeholder="Jane Doe"
              icon={<User size={20} />}
              error={errors.nextOfKinName?.message}
              required
              {...register("nextOfKinName")}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Next of Kin Contact <span className="text-red-500">*</span>
              </label>
              <PhoneInput
                country={'ng'}
                value={formData.nextOfKinContact || ''}
                onChange={(value, country) => {
                  const event = {
                    target: {
                      name: 'nextOfKinContact',
                      value: value
                    }
                  };
                  const nextOfKinContactField = register("nextOfKinContact");
                  if (nextOfKinContactField.onChange) {
                    nextOfKinContactField.onChange(event);
                  }
                }}
                inputClass="w-full"
                containerClass="phone-input-container"
                inputProps={{
                  name: 'nextOfKinContact',
                  required: true,
                }}
              />
              {errors.nextOfKinContact && (
                <p className="text-red-500 text-sm mt-1">{errors.nextOfKinContact.message}</p>
              )}
            </div>
            <Input
              label="Referral Code (Optional)"
              type="text"
              placeholder="Enter referral code"
              icon={<User size={20} />}
              error={errors.referral?.message}
              {...register("referral")}
            />
            <Input
              label="Referral Phone (Optional)"
              type="text"
              placeholder="Referrer's phone number"
              icon={<Phone size={20} />}
              error={errors.referralPhone?.message}
              {...register("referralPhone")}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const stepTitles = [
    "Personal Information",
    "Contact Details",
    "Security",
    "Address & Currency",
    "Emergency Contact"
  ];

  return (
    <div className='min-h-screen grid md:grid-cols-2 grid-cols-1'>
      {/* Left side - Carousel (hidden on mobile) */}
      <div className="hidden md:block h-screen">
        <AuthCarousel />
      </div>
      
      {/* Right side - Multi-step Form */}
      <div className='flex items-center justify-center p-4 md:p-8 bg-[var(--color-background)] min-h-screen'>
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Logo (visible on mobile) */}
          <div className="md:hidden flex flex-col items-center mb-6">
            <img src={Img} alt="MyDewbox Logo" className="h-14 w-14 mb-2" />
            <h1 className="text-xl font-bold text-[var(--color-text-primary)]">MyDewbox</h1>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                      step < currentStep
                        ? 'bg-cyan-500 text-white'
                        : step === currentStep
                        ? 'bg-cyan-500 text-white ring-4 ring-cyan-100'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step < currentStep ? <Check size={16} /> : step}
                  </div>
                  {step < 5 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded transition-all ${
                        step < currentStep ? 'bg-cyan-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] text-center">
              Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}
            </p>
          </div>

          {/* Clean Card Container */}
          <Card variant="elevated" padding="lg" className="bg-[var(--color-surface-elevated)]">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1">Create Account</h2>
              <p className="text-[var(--color-text-secondary)] text-sm">{stepTitles[currentStep - 1]}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(currentStep === totalSteps ? onSubmit : handleNext)}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex gap-3 mt-6">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={handleBack}
                    icon={<ArrowLeft size={20} />}
                  >
                    Back
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth={currentStep === 1}
                  loading={isLoading && currentStep === totalSteps}
                  icon={currentStep < totalSteps ? <ArrowRight size={20} /> : null}
                >
                  {currentStep === totalSteps ? 'Create Account' : 'Continue'}
                </Button>
              </div>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-[var(--color-text-secondary)] text-sm">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/signin")}
                  className="text-cyan-600 hover:text-cyan-700 font-semibold"
                >
                  Sign in
                </button>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SubscribeTo;
