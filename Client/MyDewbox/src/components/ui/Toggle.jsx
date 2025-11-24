import React from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const Toggle = ({ 
  checked = false, 
  onChange, 
  disabled = false,
  label,
  description,
  className = ""
}) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex-1">
        {label && (
          <label className="text-sm font-medium text-[var(--color-text-primary)] block">
            {label}
          </label>
        )}
        {description && (
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            {description}
          </p>
        )}
      </div>
      
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full
          transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2
          ${checked ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <motion.span
          layout
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white shadow-lg
            ${checked ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
};

Toggle.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  description: PropTypes.string,
  className: PropTypes.string,
};

export default Toggle;
