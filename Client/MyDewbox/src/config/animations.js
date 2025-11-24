/**
 * Framer Motion Animation Defaults
 * Revolut-inspired animation configurations for consistent motion design
 */

// Easing functions
export const easings = {
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  spring: { type: 'spring', stiffness: 300, damping: 30 },
  springBouncy: { type: 'spring', stiffness: 400, damping: 25 },
};

// Duration presets (in seconds)
export const durations = {
  fast: 0.15,
  base: 0.2,
  slow: 0.3,
  slower: 0.4,
};

// Page transition animations
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: durations.slow, ease: easings.easeInOut },
};

// Fade animations
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: durations.slower, ease: easings.easeInOut },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: durations.slower, ease: easings.easeOut },
};

// Scale animations
export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: durations.slow, ease: easings.easeOut },
};

// Modal animations
export const modalBackdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }, // 200ms for backdrop fade
};

export const modalContent = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 20 },
  transition: { duration: 0.3, ease: easings.easeOut }, // 300ms enter, smooth exit
};

// Button animations
export const buttonHover = {
  scale: 1.02,
  transition: { duration: 0.15, ease: easings.easeInOut }, // 150ms as per requirements
};

export const buttonTap = {
  scale: 0.98,
  transition: { duration: 0.1, ease: easings.easeInOut }, // 100ms as per requirements
};

// Card animations
export const cardHover = {
  y: -4, // translateY -4px as per requirements
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', // shadow-xl
  transition: { duration: 0.2, ease: easings.easeOut }, // 200ms as per requirements
};

// List item stagger animations
export const listContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // 50ms delay as per requirements
    },
  },
};

export const listItem = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: easings.easeOut }, // 300ms for smooth animation
  },
};

// Slide animations
export const slideInFromRight = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '100%', opacity: 0 },
  transition: { duration: durations.slow, ease: easings.easeInOut },
};

export const slideInFromLeft = {
  initial: { x: '-100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '-100%', opacity: 0 },
  transition: { duration: durations.slow, ease: easings.easeInOut },
};

// Skeleton loader animation
export const skeletonPulse = {
  animate: {
    opacity: [0.5, 1, 0.5],
  },
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: easings.easeInOut,
  },
};

// Carousel slide animation
export const carouselSlide = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
  transition: {
    x: { type: 'spring', stiffness: 300, damping: 30 },
    opacity: { duration: durations.base },
  },
};

// Success animation (for confirmations)
export const successAnimation = {
  initial: { scale: 0, opacity: 0 },
  animate: { 
    scale: [0, 1.2, 1], 
    opacity: [0, 1, 1],
  },
  transition: { 
    duration: 0.5, 
    times: [0, 0.6, 1],
    ease: easings.easeOut,
  },
};

// Notification slide in
export const notificationSlideIn = {
  initial: { x: 400, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 400, opacity: 0 },
  transition: { duration: durations.slow, ease: easings.easeOut },
};

// Default animation variants for common use cases
export const defaultVariants = {
  pageTransition,
  fadeIn,
  fadeInUp,
  scaleIn,
  modalBackdrop,
  modalContent,
  listContainer,
  listItem,
  slideInFromRight,
  slideInFromLeft,
};

// Helper function to create custom stagger animations
export const createStaggerContainer = (staggerDelay = 0.05) => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
    },
  },
});

// Helper function to create custom slide animations
export const createSlideAnimation = (direction = 'up', distance = 20) => {
  const axis = direction === 'up' || direction === 'down' ? 'y' : 'x';
  const value = direction === 'up' || direction === 'left' ? distance : -distance;
  
  return {
    initial: { opacity: 0, [axis]: value },
    animate: { opacity: 1, [axis]: 0 },
    exit: { opacity: 0, [axis]: value },
    transition: { duration: durations.slower, ease: easings.easeOut },
  };
};

export default {
  easings,
  durations,
  pageTransition,
  fadeIn,
  fadeInUp,
  scaleIn,
  modalBackdrop,
  modalContent,
  buttonHover,
  buttonTap,
  cardHover,
  listContainer,
  listItem,
  slideInFromRight,
  slideInFromLeft,
  skeletonPulse,
  carouselSlide,
  successAnimation,
  notificationSlideIn,
  defaultVariants,
  createStaggerContainer,
  createSlideAnimation,
};
