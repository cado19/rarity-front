import React from 'react'

export default function Loading() {
  return (
    <div className="bg-white px-8 pb-4 rounded border-gray-200 flex-1 shadow-md mt-2 mx-3">
      <div className="h-100 flex flex-col justify-center items-center">

      <p className="4xl text-center">Loading</p>
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    </div>
  )
}
