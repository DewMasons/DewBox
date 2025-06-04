import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { Bell, Menu } from "lucide-react";
import DMLogo from "../assets/DMLogo.png";

const Header = ({ onMenuClick }) => {
  return (
    <motion.header
      className={clsx(
        "px-6 py-4",
        "bg-white/80 dark:bg-gray-800/90",
        "backdrop-blur-sm",
        "border-b border-gray-200 dark:border-gray-700",
        "sticky top-0 z-50"
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
        {/* Dewbox Logo on the left */}
        <div className="flex items-center gap-3">
          <img src={DMLogo} alt="Dewbox Logo" className="h-10 w-10" />
          <span className="hidden sm:block text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
            MyDewbox
          </span>
        </div>
        {/* Notification bell and menu on the right */}
        <div className="flex items-center gap-4">
          <button
            className="relative group"
            aria-label="Notifications"
          >
            <Bell size={26} className="text-blue-700" />
            {/* Notification dot */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          {/* Hamburger menu for mobile */}
          <button
            className="md:hidden"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <Menu size={30} className="text-blue-700" />
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;