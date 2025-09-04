// THIS FILE CONTAINS LINKS AND PATHS AS CONTACTS TO BE IMPORTED TO SIDEBAR COMPONENT 
import {
    HiOutlineViewGrid,
    HiOutlineCube,
    HiOutlineShoppingCart,
    HiOutlineUserGroup,
    HiOutlineUser,
    HiOutlineDocumentText,
    HiOutlineAnnotation,
    HiOutlineQuestionMarkCircle,
    HiOutlineCog,
    HiOutlineTruck,
    HiOutlineIdentification, 
    HiOutlineChartPie,
    HiOutlineArrowRight,
    HiOutlineArrowCircleRight,
    HiCash
  } from "react-icons/hi";
import { HiMiniWrenchScrewdriver } from "react-icons/hi2";  
  export const DASHBOARD_SIDEBAR_LINKS = [
      {
          key: 'dashboard',
          label: 'Dashboard',
          path: '/',
          icon: <HiOutlineViewGrid />
      },
      {
          key: 'clients',
          label: 'Clients',
          path: '/customers',
          icon: <HiOutlineUserGroup /> 
        
      },
      {
          key: 'agents',
          label: 'Agents',
          path: '/agents',
          icon: <HiOutlineUser /> 
        
      },
      {
          key: 'vehicles',
          label: 'Vehicles',
          path: '/vehicles',
          icon:  <HiOutlineTruck />
      },
      {
          key: 'issues',
          label: 'Fleet Maintenance',
          path: '/issues',
          icon:  <HiMiniWrenchScrewdriver />
      },
      {
          key: 'drivers',
          label: 'Drivers',
          path: '/drivers',
          icon: <HiOutlineIdentification />
      },
      {
          key: 'bookings',
          label: 'Bookings',
          path: '/bookings/all',
          icon: <HiOutlineDocumentText />
      },
      {
          key: 'payments',
          label: 'Payments',
          path: '/payments',
          icon: <HiCash />
      },
      {
          key: 'analytics',
          label: 'Analytics',
          path: '/analytics',
          icon: <HiOutlineChartPie />
      },
  ]
  
  export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
      {
          key: 'logout',
          label: 'Logout',
          path: '/logout',
          icon: <HiOutlineArrowRight />
          
      },
      {
          key: 'support',
          label: 'Help & Support',
          path: '/support',
          icon: <HiOutlineQuestionMarkCircle />
      },
  ]