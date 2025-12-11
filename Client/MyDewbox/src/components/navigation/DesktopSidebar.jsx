import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Receipt, PlusCircle, User, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import { useAuthStore } from "../../store/authstore";
import DMLogo from "../../assets/DMLogo.png";

const DesktopSidebar = ({ isCollapsed = false, onToggleCollapse }) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    localStorage.removeItem('token');
    logout();
    navigate('/signin');
  };

  const navItems = [
    { path: "/dashboard", icon: Home, label: "Home" },
    { path: "/dashboard/contribute", icon: PlusCircle, label: "Contribute" },
    { path: "/dashboard/transactions", icon: Receipt, label: "Transactions" },
    { path: "/dashboard/profile", icon: User, label: "Profile" },
  ];

  return (
    <motion.nav
      role="navigation"
      aria-label="Main navigation"
      className={clsx(
        "hidden md:flex",
        "fixed top-0 left-0 h-screen z-40",
        "bg-[var(--color-surface-elevated)] border-r border-[var(--color-border)]",
        "flex-col",
        "transition-all duration-300"
      )}
      animate={{
        width: isCollapsed ? "80px" : "280px",
      }}
      initial={false}
      aria-expanded={!isCollapsed}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <img src={DMLogo} alt="Dewbox Logo" className="h-12 w-12" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                MyDewbox
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        {isCollapsed && (
          <motion.img
            src={DMLogo}
            alt="Dewbox Logo"
            className="h-12 w-12 mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </div>

      {/* Navigation Items */}
      <div className="flex-1 p-4 space-y-2" role="list">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            aria-label={`Navigate to ${label}`}
            aria-current={({ isActive }) => (isActive ? "page" : undefined)}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3",
                "px-4 py-3 rounded-lg",
                "min-h-[48px]", // Minimum 48px height for touch targets
                "font-medium transition-all duration-150",
                isActive
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]"
              )
            }
            role="listitem"
          >
            <Icon size={24} className="shrink-0" aria-hidden="true" />
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="whitespace-nowrap overflow-hidden"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </div>

      {/* Collapse Toggle & Logout */}
      <div className="p-4 space-y-2 border-t border-[var(--color-border)]">
        <button
          onClick={handleLogout}
          aria-label="Logout from account"
          className={clsx(
            "flex items-center gap-3 w-full",
            "px-4 py-3 rounded-lg",
            "min-h-[48px]", // Minimum 48px height for touch targets
            "font-medium text-red-600",
            "hover:bg-red-50 transition-all duration-150"
          )}
        >
          <LogOut size={24} className="shrink-0" aria-hidden="true" />
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap overflow-hidden"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <button
          onClick={onToggleCollapse}
          className={clsx(
            "flex items-center justify-center w-full",
            "px-4 py-3 rounded-lg",
            "min-h-[48px]", // Minimum 48px height for touch targets
            "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]",
            "transition-all duration-150"
          )}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!isCollapsed}
        >
          {isCollapsed ? (
            <ChevronRight size={24} aria-hidden="true" />
          ) : (
            <>
              <ChevronLeft size={24} className="shrink-0" aria-hidden="true" />
              <AnimatePresence mode="wait">
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="whitespace-nowrap overflow-hidden ml-3"
                >
                  Collapse
                </motion.span>
              </AnimatePresence>
            </>
          )}
        </button>
      </div>
    </motion.nav>
  );
};

export default DesktopSidebar;
