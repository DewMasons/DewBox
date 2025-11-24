import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

/**
 * Input Component - Revolut-inspired input with validation and icon support
 * 
 * @param {Object} props
 * @param {string} props.label - Input label
 * @param {string} props.error - Error message to display
 * @param {React.ReactNode} props.icon - Icon to display on the left
 * @param {string} props.type - Input type (text, email, password, number, date)
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.required - Whether field is required
 */
const Input = forwardRef(({
  label,
  error,
  icon,
  type = 'text',
  placeholder,
  disabled = false,
  className = '',
  required = false,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  // Determine actual input type (handle password visibility toggle)
  const inputType = type === 'password' && showPassword ? 'text' : type;
  
  // Base input styles - Revolut uses larger, more rounded inputs
  const baseStyles = 'w-full rounded-2xl border transition-all duration-200 ease-in-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] font-medium';
  
  // Focus and error state styles
  const stateStyles = error
    ? 'border-[var(--color-error)] focus:ring-2 focus:ring-[var(--color-error)] focus:border-transparent'
    : isFocused
    ? 'border-transparent ring-2 ring-[var(--color-primary)]'
    : 'border-[var(--color-border)] hover:border-gray-300';
  
  // Padding based on icon presence - ensuring 52px minimum height for better UX
  const paddingStyles = icon ? 'pl-12 pr-4 py-3.5' : 'px-4 py-3.5';
  
  // Password toggle padding
  const passwordPaddingStyles = type === 'password' ? 'pr-12' : '';
  
  // Minimum height for touch targets
  const heightStyles = 'min-h-[52px] text-base';
  
  // Combine input styles
  const inputClasses = `${baseStyles} ${stateStyles} ${paddingStyles} ${passwordPaddingStyles} ${heightStyles} ${className}`;
  
  // Generate unique IDs for accessibility
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = `${inputId}-error`;
  
  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold text-[var(--color-text-primary)] mb-2">
          {label}
          {required && <span className="text-[var(--color-error)] ml-1" aria-label="required">*</span>}
        </label>
      )}
      
      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" aria-hidden="true">
            {icon}
          </div>
        )}
        
        {/* Input Field */}
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          aria-required={required}
          className={inputClasses}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {/* Password Toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-gray-100"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-controls={inputId}
          >
            {showPassword ? <EyeOff size={22} aria-hidden="true" /> : <Eye size={22} aria-hidden="true" />}
          </button>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <div id={errorId} className="flex items-center gap-1.5 mt-2 text-[var(--color-error)] text-sm font-medium" role="alert" aria-live="polite">
          <AlertCircle size={16} aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
