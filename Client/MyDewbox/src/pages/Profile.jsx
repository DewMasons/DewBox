import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSave, FaCalendarAlt } from "react-icons/fa";
import clsx from "clsx";
import { apiService } from "../services/api";

const schema = yup.object().shape({
  firstname: yup.string().required("First name is required"),
  surname: yup.string().required("Surname is required"),
  mobile: yup.string().required("Mobile is required"),
  address1: yup.string().required("Address is required"),
  country: yup.string().required("Country is required"),
  state: yup.string().required("State is required"),
  dob: yup.string().required("Date of birth is required"),
  alternatePhone: yup.string(),
  currency: yup.string(),
  referral: yup.string(),
  referralPhone: yup.string(),
  nextOfKinName: yup.string(),
  nextOfKinContact: yup.string(),
  city: yup.string(),
  gender: yup.string(),
});

const Profile = () => {
  // Fetch subscriber info
  const { data: subscriberData, isLoading, error, isFetching } = useQuery({
    queryKey: ['subscriber'],
    queryFn: () => apiService.getSubscriber(),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Debug logging
  useEffect(() => {
    console.log('=== PROFILE DEBUG INFO ===');
    console.log('subscriberData:', subscriberData);
    console.log('isLoading:', isLoading);
    console.log('isFetching:', isFetching);
    
    if (subscriberData) {
      console.log('subscriberData keys:', Object.keys(subscriberData));
      console.log('subscriberData.subscriber:', subscriberData.subscriber);
      
      if (subscriberData.subscriber) {
        console.log('subscriber keys:', Object.keys(subscriberData.subscriber));
      }
    }
    console.log('=== END DEBUG INFO ===');
  }, [subscriberData, isLoading, error]);

  // Memoize default values to prevent unnecessary re-renders
  const defaultValues = useMemo(() => {
    if (!subscriberData?.data?.subscriber || Object.keys(subscriberData.data.subscriber).length === 0) return {};
    
    const subscriber = subscriberData.data.subscriber;
    return {
      firstname: subscriber.firstname || '',
      surname: subscriber.surname || '',
      mobile: subscriber.mobile || '',
      address1: subscriber.address1 || '',
      country: subscriber.country || '',
      state: subscriber.state || '',
      dob: subscriber.dob || '',
      alternatePhone: subscriber.alternatePhone || '',
      currency: subscriber.currency || '',
      referral: subscriber.referral || '',
      referralPhone: subscriber.referralPhone || '',
      nextOfKinName: subscriber.nextOfKinName || '',
      nextOfKinContact: subscriber.nextOfKinContact || '',
      city: subscriber.city || '',
      gender: subscriber.gender || '',
    };
  }, [subscriberData]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  // Reset form when subscriber data changes
  useEffect(() => {
    const hasValidData = subscriberData?.data?.subscriber && Object.keys(subscriberData.data.subscriber).length > 0;
    if (hasValidData) {
      reset(defaultValues);
    }
  }, [subscriberData, defaultValues, reset]);

  const mutation = useMutation({
    mutationFn: (data) => apiService.updateProfile(data),
    onSuccess: () => {
      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          "Error updating profile";
      toast.error(errorMessage);
      console.error('Profile update error:', error);
    }
  });

  const onSubmit = (data) => {
    // Clean data before submission
    const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
      acc[key] = value || '';
      return acc;
    }, {});
    
    mutation.mutate(cleanData);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageDataUrl = event.target?.result;
      if (imageDataUrl) {
        setValue("profileImage", imageDataUrl);
        const imgElement = document.getElementById("profileImage");
        if (imgElement) {
          imgElement.src = imageDataUrl;
        }
      }
    };
    reader.onerror = () => {
      toast.error('Error reading image file');
    };
    reader.readAsDataURL(file);
  };

  // Define form fields array
  const formFields = [
    { name: 'firstname', icon: FaUser, label: 'First Name', required: true },
    { name: 'surname', icon: FaUser, label: 'Surname', required: true },
    { name: 'mobile', icon: FaPhone, label: 'Mobile', required: true },
    { name: 'address1', icon: FaMapMarkerAlt, label: 'Address', required: true },
    { name: 'country', icon: FaMapMarkerAlt, label: 'Country', required: true },
    { name: 'state', icon: FaMapMarkerAlt, label: 'State', required: true },
    { name: 'dob', icon: FaCalendarAlt, label: 'Date of Birth', required: true },
    { name: 'alternatePhone', icon: FaPhone, label: 'Alternate Phone', required: false },
    { name: 'currency', icon: FaUser, label: 'Currency', required: false },
    { name: 'referral', icon: FaUser, label: 'Referral Code', required: false },
    { name: 'referralPhone', icon: FaPhone, label: 'Referral Phone', required: false },
    { name: 'nextOfKinName', icon: FaUser, label: 'Next of Kin Name', required: false },
    { name: 'nextOfKinContact', icon: FaPhone, label: 'Next of Kin Contact', required: false },
    { name: 'city', icon: FaMapMarkerAlt, label: 'City', required: false },
    { name: 'gender', icon: FaUser, label: 'Gender', required: false }
  ];

  // Handle loading state - wait until we actually have valid subscriber data
  const hasValidSubscriberData = subscriberData?.data?.subscriber && Object.keys(subscriberData.data.subscriber).length > 0;
  
  if (isLoading || isFetching || !hasValidSubscriberData) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  // Handle error state
  if (error) {
    console.error('Profile query error:', error);
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <p className="text-red-600">Error loading profile data</p>
        <p className="text-sm text-gray-500">Check console for details</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Handle no data state - with more detailed logging
  if (!subscriberData?.data?.subscriber || Object.keys(subscriberData.data.subscriber).length === 0) {
    console.warn('No valid subscriber data found. subscriberData:', subscriberData);
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <p className="text-gray-600">No profile data found</p>
        <p className="text-sm text-gray-500">Check console for API response details</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>
    );
  }

  const subscriber = subscriberData.data.subscriber;

  return (
    <motion.section
      className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8 w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-gray-200/50 w-full">
        <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="absolute -bottom-16 w-full flex justify-center">
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white overflow-hidden bg-white">
              <img
                id="profileImage"
                src={subscriber.profileImage || "https://via.placeholder.com/128x128/e0e7ff/6366f1?text=User"}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/128x128/e0e7ff/6366f1?text=User";
                }}
              />
              <label
                htmlFor="profilePicUpload"
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
              >
                <input
                  type="file"
                  id="profilePicUpload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <FaUser className="text-white text-xl" />
              </label>
            </div>
          </div>
        </div>
        
        <div className="pt-20 px-4 md:px-8 pb-8 w-full">
          <h2 className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            My Profile
          </h2>
          <p className="text-center text-gray-600 mb-8 flex items-center justify-center gap-2 flex-wrap">
            <FaCalendarAlt />
            <span>
              Joined: {subscriber.createdAt
                ? new Date(subscriber.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                : 'N/A'}
            </span>
          </p>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {formFields.map(({ name, icon: Icon, label, required }) => (
                <div key={name} className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10">
                    <Icon className="w-4 h-4" />
                  </div>
                  <input
                    {...register(name)}
                    type={name === 'dob' ? 'date' : 'text'}
                    className={clsx(
                      "w-full text-gray-900 pl-10 pr-4 py-3 rounded-lg",
                      "bg-white/80 backdrop-blur-sm",
                      "border border-gray-200",
                      "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                      "outline-none transition-all duration-200",
                      "placeholder-gray-400",
                      errors[name] && "border-red-500 focus:ring-red-500"
                    )}
                    placeholder={`${label}${required ? ' *' : ''}`}
                  />
                  {errors[name] && (
                    <p className="mt-1 text-sm text-red-500">{errors[name].message}</p>
                  )}
                </div>
              ))}
            </div>
            
            <motion.button
              type="submit"
              disabled={mutation.isPending}
              className={clsx(
                "w-full px-6 py-3 rounded-lg",
                "bg-gradient-to-r from-blue-600 to-indigo-600",
                "text-white font-medium",
                "hover:from-blue-700 hover:to-indigo-700",
                "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                "transform transition-all duration-200",
                "flex items-center justify-center gap-2",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              whileHover={{ scale: mutation.isPending ? 1 : 1.02 }}
              whileTap={{ scale: mutation.isPending ? 1 : 0.98 }}
            >
              <FaSave className="w-4 h-4" />
              {mutation.isPending ? 'Saving...' : 'Save Changes'}
            </motion.button>
          </form>
        </div>
      </div>
    </motion.section>
  );
};

export default Profile;