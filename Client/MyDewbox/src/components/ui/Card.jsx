import React from 'react';
import { motion } from 'framer-motion';
import { cardHover } from '../../config/animations';

/**
 * Card Component - Professional Fintech Design
 * 
 * @param {Object} props
 * @param {'default' | 'elevated' | 'outlined' | 'flat'} props.variant - Card style variant
 * @param {'sm' | 'md' | 'lg' | 'none'} props.padding - Card padding size
 * @param {boolean} props.hoverable - Whether card should have hover animation
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClick - Click handler
 */
const Card = ({
  variant = 'default',
  padding = 'md',
  hoverable = false,
  children,
  className = '',
  onClick,
  ...props
}) => {
  // Base styles - clean and professional
  const baseStyles = 'rounded-lg transition-all duration-150 ease-in-out';
  
  // Variant styles - professional fintech design with theme support
  const variantStyles = {
    default: 'bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm',
    elevated: 'bg-[var(--color-surface-elevated)] border border-[var(--color-border)] shadow-md',
    outlined: 'bg-[var(--color-surface)] border-2 border-[var(--color-border)]',
    flat: 'bg-[var(--color-surface)] border border-[var(--color-border)]',
  };
  
  // Padding styles
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  // Hoverable styles
  const hoverableStyles = hoverable ? 'cursor-pointer hover:shadow-lg hover:border-[var(--color-primary)]' : '';
  
  // Combine all styles
  const cardClasses = `${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${hoverableStyles} ${className}`;
  
  // Handle keyboard interaction for clickable cards
  const handleKeyDown = (e) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick(e);
    }
  };
  
  // If hoverable, use motion.div with hover animation
  if (hoverable) {
    return (
      <motion.div
        className={cardClasses}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        whileHover={cardHover}
        tabIndex={onClick ? 0 : undefined}
        role={onClick ? 'button' : undefined}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
  
  // Otherwise, use regular div
  return (
    <div
      className={cardClasses}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
