import React from 'react';
import { motion } from 'framer-motion';
import { skeletonPulse } from '../../config/animations';

/**
 * Skeleton Component - Loading placeholder with pulse animation
 * 
 * @param {Object} props
 * @param {'rectangle' | 'circle'} props.shape - Skeleton shape
 * @param {string} props.width - Width (CSS value)
 * @param {string} props.height - Height (CSS value)
 * @param {string} props.className - Additional CSS classes
 */
const Skeleton = ({
  shape = 'rectangle',
  width = '100%',
  height = '20px',
  className = '',
}) => {
  // Base styles - using CSS variables for theme support
  const baseStyles = 'bg-[var(--color-border)] overflow-hidden';
  
  // Shape styles
  const shapeStyles = shape === 'circle' ? 'rounded-full' : 'rounded-md';
  
  // Combine styles
  const skeletonClasses = `${baseStyles} ${shapeStyles} ${className}`;
  
  return (
    <motion.div
      className={skeletonClasses}
      style={{ width, height }}
      role="status"
      aria-label="Loading content"
      aria-live="polite"
      {...skeletonPulse}
    >
      <span className="sr-only">Loading...</span>
    </motion.div>
  );
};

/**
 * SkeletonText - Multiple skeleton lines for text content
 * 
 * @param {Object} props
 * @param {number} props.lines - Number of lines
 * @param {string} props.className - Additional CSS classes
 */
export const SkeletonText = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-1 ${className}`} role="status" aria-label="Loading text content">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          width={index === lines - 1 ? '70%' : '100%'}
          height="16px"
        />
      ))}
    </div>
  );
};

/**
 * SkeletonCard - Skeleton for card content
 * 
 * @param {Object} props
 * @param {boolean} props.showAvatar - Whether to show avatar skeleton
 * @param {string} props.className - Additional CSS classes
 */
export const SkeletonCard = ({ showAvatar = false, className = '' }) => {
  return (
    <div className={`p-3 bg-[var(--color-surface-elevated)] rounded-lg border border-[var(--color-border)] ${className}`} role="status" aria-label="Loading card content">
      <div className="flex items-start gap-1.5">
        {showAvatar && (
          <Skeleton shape="circle" width="48px" height="48px" />
        )}
        <div className="flex-1">
          <Skeleton width="60%" height="20px" className="mb-1" />
          <SkeletonText lines={2} />
        </div>
      </div>
    </div>
  );
};

/**
 * SkeletonList - Multiple skeleton items in a list
 * 
 * @param {Object} props
 * @param {number} props.items - Number of items
 * @param {boolean} props.showAvatar - Whether to show avatar in each item
 * @param {string} props.className - Additional CSS classes
 */
export const SkeletonList = ({ items = 5, showAvatar = false, className = '' }) => {
  return (
    <div className={`space-y-1.5 ${className}`} role="status" aria-label="Loading list content" aria-live="polite">
      {Array.from({ length: items }).map((_, index) => (
        <SkeletonCard key={index} showAvatar={showAvatar} />
      ))}
    </div>
  );
};

export default Skeleton;
