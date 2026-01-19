import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

/**
 * Input Component - Professional Fintech Design
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
  
  // Base input styles - clean and professional with light theme for auth pages
  const baseStyles = 'w-full rounded-lg border transition-all duration-150 ease-in-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed bg-white text-gray-900 placeholder:text-gray-400 text-sm';
  
  // Focus and error state styles
  const stateStyles = error
    ? 'border-red-500 focus:ring-2 focus:ring-red-500/10 focus:border-red-500'
    : isFocused
    ? 'border-blue-600 ring-2 ring-blue-600/10'
    : 'border-gray-300 hover:border-gray-400';
  
  // Padding based on icon presence
  const paddingStyles = icon ? 'pl-10 pr-3 py-2.5' : 'px-3 py-2.5';
  
  // Password toggle padding
  const passwordPaddingStyles = type === 'password' ? 'pr-10' : '';
  
  // Minimum height for touch targets
  const heightStyles = 'min-h-[44px]';
  
  // Combine input styles
  const inputClasses = `${baseStyles} ${stateStyles} ${paddingStyles} ${passwordPaddingStyles} ${heightStyles} ${className}`;
  
  // Generate unique IDs for accessibility
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = `${inputId}-error`;
  
  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label htmlFor={inputId} className="block text-xs font-medium text-gray-600 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </label>
      )}
      
      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" aria-hidden="true">
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
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg hover:bg-gray-50"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-controls={inputId}
          >
            {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
          </button>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <div id={errorId} className="flex items-center gap-1.5 mt-1.5 text-red-500 text-xs font-medium" role="alert" aria-live="polite">
          <AlertCircle size={14} aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
