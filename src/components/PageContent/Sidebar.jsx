// THIS COMPONENT RENDERS THE ENTIRE SIDEBAR. IT IMPORTS LINKS AND PASSES THEM TO SIDEBAR LINK COMPONENT FOR FORMATTING
import React, { useState } from "react";
import { FcBullish } from "react-icons/fc";
import {
  DASHBOARD_SIDEBAR_BOTTOM_LINKS,
  DASHBOARD_SIDEBAR_LINKS,
} from "../../constants/navigation";
import SidebarLink from "./SidebarLink";
import { motion } from "motion/react";

const Sidebar = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  return (
    <motion.div
      className={`bg-neutral-900 p-3 backdrop-blur-md bg-opacity-90 transition-all duration-300 ease-in-out flex-shrink-0 flex flex-col text-white ${
        isSideBarOpen ? "w-64" : "w-20"
      }`}
      animate={{ width: isSideBarOpen ? 256 : 80 }}
      onHoverStart={() => setIsSideBarOpen(true)}
      onHoverEnd={() => setIsSideBarOpen(false)}
    >
      {/* Brand and Logo  */}
      <div className="flex items-center gap-2 px-1 py-3">
        <FcBullish fontSize={24} />
        <span className="text-neutral-100 text-lg ">Rarity Cars</span>
      </div>

      {/* Links  */}
      <div className="flex-1 py-8 flex flex-col gap-0.5">
        {DASHBOARD_SIDEBAR_LINKS.map((item) => (
          <SidebarLink key={item.key} item={item} isSideBarOpen={isSideBarOpen} />
        ))}
      </div>

      {/* Bottom Links  */}
      <div>
        {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((item) => (
          <SidebarLink key={item.key} item={item} />
        ))}
      </div>
    </motion.div>
  );
};

export default Sidebar;
