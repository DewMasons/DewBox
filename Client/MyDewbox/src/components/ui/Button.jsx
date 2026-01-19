import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { buttonHover, buttonTap } from '../../config/animations';

/**
 * Button Component - Professional Fintech Design
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
  // Base styles - clean and professional
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-150 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Variant styles - professional fintech design with dark mode support
  const variantStyles = {
    primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] focus:ring-[var(--color-primary)] shadow-sm hover:shadow-md active:scale-[0.98]',
    secondary: 'bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] focus:ring-[var(--color-primary)] border border-[var(--color-border)] hover:border-[var(--color-primary)] shadow-sm active:scale-[0.98]',
    outline: 'bg-transparent border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white focus:ring-[var(--color-primary)] active:scale-[0.98]',
    ghost: 'bg-transparent text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] focus:ring-[var(--color-primary)] active:scale-[0.98]',
    danger: 'bg-[var(--color-error)] text-white hover:bg-red-700 focus:ring-[var(--color-error)] shadow-sm hover:shadow-md active:scale-[0.98]',
  };
  
  // Size styles - ensuring minimum 44px height for touch targets
  const sizeStyles = {
    sm: 'px-4 py-2.5 text-sm gap-2 min-h-[44px]',
    md: 'px-5 py-3 text-base gap-2 min-h-[48px]',
    lg: 'px-6 py-3.5 text-lg gap-2.5 min-h-[52px]',
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
