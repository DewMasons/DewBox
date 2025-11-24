import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  User, Mail, Phone, MapPin, Save, Calendar, Upload, 
  Shield, Bell, Settings, LogOut, Moon, Sun, Lock, Smartphone 
} from "lucide-react";
import { apiService } from "../services/api";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Toggle from "../components/ui/Toggle";
import Skeleton, { SkeletonText } from "../components/ui/Skeleton";
import { useAuthStore } from "../store/authstore";
import { useThemeStore } from "../store/themeStore";
import { useSettingsStore } from "../store/settingsStore";

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
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { 
    twoFactorEnabled, 
    biometricEnabled, 
    sessionTimeout, 
    loginNotifications,
    emailNotifications,
    pushNotifications,
    smsNotifications,
    transactionAlerts,
    marketingEmails,
    securityAlerts,
    updateSetting 
  } = useSettingsStore();

  // Fetch subscriber info
  const { data: subscriberData, isLoading, error, isFetching } = useQuery({
    queryKey: ['subscriber'],
    queryFn: () => apiService.getSubscriber(),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Debug logging removed for production security

  // Memoize default values to prevent unnecessary re-renders
  const defaultValues = useMemo(() => {
    if (!subscriberData?.data?.subscriber || Object.keys(subscriberData.data.subscriber).length === 0) return {};
    
    const subscriber = subscriberData.data.subscriber;
    return {
      firstname: subscriber.firstname || '',
      surname: subscriber.surname || '',
      mobile: subscriber.mobile || '',
      email: subscriber.email || '',
      address1: subscriber.address1 || '',
      country: subscriber.country || '',
      state: subscriber.state || '',
      dob: subscriber.dob ? new Date(subscriber.dob).toISOString().split('T')[0] : '',
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
    onSuccess: (response) => {
      // Show success toast notification
      toast.success("Profile updated successfully!");
      
      // Reset form with updated data if available
      if (response?.data?.subscriber) {
        const updatedSubscriber = response.data.subscriber;
        reset({
          firstname: updatedSubscriber.firstname || '',
          surname: updatedSubscriber.surname || '',
          mobile: updatedSubscriber.mobile || '',
          address1: updatedSubscriber.address1 || '',
          country: updatedSubscriber.country || '',
          state: updatedSubscriber.state || '',
          dob: updatedSubscriber.dob ? new Date(updatedSubscriber.dob).toISOString().split('T')[0] : '',
          alternatePhone: updatedSubscriber.alternatePhone || '',
          currency: updatedSubscriber.currency || '',
          referral: updatedSubscriber.referral || '',
          referralPhone: updatedSubscriber.referralPhone || '',
          nextOfKinName: updatedSubscriber.nextOfKinName || '',
          nextOfKinContact: updatedSubscriber.nextOfKinContact || '',
          city: updatedSubscriber.city || '',
          gender: updatedSubscriber.gender || '',
          email: updatedSubscriber.email || '',
        });
      }
    },
    onError: (error) => {
      // Handle error states with error messages
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          "Error updating profile";
      toast.error(errorMessage);
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

  const handleSignOut = () => {
    // Clear auth token
    localStorage.removeItem('token');
    // Clear auth state
    logout();
    // Show success message
    toast.success('Signed out successfully');
    // Redirect to sign in page
    navigate('/signin');
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type (images only)
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Convert image to base64 for API submission
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageDataUrl = event.target?.result;
      if (imageDataUrl) {
        // Set form value for submission
        setValue("profileImage", imageDataUrl);
        
        // Update image preview
        const imgElement = document.getElementById("profileImage");
        if (imgElement) {
          imgElement.src = imageDataUrl;
        }
        
        // Show success message
        toast.success('Image uploaded successfully');
      }
    };
    reader.onerror = () => {
      // Display error messages for invalid files
      toast.error('Error reading image file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  // Define form fields organized by sections
  const formSections = [
    {
      title: 'Personal Information',
      fields: [
        { name: 'firstname', icon: <User size={20} />, label: 'First Name', type: 'text', required: true },
        { name: 'surname', icon: <User size={20} />, label: 'Surname', type: 'text', required: true },
        { name: 'gender', icon: <User size={20} />, label: 'Gender', type: 'text', required: false },
        { name: 'dob', icon: <Calendar size={20} />, label: 'Date of Birth', type: 'date', required: true },
      ]
    },
    {
      title: 'Contact Details',
      fields: [
        { name: 'mobile', icon: <Phone size={20} />, label: 'Mobile', type: 'text', required: true },
        { name: 'alternatePhone', icon: <Phone size={20} />, label: 'Alternate Phone', type: 'text', required: false },
        { name: 'email', icon: <Mail size={20} />, label: 'Email', type: 'email', required: false },
      ]
    },
    {
      title: 'Address',
      fields: [
        { name: 'address1', icon: <MapPin size={20} />, label: 'Address', type: 'text', required: true },
        { name: 'city', icon: <MapPin size={20} />, label: 'City', type: 'text', required: false },
        { name: 'state', icon: <MapPin size={20} />, label: 'State', type: 'text', required: true },
        { name: 'country', icon: <MapPin size={20} />, label: 'Country', type: 'text', required: true },
      ]
    },
    {
      title: 'Emergency Contact',
      fields: [
        { name: 'nextOfKinName', icon: <User size={20} />, label: 'Next of Kin Name', type: 'text', required: false },
        { name: 'nextOfKinContact', icon: <Phone size={20} />, label: 'Next of Kin Contact', type: 'text', required: false },
      ]
    },
    {
      title: 'Referral',
      fields: [
        { name: 'referral', icon: <User size={20} />, label: 'Referral Code', type: 'text', required: false },
        { name: 'referralPhone', icon: <Phone size={20} />, label: 'Referral Phone', type: 'text', required: false },
        { name: 'currency', icon: <User size={20} />, label: 'Currency', type: 'text', required: false },
      ]
    }
  ];

  // Profile skeleton loader component
  const ProfileSkeleton = () => (
    <motion.section
      className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card variant="elevated" padding="none" className="overflow-hidden">
        {/* Cover Section Skeleton */}
        <div className="relative h-32 bg-gray-200 animate-pulse">
          {/* Avatar Skeleton */}
          <div className="absolute -bottom-16 w-full flex justify-center">
            <Skeleton shape="circle" width="128px" height="128px" className="border-4 border-white" />
          </div>
        </div>
        
        {/* Profile Info Skeleton */}
        <div className="pt-20 px-6 pb-6">
          <div className="flex flex-col items-center mb-8">
            <Skeleton width="200px" height="32px" className="mb-2" />
            <Skeleton width="180px" height="20px" />
          </div>
          
          {/* Form Sections Skeleton */}
          <div className="space-y-8">
            {[1, 2, 3, 4, 5].map((section) => (
              <div key={section} className="space-y-4">
                <Skeleton width="180px" height="24px" className="mb-4" />
                <div className="space-y-4">
                  {[1, 2, 3].map((field) => (
                    <div key={field}>
                      <Skeleton width="100px" height="16px" className="mb-2" />
                      <Skeleton width="100%" height="48px" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Save Button Skeleton */}
            <Skeleton width="100%" height="52px" className="rounded-md" />
          </div>
          
          {/* Settings Sections Skeleton */}
          <div className="mt-12 space-y-8">
            {[1, 2, 3, 4].map((section) => (
              <div key={section} className="space-y-4">
                <Skeleton width="150px" height="24px" className="mb-4" />
                <div className="space-y-4">
                  {[1, 2].map((toggle) => (
                    <div key={toggle} className="flex items-center justify-between">
                      <div className="flex-1">
                        <Skeleton width="180px" height="16px" className="mb-1" />
                        <Skeleton width="250px" height="14px" />
                      </div>
                      <Skeleton width="48px" height="24px" className="rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </motion.section>
  );

  // Handle loading state - wait until we actually have valid subscriber data
  const hasValidSubscriberData = subscriberData?.data?.subscriber && Object.keys(subscriberData.data.subscriber).length > 0;
  
  if (isLoading || isFetching || !hasValidSubscriberData) {
    return <ProfileSkeleton />;
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <p className="text-red-600">Error loading profile data</p>
        <p className="text-sm text-gray-500">Please try again</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#0066FF] text-white rounded-lg hover:bg-[#0052CC]"
        >
          Retry
        </button>
      </div>
    );
  }

  // Handle no data state
  if (!subscriberData?.data?.subscriber || Object.keys(subscriberData.data.subscriber).length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <p className="text-gray-600">No profile data found</p>
        <p className="text-sm text-gray-500">Please try refreshing the page</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#0066FF] text-white rounded-lg hover:bg-[#0052CC]"
        >
          Refresh
        </button>
      </div>
    );
  }

  const subscriber = subscriberData.data.subscriber;

  return (
    <motion.section
      className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card variant="elevated" padding="none" className="overflow-hidden">
        {/* Cover Section - 128px height with solid color */}
        <div className="relative h-32 bg-[var(--color-primary)]">
          {/* Avatar - 128px circle overlapping cover with 4px white border */}
          <div className="absolute -bottom-16 w-full flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
                <img
                  id="profileImage"
                  src={subscriber.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(subscriber.firstname || 'User')}&background=6366f1&color=fff&size=128`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=User&background=6366f1&color=fff&size=128`;
                  }}
                />
              </div>
              {/* Upload overlay on hover */}
              <label
                htmlFor="profilePicUpload"
                className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
              >
                <input
                  type="file"
                  id="profilePicUpload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <Upload className="text-white" size={24} />
              </label>
            </div>
          </div>
        </div>
        
        {/* Profile Info Section */}
        <div className="pt-20 px-6 pb-6">
          {/* User name - 24px, bold, centered */}
          <h2 className="text-2xl font-bold text-center mb-2 text-[var(--color-text-primary)]">
            {subscriber.firstname} {subscriber.surname}
          </h2>
          
          {/* Join date with calendar icon - 14px, gray-600, centered */}
          <p className="text-sm text-[var(--color-text-secondary)] text-center mb-8 flex items-center justify-center gap-2">
            <Calendar size={16} />
            <span>
              Member since {subscriber.createdAt
                ? new Date(subscriber.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                : 'N/A'}
            </span>
          </p>
          
          {/* Profile Form with Sections */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Render each section with 32px vertical spacing */}
            {formSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-4">
                {/* Section Title */}
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2">
                  {section.title}
                </h3>
                
                {/* Section Fields - Single column stacked layout */}
                <div className="space-y-4">
                  {section.fields.map(({ name, icon, label, type, required }) => (
                    <Input
                      key={name}
                      label={label}
                      type={type}
                      icon={icon}
                      required={required}
                      error={errors[name]?.message}
                      placeholder={label}
                      {...register(name)}
                    />
                  ))}
                </div>
              </div>
            ))}
            
            {/* Save Button - Full width, gradient, with Save icon */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={mutation.isPending}
              loadingText="Saving..."
              icon={<Save size={20} />}
            >
              Save Changes
            </Button>
          </form>

          {/* Settings Sections */}
          <div className="mt-12 space-y-8">
            {/* Account Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-2">
                <Shield className="text-blue-600" size={20} />
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Account</h3>
              </div>
              <div className="space-y-4">
                <Toggle
                  checked={twoFactorEnabled}
                  onChange={(value) => updateSetting('twoFactorEnabled', value)}
                  label="Two-Factor Authentication"
                  description="Add an extra layer of security to your account"
                />
                <Toggle
                  checked={biometricEnabled}
                  onChange={(value) => updateSetting('biometricEnabled', value)}
                  label="Biometric Login"
                  description="Use fingerprint or face recognition to sign in"
                />
              </div>
            </div>

            {/* Security Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-2">
                <Lock className="text-blue-600" size={20} />
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Security</h3>
              </div>
              <div className="space-y-4">
                <Toggle
                  checked={sessionTimeout}
                  onChange={(value) => updateSetting('sessionTimeout', value)}
                  label="Auto Sign Out"
                  description="Automatically sign out after 30 minutes of inactivity"
                />
                <Toggle
                  checked={loginNotifications}
                  onChange={(value) => updateSetting('loginNotifications', value)}
                  label="Login Notifications"
                  description="Get notified when someone signs into your account"
                />
              </div>
            </div>

            {/* Preferences */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-2">
                <Settings className="text-blue-600" size={20} />
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Preferences</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-[var(--color-text-primary)] block">
                      Theme
                    </label>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                      Choose between light and dark mode
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-surface)] hover:bg-[var(--color-border)] transition-colors"
                  >
                    {theme === 'light' ? (
                      <>
                        <Moon size={18} className="text-[var(--color-text-primary)]" />
                        <span className="text-sm font-medium text-[var(--color-text-primary)]">Dark</span>
                      </>
                    ) : (
                      <>
                        <Sun size={18} className="text-[var(--color-text-primary)]" />
                        <span className="text-sm font-medium text-[var(--color-text-primary)]">Light</span>
                      </>
                    )}
                  </button>
                </div>
                <Toggle
                  checked={emailNotifications}
                  onChange={(value) => updateSetting('emailNotifications', value)}
                  label="Email Notifications"
                  description="Receive updates and alerts via email"
                />
                <Toggle
                  checked={pushNotifications}
                  onChange={(value) => updateSetting('pushNotifications', value)}
                  label="Push Notifications"
                  description="Get real-time notifications on your device"
                />
                <Toggle
                  checked={smsNotifications}
                  onChange={(value) => updateSetting('smsNotifications', value)}
                  label="SMS Notifications"
                  description="Receive important alerts via text message"
                />
              </div>
            </div>

            {/* Notifications */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-2">
                <Bell className="text-blue-600" size={20} />
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Notifications</h3>
              </div>
              <div className="space-y-4">
                <Toggle
                  checked={transactionAlerts}
                  onChange={(value) => updateSetting('transactionAlerts', value)}
                  label="Transaction Alerts"
                  description="Get notified about all account transactions"
                />
                <Toggle
                  checked={securityAlerts}
                  onChange={(value) => updateSetting('securityAlerts', value)}
                  label="Security Alerts"
                  description="Receive alerts about security-related activities"
                />
                <Toggle
                  checked={marketingEmails}
                  onChange={(value) => updateSetting('marketingEmails', value)}
                  label="Marketing Emails"
                  description="Receive promotional offers and updates"
                />
              </div>
            </div>

            {/* Sign Out Button */}
            <div className="pt-4 border-t border-[var(--color-border)]">
              <Button
                variant="danger"
                size="lg"
                fullWidth
                icon={<LogOut size={20} />}
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.section>
  );
};

export default Profile;