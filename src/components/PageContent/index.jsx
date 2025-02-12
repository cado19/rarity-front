import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { motion } from 'framer-motion'

const PageContent = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.85} },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-row bg-neutral-200 h-screen w-screen overflow-hidden"
    >
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="bg-teal-200">
          <Header />
        </div>
        <Outlet />
      </div>
    </motion.div>
  );
};

export default PageContent;
