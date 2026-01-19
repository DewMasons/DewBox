import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Wallet, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from './ui/Modal';
import Button from './ui/Button';

const FundWalletPrompt = ({ balance, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has seen the prompt before
    const hasSeenPrompt = localStorage.getItem('hasSeenFundWalletPrompt');
    
    // Show prompt if balance is 0 and user hasn't seen it
    if (balance === 0 && !hasSeenPrompt) {
      setIsOpen(true);
    }
  }, [balance]);

  const handleClose = () => {
    setIsOpen(false);
    // Mark as seen so it doesn't show again
    localStorage.setItem('hasSeenFundWalletPrompt', 'true');
    if (onClose) onClose();
  };

  const handleFundWallet = () => {
    handleClose();
    navigate('/dashboard/transactions?action=deposit');
  };

  const handleRemindLater = () => {
    setIsOpen(false);
    // Don't mark as seen, so it shows again next time
    if (onClose) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal isOpen={isOpen} onClose={handleClose}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Wallet size={40} className="text-white" />
              </div>
            </div>

            {/* Content */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Welcome to COOPEX my dewbox! 🎉
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Your wallet is currently empty. Fund your wallet to start making contributions and enjoying all the benefits.
              </p>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mb-4">
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  💡 <strong>Tip:</strong> Keep your wallet funded to ensure automatic contributions run smoothly every day!
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={handleFundWallet}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
              >
                Fund Wallet Now
                <ArrowRight size={20} />
              </Button>
              
              <button
                onClick={handleRemindLater}
                className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium py-3 transition-colors"
              >
                Remind Me Later
              </button>
              
              <button
                onClick={handleClose}
                className="w-full text-sm text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Don't show this again
              </button>
            </div>
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default FundWalletPrompt;
