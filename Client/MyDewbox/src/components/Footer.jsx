import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

const Footer = () => {
  return (
    <motion.footer
      className={clsx(
        "px-6 py-4 mt-auto",
        "bg-white/80 dark:bg-gray-800/90",
        "backdrop-blur-sm",
        "border-t border-gray-200 dark:border-gray-700"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} MyDewbox. All rights reserved.
        </div>
        <div className="flex items-center space-x-4 mt-2 md:mt-0">
          <a
            href="#"
            className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 
            transition-colors duration-200"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 
            transition-colors duration-200"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 
            transition-colors duration-200"
          >
            Contact
          </a>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
