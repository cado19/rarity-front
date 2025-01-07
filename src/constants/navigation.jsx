// THIS FILE CONTAINS LINKS AND PATHS AS CONTACTS TO BE IMPORTED TO SIDEBAR COMPONENT 
import {
    HiOutlineViewGrid,
    HiOutlineCube,
    HiOutlineShoppingCart,
    HiOutlineUsers,
    HiOutlineDocumentText,
    HiOutlineAnnotation,
    HiOutlineQuestionMarkCircle,
    HiOutlineCog,
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
          icon: <HiOutlineCube />
      },
      {
          key: 'vehicles',
          label: 'Vehicles',
          path: '/vehicles',
          icon: <HiOutlineShoppingCart />
      },
      {
          key: 'drivers',
          label: 'Drivers',
          path: '/drivers',
          icon: <HiOutlineUsers />
      },
      {
          key: 'bookings',
          label: 'Bookings',
          path: '/bookings',
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