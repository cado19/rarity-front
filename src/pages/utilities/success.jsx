import React from 'react'
import { useLocation } from 'react-router-dom'

export default function Success() {
  const location = useLocation();
  const message = location.state?.message || "Your action has been completed successfully"; 
  return (
    <div className="flex items-center justify-center h-screen bg-white">
    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
      <svg
        className="w-16 h-16 text-green-500 mx-auto mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2l4-4m0 0a9 9 0 11-4 4m-8 0a9 9 0 11-2-4"
        />
      </svg>
      <h2 className="text-2xl font-bold mb-2">Success!</h2>
      <p className="text-gray-700 mb-4">{message}</p>
      
    </div>
  </div>
  )
}
