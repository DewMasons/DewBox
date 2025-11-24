import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook for keyboard shortcuts
 * Provides keyboard navigation for common actions
 * 
 * Shortcuts:
 * - Alt + H: Navigate to Home/Dashboard
 * - Alt + T: Navigate to Transactions
 * - Alt + C: Navigate to Contribute
 * - Alt + P: Navigate to Profile
 * - Escape: Close modals/overlays (handled by individual components)
 */
const useKeyboardShortcuts = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Only trigger if Alt key is pressed (Cmd on Mac)
      const isModifierPressed = event.altKey || event.metaKey;
      
      if (!isModifierPressed) return;
      
      // Prevent default browser behavior
      const shortcuts = {
        'h': '/dashboard',
        'H': '/dashboard',
        't': '/dashboard/transactions',
        'T': '/dashboard/transactions',
        'c': '/dashboard/contribute',
        'C': '/dashboard/contribute',
        'p': '/dashboard/profile',
        'P': '/dashboard/profile',
      };
      
      const path = shortcuts[event.key];
      
      if (path) {
        event.preventDefault();
        navigate(path);
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);
};

export default useKeyboardShortcuts;
