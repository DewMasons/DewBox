import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { buttonHover, buttonTap } from '../../config/animations';

/**
 * Button Component - Revolut-inspired button with variants and animations
 * 
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'} props.variant - Button style variant
 * @param {'sm' | 'md' | 'lg'} props.size - Button size
 * @param {boolean} props.fullWidth - Whether button should take full width
 * @param {boolean} props.loading - Loading state with spinner
 * @param {string} props.loadingText - Custom text to show when loading (defaults to "Loading...")
 * @param {boolean} props.disabled - Disabled state
 * @param {React.ReactNode} props.icon - Icon to display on the left
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClick - Click handler
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  loadingText = 'Loading...',
  disabled = false,
  icon = null,
  children,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  // Base styles with enhanced focus for keyboard navigation
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-150 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Variant styles - using CSS variables for theme support with cleaner Revolut style
  const variantStyles = {
    primary: 'bg-[#0066FF] text-white hover:bg-[#0052CC] focus:ring-[var(--color-primary)] shadow-sm hover:shadow-md',
    secondary: 'bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:bg-gray-100 focus:ring-[var(--color-primary)] border border-gray-200',
    outline: 'bg-transparent border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] focus:ring-[var(--color-primary)]',
    ghost: 'bg-transparent text-[var(--color-primary)] hover:bg-gray-100 focus:ring-[var(--color-primary)]',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow-md',
  };
  
  // Size styles - ensuring minimum 44px height for touch targets
  const sizeStyles = {
    sm: 'px-4 py-2.5 text-sm gap-2 min-h-[44px]', // 44px minimum for mobile touch
    md: 'px-5 py-3 text-base gap-2 min-h-[48px]', // 48px for better touch
    lg: 'px-6 py-3.5 text-lg gap-2.5 min-h-[52px]', // 52px for large buttons
  };
  
  // Width styles
  const widthStyles = fullWidth ? 'w-full' : '';
  
  // Combine all styles
  const buttonClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`;
  
  // Determine if button should be disabled
  const isDisabled = disabled || loading;
  
  return (
    <motion.button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      whileHover={!isDisabled ? buttonHover : {}}
      whileTap={!isDisabled ? buttonTap : {}}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} aria-hidden="true" />
          <span>{loadingText}</span>
        </>
      ) : (
        <>
          {icon && <span className="flex-shrink-0" aria-hidden="true">{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  );
};

export default Button;
