import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye, FaEyeSlash, FaCheckCircle, FaArrowLeft, FaPhoneAlt, FaUser } from "react-icons/fa";
import clsx from "clsx";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import AuthCarousel from "../components/AuthCarousel";
import { userStore } from "../store/authstore";
import ErrorBoundary from "../components/ErrorBoundary";
import { API_CONFIG } from "../config/api.config";
import { useAuthStore } from '../store/authstore';
import { register, checkAuth } from '../services/api';

const countryApiUrl = "https://api.countrystatecity.in/v1/countries";
const cscApiKey = "UzVTb3R3ZmlNUmdjcXU0UUg0T0Rvd2tKSXdIQjZoaG1uelo4VTh6NQ==";
const currencyApiUrl = "https://v6.exchangerate-api.com/v6/2708fb8247ae950fce0062b6/latest/NGN";
const phoneRegex = /^(?:\+?[1-9]{1,3} ?[0-9]{10}|0[1-9]{10})$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const phoneVerificationSchema = yup.object().shape({
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(phoneRegex, "Invalid phone number format"),
  otp: yup.string().when("showOtp", {
    is: true,
    then: () =>
      yup
        .string()
        .required("OTP is required")
        .matches(/^\d{6}$/, "OTP must be 6 digits"),
  }),
});

const registrationSchema = yup.object().shape({
  email: yup.string().optional().matches(emailRegex, "Invalid email format"),
  firstname: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  surname: yup
    .string()
    .required("Surname is required")
    .min(2, "Surname must be at least 2 characters"),
  othername: yup
    .string()
    .optional()
    .min(2, "Name must be at least 2 characters"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
  address1: yup
    .string()
    .required("Address Line 1 is required")
    .min(5, "Address must be at least 5 characters"),
  city: yup.string().required("City is required"),
  gender: yup.string().required("Gender is required"),
  country: yup.string().required("Country is required"),
  state: yup.string().required("State/Region is required"),
  dob: yup
    .date()
    .required("Date of Birth is required")
    .max(new Date(), "Date of Birth cannot be in the future")
    .test("age", "You must be at least 18 years old", (value) => {
      if (!value) return false;
      const today = new Date();
      const birthDate = new Date(value);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      return age >= 18;
    }),
  mobile: yup
    .string()
    .required("Mobile number is required")
    .matches(phoneRegex, "Invalid mobile number format"),
  alternatePhone: yup
    .string()
    .optional()
    .matches(phoneRegex, "Invalid phone number format"),
  currency: yup.string().required("Currency is required"),
  referral: yup.string().optional(),
  referralPhone: yup
    .string()
    .optional()
    .matches(phoneRegex, "Invalid phone number format"),
  nextOfKinName: yup
    .string()
    .required("Next of Kin Name is required")
    .min(2, "Name must be at least 2 characters"),
  nextOfKinContact: yup
    .string()
    .required("Next of Kin Contact is required")
    .matches(phoneRegex, "Invalid contact number format"),
  joinEsusu: yup
    .string()
    .required("Please select an Esusu preference")
    .oneOf(["yes", "no"], "Invalid selection"),
});

const formatPhoneNumber = (phone) => {
  if (!phone) return "";

  // Remove all non-digit characters except +
  let cleaned = phone.toString().replace(/[^\d+]/g, "");

  // Ensure it starts with +
  if (!cleaned.startsWith("+")) {
    cleaned = "+" + cleaned;
  }

  // Validate E.164 format
  if (!/^\+[1-9]\d{1,14}$/.test(cleaned)) {
    throw new Error(
      "Invalid phone number format. Must be in E.164 format (e.g., +1234567890)"
    );
  }

  return cleaned;
};

const SubscribeTo = () => {
  const navigate = useNavigate();
  const {
    phone,
    isVerified,
    setPhone,
    setIsVerified,
    setOtp,
    validateOtp,
  } = userStore();
  
  // State for form data
  const [userFormData, setUserFormData] = useState({});
  
  // State for phone verification
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(phone || "");
  const [verificationId, setVerificationId] = useState(null);
  const [isLoadingSend, setIsLoadingSend] = useState(false);
  const [isLoadingVerify, setIsLoadingVerify] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  
  // States for registration form
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  
  // States for fallback OTP
  const [fallbackOtpMode, setFallbackOtpMode] = useState(false);
  const [fallbackOtp, setFallbackOtp] = useState("");
  const [otpMatchError, setOtpMatchError] = useState(false);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [formAnimationKey, setFormAnimationKey] = useState(0);

  // Generate a random 6-digit OTP
  const generateFallbackOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  
  // Phone verification form
  const {
    register: registerPhone,
    handleSubmit: handleSubmitPhone,
    formState: { errors: phoneErrors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(phoneVerificationSchema),
    defaultValues: {
      phone: phone || "",
      showOtp: false,
    },
  });
  
  // Handle phone submission and OTP
  const onPhoneSubmit = async (phoneData) => {
    setIsLoadingSend(true);
    try {
      const phoneNumber = formatPhoneNumber(phoneData.phone);
      console.log("Formatted phone:", phoneNumber);
      
      // Store phone number in state and context
      setPhoneNumber(phoneNumber);
      setPhone(phoneNumber);

      const otpData = {
        recipients: phoneNumber,
        otp_type: 'NUMERIC',
        otp_length: '6',
        otp_duration: '10',
        otp_attempts: '3',
        channel: 'sms',
        appnamecode: '6264483761',
        templatecode: '4674358581'
      };

      try {
        // Try using the real API first
        const response = await axios.post(`${API_CONFIG.API_BASE_URL}/sms/sendotp`, otpData);

        if (response.data.error_code === '000') {
          setVerificationId(response.data.verification_id);
          setShowOtpInput(true);
          toast.success("Verification code sent successfully");
          setFallbackOtpMode(false);
          return;
        } else {
          throw new Error(response.data.msg || "Failed to send verification code");
        }
      } catch (error) {
        console.error("Failed to send verification code:", error);
        
        // Fallback to local OTP generation
        const generatedOtp = generateFallbackOtp();
        setFallbackOtp(generatedOtp);
        setFallbackOtpMode(true);
        setShowOtpInput(true);
        toast.warning("Using local verification due to API error. Check the code below.");
        
        return;
      }
    } catch (error) {
      console.error("Verification failed:", error);
      toast.error(error.message || "An error occurred during verification");
    } finally {
      setIsLoadingSend(false);
    }
  };
  
  const onVerifyOtp = async (otp) => {
    setIsLoadingVerify(true);
    
    // If in fallback mode, compare with locally generated OTP
    if (fallbackOtpMode) {
      if (otp === fallbackOtp) {
        setOtpMatchError(false);
        setIsVerified(true);
        toast.success("Phone number verified successfully");
        setShowRegistrationForm(true);
        // Trigger animation
        setFormAnimationKey(prev => prev + 1);
      } else {
        setOtpMatchError(true);
        setOtpAttempts(otpAttempts + 1);
        toast.error("No match! Please try again.");
      }
      setIsLoadingVerify(false);
      return;
    }
    
    // Regular API verification flow
    try {
      const verifyData = {
        verification_id: verificationId,
        otp: otp
      };

      const response = await axios.post(`${API_CONFIG.API_BASE_URL}/sms/verifyotp`, verifyData);

      if (response.data.error_code === '000') {
        setIsVerified(true);
        toast.success("Phone number verified successfully");
        setShowRegistrationForm(true);
        // Trigger animation
        setFormAnimationKey(prev => prev + 1);
      } else {
        throw new Error(response.data.msg || "Invalid verification code");
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      toast.error(error.response?.data?.message || "Invalid verification code");
    } finally {
      setIsLoadingVerify(false);
    }
  };
  
  // Handle phone input change with fix for duplicate "+" signs
  const handlePhoneChange = (value, country) => {
    const formattedValue = value.startsWith("+") ? value : `+${value}`;
    setPhoneNumber(formattedValue);
    setValue("phone", formattedValue, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };
  
  // Fetch countries for the dropdown
  const { data: countries, isLoading: isLoadingCountries } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      try {
        const res = await axios.get(countryApiUrl, {
          headers: { "X-CSCAPI-KEY": cscApiKey },
        });
        return Array.isArray(res.data) ? res.data : [];
      } catch (error) {
        console.error("Error fetching countries:", error);
        toast.error("Could not load countries. Please try again later.");
        return [];
      }
    },
    retry: 3,
  });
  
  // Registration form
  const {
    register: registerReg,
    handleSubmit: handleSubmitReg,
    formState: { errors: regErrors },
    setValue: setValueReg,
    watch: watchReg,
    reset: resetReg,
  } = useForm({
    resolver: yupResolver(registrationSchema),
    defaultValues: {
      ...userFormData,
      joinEsusu: "no",
      mobile: phoneNumber, // Set the verified phone number
    },
  });

  const countryValue = watchReg("country");
  
  // Fetch states for the selected country
  const { data: states, refetch: fetchStates, isLoading: isLoadingStates } = useQuery({
    queryKey: ["states", countryValue],
    queryFn: async () => {
      if (!countryValue) return [];
      try {
        const url = `${countryApiUrl}/${countryValue}/states`;
        const res = await axios.get(url, {
          headers: { "X-CSCAPI-KEY": cscApiKey },
        });
        return res.data;
      } catch (error) {
        console.error("Error fetching states:", error);
        toast.error("Could not load states. Please try again later.");
        return [];
      }
    },
    enabled: !!countryValue,
    retry: 3,
  });
  
  useEffect(() => {
    if (countryValue) fetchStates();
  }, [countryValue, fetchStates]);
  
  // Load currencies from API
  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        const response = await axios.get(currencyApiUrl);
        if (response.data && response.data.conversion_rates) {
          setCurrencies(Object.keys(response.data.conversion_rates));
        } else {
          throw new Error("Invalid currency data format");
        }
      } catch (error) {
        console.error("Error fetching currency list:", error);
        // Fallback to common currencies
        setCurrencies(["USD", "EUR", "GBP", "NGN", "CAD", "AUD", "INR"]);
        toast.warning("Using limited currency list due to API issue");
      }
    };
    loadCurrencies();
  }, []);
  
  // Ensure the verified phone number is set in the registration form
  useEffect(() => {
    if (isVerified && phoneNumber) {
      setValueReg("mobile", phoneNumber, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [isVerified, phoneNumber, setValueReg]);
  
  const { login } = useAuthStore();

  // Handler for registration form submission
  const onRegistrationSubmit = async (data) => {
    setLoadingSubmit(true);
    try {
      const submissionData = { 
        ...data, 
        phone: phoneNumber // Ensure the verified phone is included
      };
      setUserFormData(submissionData);
      
      // Use your actual backend API endpoint
      const response = await axios.post(
        `${API_CONFIG.API_BASE_URL}/auth/register`,
        submissionData
      );
      
      if (response.status === 200 || response.status === 201) {
        // Store token if provided
        if (response.data.access_token) {
          localStorage.setItem('access_token', response.data.access_token);
        }
        // Update auth state
        login(response.data.user);
        toast.success("Registration successful!");
        navigate("/firstcontribute"); // Only SubscribeTo navigates to FirstContribute
      } else {
        throw new Error(response.data?.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "An error occurred during registration. Please try again.");
    } finally {
      setLoadingSubmit(false);
    }
  };
  
  // Back button to return to the phone verification form
  const handleBackToVerification = () => {
    setIsVerified(false);
    setShowOtpInput(false);
    setFallbackOtpMode(false);
    setFallbackOtp("");
    setOtpMatchError(false);
    setOtpAttempts(0);
    setShowRegistrationForm(false);
    // Keep phoneNumber so user doesn't have to enter it again
  };

  // Resend OTP functionality
  const handleResendOtp = () => {
    if (fallbackOtpMode) {
      const newOtp = generateFallbackOtp();
      setFallbackOtp(newOtp);
      toast.info("New verification code generated");
    } else {
      // Reset the form and resubmit
      const currentPhone = watch("phone");
      onPhoneSubmit({ phone: currentPhone });
    }
  };

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: "easeOut",
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      transition: { duration: 0.3 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };
  
  return (
    <div className="h-screen grid md:grid-cols-2 grid-cols-1 bg-gray-50">
      <div className="hidden md:block">
        <AuthCarousel />
      </div>
      <div className="flex items-center justify-center p-4 md:p-8 bg-gray-50">
        <motion.div
          className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-h-screen overflow-y-auto max-w-md relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl text-black font-bold mb-2">
              Subscribe to MyDewbox
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Please complete the steps below to subscribe.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!isVerified ? (
              <motion.div
                key="phone-verification"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={formVariants}
              >
                <ErrorBoundary>
                  <form
                    onSubmit={handleSubmitPhone(onPhoneSubmit)}
                    className="space-y-6"
                  >
                    <motion.div variants={itemVariants} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <PhoneInput
                          country={"ng"}
                          value={phoneNumber}
                          onChange={handlePhoneChange}
                          containerClass="w-full"
                          inputClass={clsx(
                            "w-full p-4 border rounded-md text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                            phoneErrors.phone && "border-red-500 focus:ring-red-500 focus:border-red-500"
                          )}
                          disabled={showOtpInput}
                          enableSearch={true}
                          searchPlaceholder="Search countries"
                          buttonClass="border-r-0"
                        />
                        {phoneErrors.phone && (
                          <p className="text-red-500 text-sm mt-1">
                            {phoneErrors.phone.message}
                          </p>
                        )}
                      </div>
                    </motion.div>
                    
                    {!showOtpInput ? (
                      <motion.button
                        variants={itemVariants}
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-200 flex items-center justify-center"
                        disabled={isLoadingSend}
                      >
                        {isLoadingSend ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>
                            <FaPhoneAlt className="mr-2" />
                            Send Verification Code
                          </>
                        )}
                      </motion.button>
                    ) : (
                      <motion.div
                        variants={itemVariants}
                        className="space-y-6"
                      >
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Verification Code
                          </label>
                          <input
                            type="text"
                            placeholder="Enter 6-digit code"
                            className={clsx(
                              "w-full p-4 border rounded-md text-lg tracking-wider text-center font-mono",
                              (phoneErrors.otp || otpMatchError) ? "border-red-500" : "border-gray-300"
                            )}
                            maxLength={6}
                            onChange={(e) => {
                              setOtpValue(e.target.value);
                              setOtpMatchError(false);
                            }}
                          />
                          {phoneErrors.otp && (
                            <p className="text-red-500 text-sm mt-1">
                              {phoneErrors.otp.message}
                            </p>
                          )}
                          {otpMatchError && (
                            <p className="text-red-500 text-sm mt-1">
                              No match! Please try again. Attempt {otpAttempts} of 3
                            </p>
                          )}
                        </div>
                        
                        <div className="flex gap-3">
                          <button
                            type="button"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-200 flex items-center justify-center"
                            onClick={() => onVerifyOtp(otpValue)}
                            disabled={isLoadingVerify}
                          >
                            {isLoadingVerify ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Verifying...
                              </>
                            ) : (
                              <>
                                <FaCheckCircle className="mr-2" />
                                Verify Code
                              </>
                            )}
                          </button>
                          
                          <button
                            type="button"
                            className="flex-none bg-white hover:bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-md border border-gray-300 transition duration-200"
                            onClick={handleResendOtp}
                            disabled={isLoadingSend}
                          >
                            {isLoadingSend ? "Sending..." : "Resend"}
                          </button>
                        </div>
                        
                        {fallbackOtpMode && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-4 p-4 border border-blue-300 bg-blue-50 rounded-lg"
                          >
                            <p className="text-blue-800 font-medium mb-2">
                              ⚠️ API Verification Unavailable
                            </p>
                            <p className="text-sm text-blue-700 mb-2">
                              For demonstration purposes, please use this code:
                            </p>
                            <div className="bg-white p-3 text-center rounded border border-blue-200">
                              <code className="text-xl font-mono font-bold tracking-widest text-blue-800">
                                {fallbackOtp}
                              </code>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </form>
                </ErrorBoundary>
              </motion.div>
            ) : (
              <motion.div
                key={`registration-form-${formAnimationKey}`}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={formVariants}
                className="relative"
              >
                <button
                  onClick={handleBackToVerification}
                  className="absolute left-0 top-0 text-gray-700 hover:text-gray-900 p-2 flex items-center text-sm"
                >
                  <FaArrowLeft className="mr-1" /> Back
                </button>
                
                <div className="mt-12">
                  <form
                    onSubmit={handleSubmitReg(onRegistrationSubmit)}
                    className="space-y-6"
                  >
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center">
                      <FaCheckCircle className="text-green-500 mr-3 text-lg" />
                      <div>
                        <p className="font-medium text-green-800">Phone Verified</p>
                        <p className="text-sm text-green-700">{phoneNumber}</p>
                      </div>
                    </div>

                    <motion.div variants={itemVariants} className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        {...registerReg("email")}
                        className={clsx(
                          "input input-bordered w-full p-3 rounded-md",
                          regErrors.email && "border-red-500"
                        )}
                      />
                      {regErrors.email && (
                        <span className="text-red-500 text-sm">
                          {regErrors.email.message}
                        </span>
                      )}
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div variants={itemVariants} className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...registerReg("password")}
                            className={clsx(
                              "input input-bordered w-full pr-10 p-3 rounded-md",
                              regErrors.password && "border-red-500"
                            )}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                        {regErrors.password && (
                          <span className="text-red-500 text-sm">
                            {regErrors.password.message}
                          </span>
                        )}
                      </motion.div>

                      <motion.div variants={itemVariants} className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...registerReg("confirmPassword")}
                            className={clsx(
                              "input input-bordered w-full pr-10 p-3 rounded-md",
                              regErrors.confirmPassword && "border-red-500"
                            )}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                        {regErrors.confirmPassword && (
                          <span className="text-red-500 text-sm">
                            {regErrors.confirmPassword.message}
                          </span>
                        )}
                      </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold text-gray-700">
                            First Name
                          </span>
                        </label>
                        <input
                          type="text"
                          {...registerReg("firstname")}
                          className={clsx(
                            "input input-bordered w-full",
                            regErrors.firstname && "border-red-500"
                          )}
                        />
                        {regErrors.firstname && (
                          <span className="text-red-500 text-sm mt-1">
                            {regErrors.firstname.message}
                          </span>
                        )}
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold text-gray-700">
                            Surname
                          </span>
                        </label>
                        <input
                          type="text"
                          {...registerReg("surname")}
                          className={clsx(
                            "input input-bordered w-full",
                            regErrors.surname && "border-red-500"
                          )}
                        />
                        {regErrors.surname && (
                          <span className="text-red-500 text-sm mt-1">
                            {regErrors.surname.message}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-gray-700">
                          Other Name
                        </span>
                      </label>
                      <input
                        type="text"
                        {...registerReg("othername")}
                        className={clsx(
                          "input input-bordered w-full",
                          regErrors.othername && "border-red-500"
                        )}
                      />
                      {regErrors.othername && (
                        <span className="text-red-500 text-sm mt-1">
                          {regErrors.othername.message}
                        </span>
                      )}
                    </div>
                    
                    {/* Replace mobile number input with PhoneInput */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-gray-700">
                          Mobile Number
                        </span>
                      </label>
                      <PhoneInput
                        country={"ng"}
                        value={watchReg("mobile") || phoneNumber}
                        onChange={(value) => {
                          const formattedValue = value.startsWith("+")
                            ? value
                            : `+${value}`;
                          setValueReg("mobile", formattedValue, {
                            shouldValidate: true,
                            shouldDirty: true,
                            shouldTouch: true,
                          });
                        }}
                        containerClass="w-full"
                        inputClass={clsx(
                          "w-full p-4 text-black border rounded-md",
                          regErrors.mobile && "border-red-500"
                        )}
                        enableSearch={true}
                        searchPlaceholder="Search countries"
                      />
                      {regErrors.mobile && (
                        <p className="text-red-500 text-sm mt-1">
                          {regErrors.mobile.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-gray-700">
                          Alternate Phone Number
                        </span>
                      </label>
                      <input
                        type="text"
                        placeholder="Alternate Phone Number"
                        {...registerReg("alternatePhone")}
                        className={clsx(
                          "input input-bordered w-full",
                          regErrors.alternatePhone && "border-red-500"
                        )}
                      />
                      {regErrors.alternatePhone && (
                        <p className="text-red-500 text-sm">
                          {regErrors.alternatePhone.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-gray-700">
                          Address
                        </span>
                      </label>
                      <input
                        type="text"
                        {...registerReg("address1")}
                        className={clsx(
                          "input input-bordered w-full",
                          regErrors.address1 && "border-red-500"
                        )}
                      />
                      {regErrors.address1 && (
                        <span className="text-red-500 text-sm mt-1">
                          {regErrors.address1.message}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold text-gray-700">
                            City
                          </span>
                        </label>
                        <input
                          type="text"
                          {...registerReg("city")}
                          className={clsx(
                            "input input-bordered w-full",
                            regErrors.city && "border-red-500"
                          )}
                        />
                        {regErrors.city && (
                          <span className="text-red-500 text-sm mt-1">
                            {regErrors.city.message}
                          </span>
                        )}
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold text-gray-700">
                            Gender
                          </span>
                        </label>
                        <select
                          {...registerReg("gender")}
                          className={clsx(
                            "select select-bordered w-full",
                            regErrors.gender && "border-red-500"
                          )}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                        {regErrors.gender && (
                          <span className="text-red-500 text-sm mt-1">
                            {regErrors.gender.message}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-gray-700">
                          Country
                        </span>
                      </label>
                      <select
                        {...registerReg("country")}
                        className={clsx(
                          "select select-bordered w-full",
                          regErrors.country && "border-red-500"
                        )}
                      >
                        <option value="">Select Country</option>
                        {countries?.map((country) => (
                          <option key={country.iso2} value={country.iso2|| "Nigeria"}>
                            {country.name || "Nigeria"}
                          </option>
                        ))}
                      </select>
                      {regErrors.country && (
                        <span className="text-red-500 text-sm mt-1">
                          {regErrors.country.message}
                        </span>
                      )}
                    </div>
                    
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-gray-700">
                          State/Region
                        </span>
                      </label>
                      <select
                        {...registerReg("state")}
                        className={clsx(
                          "select select-bordered w-full",
                          regErrors.state && "border-red-500"
                        )}
                      >
                        <option value="">Select State/Region</option>
                        {states?.map((state) => (
                          <option key={state.iso2} value={state.iso2||"Lagos"}>
                            {state.name|| "Lagos"}
                          </option>
                        ))}
                      </select>
                      {regErrors.state && (
                        <span className="text-red-500 text-sm mt-1">
                          {regErrors.state.message}
                        </span>
                      )}  
                    </div>
                    
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-gray-700">
                          Date of Birth
                        </span>
                      </label>
                      <input
                        type="date"
                        {...registerReg("dob")}
                        className={clsx(
                          "input input-bordered w-full",
                          regErrors.dob && "border-red-500"
                        )}
                      />
                      {regErrors.dob && (
                        <p className="text-red-500 text-sm mt-1">
                          {regErrors.dob.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-gray-700">
                          Join An Esusu?
                        </span>
                      </label>
                      <select
                        {...registerReg("joinEsusu")}
                        className={clsx(
                          "select select-bordered w-full",
                          regErrors.joinEsusu && "border-red-500"
                        )}
                      >
                        <option value="">Select Option</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                      {regErrors.joinEsusu && (
                        <p className="text-red-500 text-sm mt-1">
                          {regErrors.joinEsusu.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-gray-700">
                          Referral Name
                        </span>
                      </label>
                      <input
                        type="text"
                        {...registerReg("referral")}
                        className={clsx(
                          "input input-bordered w-full",
                          regErrors.referral && "border-red-500"
                        )}
                      />
                      {regErrors.referral && (
                        <p className="text-red-500 text-sm mt-1">
                          {regErrors.referral.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-gray-700">
                          Referral Phone Number
                        </span>
                      </label>
                      <input
                        type="text"
                        {...registerReg("referralPhone")}
                        className={clsx(
                          "input input-bordered w-full",
                          regErrors.referralPhone && "border-red-500"
                        )}
                      />
                      {regErrors.referralPhone && (
                        <p className="text-red-500 text-sm mt-1">
                          {regErrors.referralPhone.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-gray-700">
                          Next of Kin Name
                        </span>
                      </label>
                      <input
                        type="text"
                        {...registerReg("nextOfKinName")}
                        className={clsx(
                          "input input-bordered w-full",
                          regErrors.nextOfKinName && "border-red-500"
                        )}
                      />
                      {regErrors.nextOfKinName && (
                        <p className="text-red-500 text-sm mt-1">
                          {regErrors.nextOfKinName.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-gray-700">
                          Next of Kin Contact
                        </span>
                      </label>
                      <input
                        type="text"
                        {...registerReg("nextOfKinContact")}
                        className={clsx(
                          "input input-bordered w-full",
                          regErrors.nextOfKinContact && "border-red-500"
                        )}
                      />
                      {regErrors.nextOfKinContact && (
                        <p className="text-red-500 text-sm mt-1">
                          {regErrors.nextOfKinContact.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-gray-700">
                          Currency
                        </span>
                      </label>
                      <select
                        {...registerReg("currency")}
                        className={clsx(
                          "select select-bordered w-full",
                          regErrors.currency && "border-red-500"
                        )}
                      >
                        <option value="">Select Currency</option>
                        {currencies.map((currency) => (
                          <option key={currency} value={currency}>
                            {currency}
                          </option>
                        ))}
                      </select>
                      {regErrors.currency && (
                        <p className="text-red-500 text-sm mt-1">
                          {regErrors.currency.message}
                        </p>
                      )}
                    </div>
                    
                    <button
                      type="submit"
                      className="btn bg-gray-900 btn-primary w-full"
                      disabled={loadingSubmit}
                    >
                      {loadingSubmit ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        "Subscribe to MyDewbox"
                      )}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default SubscribeTo;