import React from 'react';

/**
 * SkipToMain Component - Accessibility feature for keyboard navigation
 * Allows keyboard users to skip navigation and jump directly to main content
 */
const SkipToMain = () => {
  return (
    <a
      href="#main-content"
      className="skip-to-main focus-visible:ring-2 focus-visible:ring-white"
    >
      Skip to main content
    </a>
  );
};

export default SkipToMain;
