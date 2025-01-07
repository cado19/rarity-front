// THIS COMPONENT RENDERS THE ENTIRE SIDEBAR. IT IMPORTS LINKS AND PASSES THEM TO SIDEBAR LINK COMPONENT FOR FORMATTING 
import React from 'react'
import { FcBullish } from "react-icons/fc";
import { DASHBOARD_SIDEBAR_BOTTOM_LINKS, DASHBOARD_SIDEBAR_LINKS } from '../../constants/navigation';
import SidebarLink from './SidebarLink';



const Sidebar = () => {
  return (
    <div className='bg-neutral-900 w-60 p-3 flex flex-col text-white'>
      
      {/* Brand and Logo  */}
      <div className="flex items-center gap-2 px-1 py-3">
        <FcBullish fontSize={24} />
        <span className='text-neutral-100 text-lg '>OpenShop</span>
      </div>

      {/* Links  */}
      <div className='flex-1 py-8 flex flex-col gap-0.5'>
        {DASHBOARD_SIDEBAR_LINKS.map((item) => (
          <SidebarLink key={item.key} item={item} />
        ))}
      </div>

      {/* Bottom Links  */}
      <div>
        {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((item) => (
          <SidebarLink key={item.key} item={item} />
        ))}
      </div>
    </div>
  )
}

export default Sidebar
