import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function SidebarLink({ item }) {
    const { pathname } = useLocation()
    const linkClasses = `flex items-center gap-2 font-light px-3 py-2 hover:bg-neutral-700 hover:no-underline active:bg-neutral-600 rounded-sm text-base ${pathname == item.path ? 'bg-neutral-700 text-white': 'text-neutral-400'}`

    return (
      <Link to={item.path} className={linkClasses}>
        <span className='text-xl'>{ item.icon }</span>
        { item.label }
      </Link>
    )
}
