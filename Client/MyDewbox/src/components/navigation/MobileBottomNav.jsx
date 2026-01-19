import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Wallet, PlusCircle, User } from "lucide-react";
import clsx from "clsx";

const MobileBottomNav = () => {
  const navItems = [
    { path: "/dashboard", icon: Home, label: "Home" },
    { path: "/dashboard/contribute", icon: PlusCircle, label: "Contribute" },
    { path: "/dashboard/wallet", icon: Wallet, label: "Wallet" },
    { path: "/dashboard/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className={clsx(
        "md:hidden",
        "fixed bottom-0 left-0 right-0 z-50",
        "h-16 safe-area-bottom",
        "bg-[var(--color-surface)] border-t border-[var(--color-border)]",
        "shadow-lg"
      )}
    >
      <div className="flex items-center justify-around h-16 px-2" role="list">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            aria-label={`Navigate to ${label}`}
            aria-current={({ isActive }) => (isActive ? "page" : undefined)}
            className={({ isActive }) =>
              clsx(
                "flex flex-col items-center justify-center",
                "flex-1 min-h-[56px]",
                "transition-all duration-150",
                isActive ? "text-[var(--color-primary)]" : "text-[var(--color-text-tertiary)]"
              )
            }
            role="listitem"
          >
            {({ isActive }) => (
              <motion.div
                className="flex flex-col items-center justify-center gap-1 py-2"
                animate={{
                  scale: isActive ? 1.05 : 1,
                }}
                transition={{ duration: 0.15 }}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} aria-hidden="true" />
                <span className="text-xs font-medium">{label}</span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
