import React from 'react'
import { Link } from 'react-router-dom';

export default function Header() {
    // Get the user's name from local storage
    const userData = localStorage.getItem('user');
    const userName = userData ? JSON.parse(userData).name : 'Guest';
    const userId = userData ? JSON.parse(userData).id : null;
  
  return (
    <div className='bg-white h-16 px-4 flex justify-end items-center border-b border-gray-200'>
      {/* Display the user's name on the right side */}
      <div className='text-gray-700'>
       <Link to={`/agent/${userId}`}>{userName}</Link> 
      </div>

    </div>
  )
}
