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
    HiOutlineIdentification 
  } from "react-icons/hi";
  
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
          key: 'messages',
          label: 'Messages',
          path: '/messages',
          icon: <HiOutlineAnnotation />
      },
  ]
  
  export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
      {
          key: 'settings',
          label: 'Settings',
          path: '/settings',
          icon: <HiOutlineCog />
      },
      {
          key: 'support',
          label: 'Help & Support',
          path: '/support',
          icon: <HiOutlineQuestionMarkCircle />
      },
  ]