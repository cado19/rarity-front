import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function SidebarLink({ item, isSideBarOpen }) {
  const { pathname } = useLocation();
  const linkClasses = `flex items-center gap-2 font-light px-3 py-2 hover:bg-neutral-700 hover:no-underline active:bg-neutral-600 rounded-sm text-base ${
    pathname == item.path ? "bg-neutral-700 text-white" : "text-neutral-400"
  }`;

  return (
    <motion.div>
      <Link to={item.path} className={linkClasses}>
        <span className="text-xl min-w-5">{item.icon}</span>
        <AnimatePresence>
          {isSideBarOpen && (
            <motion.span
              className="ml-4 whitespace-nowrap"
              initial={{ opacity: 0, width: 0 }}
              animate={{opacity: 1, width: "auto"}}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2, delay: 0.3 }}
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>
      </Link>
    </motion.div>
  );
}
