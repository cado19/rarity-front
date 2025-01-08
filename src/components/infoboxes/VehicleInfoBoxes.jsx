import React from 'react'
import { IoBagHandle } from 'react-icons/io5'

const VehicleInfoBoxes = ({ make, model, number_plate, id, category }) => {
  return (
    <div className='flex gap-4 w-full mt-2 ml-1 mr-1'>
        <BoxWrapper>

            <div className='pl-4'>
                <span className='text-sm text-gray-500 font-light'>Name</span>
                <div className='flex items-center'>
                    <strong className='text-xl text-gray-700 font-semibold'>{make} {model}</strong> 
                    <span className='text-sm text-green-500 pl-2'>+234</span> 
                </div>
            </div>
        </BoxWrapper>
        <BoxWrapper>

            <div className='pl-4'>
                <span className='text-sm text-gray-500 font-light'>Registration</span>
                <div className='flex items-center'>
                    <strong className='text-xl text-gray-700 font-semibold'>{number_plate}</strong> 
                    <span className='text-sm text-green-500 pl-2'>+234</span> 
                </div>
            </div>
        </BoxWrapper>
        <BoxWrapper>

            <div className='pl-4'>
                <span className='text-sm text-gray-500 font-light'>Category</span>
                <div className='flex items-center'>
                    <strong className='text-xl text-gray-700 font-semibold'>{category}</strong> 
                    <span className='text-sm text-green-500 pl-2'>+234</span> 
                </div>
            </div>
        </BoxWrapper>
        <BoxWrapper>

            <div className='pl-4'>
                <span className='text-sm text-gray-500 font-light'>Total Sales</span>
                <div className='flex items-center'>
                    <strong className='text-xl text-gray-700 font-semibold'>$14325.60</strong> 
                    <span className='text-sm text-green-500 pl-2'>+234</span> 
                </div>
            </div>
        </BoxWrapper>
    </div>
  )
}

export default VehicleInfoBoxes

function BoxWrapper({ children }){
    return (
        <div className="bg-white rounded-sm p-4 flex-1 border border-gray-200 flex items-center">{ children }</div>
    )
}
