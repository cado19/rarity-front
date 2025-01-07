import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import { Outlet } from 'react-router-dom'

const PageContent = () => {
  return (
    <div className='flex flex-row bg-neutral-200 h-screen w-screen overflow-hidden'>
        <Sidebar />
        <div className='flex-1'>
          <div className='bg-teal-200'><Header /></div>
          <Outlet />
        </div>
    </div>
  )
}

export default PageContent
