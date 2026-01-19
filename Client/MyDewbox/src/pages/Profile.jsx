import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  User, Mail, Phone, MapPin, Save, Calendar, Upload, 
  Shield, Bell, Settings, LogOut, Moon, Sun, Lock
} from "lucide-react";
import { apiService } from "../services/api";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Toggle from "../components/ui/Toggle";
import Skeleton from "../components/ui/Skeleton";
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
      className="max-w-4xl mx-auto p-4 sm:p-6 w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
    >
      {/* Header Card Skeleton */}
      <Card variant="elevated" padding="none" className="overflow-hidden mb-6">
        <div className="relative h-24 bg-[var(--color-surface-elevated)] animate-pulse">
          <div className="absolute -bottom-12 left-6">
            <Skeleton shape="square" width="96px" height="96px" className="border-4 border-[var(--color-surface)] rounded-lg" />
          </div>
        </div>
        <div className="pt-16 px-6 pb-6">
          <Skeleton width="200px" height="32px" className="mb-1" />
          <Skeleton width="180px" height="20px" />
        </div>
      </Card>
      
      {/* Form Card Skeleton */}
      <Card variant="elevated" padding="lg" className="mb-6">
        <div className="space-y-6">
          {[1, 2, 3].map((section) => (
            <div key={section} className="space-y-4">
              <Skeleton width="150px" height="20px" className="mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((field) => (
                  <div key={field}>
                    <Skeleton width="100px" height="16px" className="mb-2" />
                    <Skeleton width="100%" height="48px" />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <Skeleton width="100%" height="52px" className="rounded-lg" />
        </div>
      </Card>
      
      {/* Settings Cards Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map((card) => (
          <Card key={card} variant="elevated" padding="lg">
            <div className="flex items-center gap-2 mb-4">
              <Skeleton shape="square" width="32px" height="32px" className="rounded-lg" />
              <Skeleton width="150px" height="20px" />
            </div>
            <div className="space-y-4">
              {[1, 2].map((toggle) => (
                <div key={toggle} className="flex items-center justify-between">
                  <div className="flex-1">
                    <Skeleton width="180px" height="16px" className="mb-1" />
                    <Skeleton width="250px" height="14px" />
                  </div>
                  <Skeleton width="44px" height="24px" className="rounded-full" />
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
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
        <p className="text-sm text-[var(--color-text-secondary)]">Please try again</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-all duration-150 shadow-sm"
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
        <p className="text-[var(--color-text-secondary)]">No profile data found</p>
        <p className="text-sm text-[var(--color-text-tertiary)]">Please try refreshing the page</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-all duration-150 shadow-sm"
        >
          Refresh
        </button>
      </div>
    );
  }

  const subscriber = subscriberData.data.subscriber;

  return (
    <motion.section
      className="max-w-4xl mx-auto p-4 sm:p-6 w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
    >
      {/* Profile Header Card - Clean & Professional */}
      <Card variant="elevated" padding="none" className="overflow-hidden mb-6">
        {/* Cover Section - Clean solid color, 96px height */}
        <div className="relative h-24 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)]">
          {/* Avatar - 96px circle with clean border */}
          <div className="absolute -bottom-12 left-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-lg border-4 border-[var(--color-surface)] overflow-hidden bg-[var(--color-surface)] shadow-md">
                <img
                  id="profileImage"
                  src={subscriber.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(subscriber.firstname || 'User')}&background=0077B6&color=fff&size=96`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=User&background=0077B6&color=fff&size=96`;
                  }}
                />
              </div>
              {/* Upload overlay - clean hover state */}
              <label
                htmlFor="profilePicUpload"
                className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-150 cursor-pointer"
              >
                <input
                  type="file"
                  id="profilePicUpload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <Upload className="text-white" size={20} />
              </label>
            </div>
          </div>
        </div>
        
        {/* Profile Info Section - Clean layout */}
        <div className="pt-16 px-6 pb-6">
          {/* User name and join date - left aligned, professional */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1">
              {subscriber.firstname} {subscriber.surname}
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] flex items-center gap-1.5">
              <Calendar size={14} />
              <span>
                Member since {subscriber.createdAt
                  ? new Date(subscriber.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long'
                    })
                  : 'N/A'}
              </span>
            </p>
          </div>
        </div>
      </Card>

      {/* Profile Form Card - Clean & Organized */}
      <Card variant="elevated" padding="lg" className="mb-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Render each section with clean spacing */}
          {formSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-4">
              {/* Section Title - Professional with subtle border */}
              <h2 className="text-base font-semibold text-[var(--color-text-primary)] pb-2 border-b border-[var(--color-border)]">
                {section.title}
              </h2>
              
              {/* Section Fields - Grid layout for better organization */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          
          {/* Save Button - Professional styling */}
          <div className="pt-2">
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
          </div>
        </form>
      </Card>

      {/* Settings Cards - Organized into separate cards */}
      <div className="space-y-4">
        {/* Account Security Card */}
        <Card variant="elevated" padding="lg">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
              <Shield className="text-[var(--color-primary)]" size={18} />
            </div>
            <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Account Security</h2>
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
        </Card>

        {/* Preferences Card */}
        <Card variant="elevated" padding="lg">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
              <Settings className="text-[var(--color-primary)]" size={18} />
            </div>
            <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Preferences</h2>
          </div>
          <div className="space-y-4">
            {/* Theme Toggle - Clean button design */}
            <div className="flex items-center justify-between py-2">
              <div className="flex-1">
                <label className="text-sm font-medium text-[var(--color-text-primary)] block">
                  Theme
                </label>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                  Choose between light and dark mode
                </p>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-all duration-150"
              >
                {theme === 'light' ? (
                  <>
                    <Moon size={16} className="text-[var(--color-text-primary)]" />
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">Dark</span>
                  </>
                ) : (
                  <>
                    <Sun size={16} className="text-[var(--color-text-primary)]" />
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">Light</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </Card>

        {/* Notifications Card */}
        <Card variant="elevated" padding="lg">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
              <Bell className="text-[var(--color-primary)]" size={18} />
            </div>
            <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Notifications</h2>
          </div>
          <div className="space-y-4">
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
        </Card>

        {/* Sign Out Card */}
        <Card variant="elevated" padding="lg">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
              <Lock className="text-red-600" size={18} />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-semibold text-[var(--color-text-primary)]">Sign Out</h2>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                Sign out from your account on this device
              </p>
            </div>
          </div>
          <Button
            variant="danger"
            size="md"
            fullWidth
            icon={<LogOut size={18} />}
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </Card>
      </div>
    </motion.section>
  );
};

export default Profile;