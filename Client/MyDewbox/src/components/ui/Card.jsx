import React from 'react';
import { motion } from 'framer-motion';
import { cardHover } from '../../config/animations';

/**
 * Card Component - Revolut-inspired card with variants and animations
 * 
 * @param {Object} props
 * @param {'default' | 'elevated' | 'outlined' | 'glass'} props.variant - Card style variant
 * @param {'sm' | 'md' | 'lg'} props.padding - Card padding size
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
  // Base styles with larger border radius for Revolut style
  const baseStyles = 'rounded-3xl transition-all duration-200 ease-in-out';
  
  // Variant styles - Clean Revolut-inspired design with subtle shadows
  const variantStyles = {
    default: 'bg-[var(--color-surface-elevated)] border border-[var(--color-border)] shadow-[0_1px_3px_rgba(0,0,0,0.06)]',
    elevated: 'bg-[var(--color-surface-elevated)] border border-[var(--color-border)] shadow-[0_2px_8px_rgba(0,0,0,0.08)]',
    outlined: 'bg-[var(--color-surface-elevated)] border-2 border-[var(--color-border)]',
    glass: 'bg-[var(--color-surface-elevated)] border border-[var(--color-border)] shadow-[0_1px_3px_rgba(0,0,0,0.06)]',
  };
  
  // Padding styles - more generous spacing
  const paddingStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-7',
  };
  
  // Hoverable styles - subtle hover effect
  const hoverableStyles = hoverable ? 'cursor-pointer hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]' : '';
  
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
