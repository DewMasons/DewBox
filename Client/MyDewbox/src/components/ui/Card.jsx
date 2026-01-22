import React, { memo } from 'react';

/**
 * Card Component - Minimal & Fast Loading
 * Optimized for performance with no animations by default
 * 
 * @param {Object} props
 * @param {'default' | 'elevated' | 'outlined' | 'flat'} props.variant - Card style variant
 * @param {'sm' | 'md' | 'lg' | 'none'} props.padding - Card padding size
 * @param {boolean} props.hoverable - Whether card should have hover effect
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClick - Click handler
 */
const Card = memo(({
  variant = 'default',
  padding = 'md',
  hoverable = false,
  children,
  className = '',
  onClick,
  ...props
}) => {
  // Base styles - minimal and clean
  const baseStyles = 'rounded-lg transition-colors duration-150';
  
  // Variant styles - minimal shadows for better performance
  const variantStyles = {
    default: 'bg-[var(--color-surface)] border border-[var(--color-border)]',
    elevated: 'bg-[var(--color-surface-elevated)] border border-[var(--color-border)] shadow-sm',
    outlined: 'bg-[var(--color-surface)] border-2 border-[var(--color-border)]',
    flat: 'bg-[var(--color-surface)]',
  };
  
  // Padding styles
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  // Hoverable styles - subtle and fast
  const hoverableStyles = hoverable ? 'cursor-pointer hover:border-[var(--color-primary)] hover:shadow-sm' : '';
  
  // Combine all styles
  const cardClasses = `${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${hoverableStyles} ${className}`;
  
  // Handle keyboard interaction for clickable cards
  const handleKeyDown = (e) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick(e);
    }
  };
  
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
});

Card.displayName = 'Card';

export default Card;
