import React from 'react'
import { FaFlag } from 'react-icons/fa'

export default function Error({ error }) {
  return (
    <div className="h-screen mx-auto grid place-items-center text-center px-8">
        <FaFlag className='w-20 h-20 mx--auto' />
        <h1 className='mt-10 text-3xl'>{error}</h1>
      
    </div>
  )
}
