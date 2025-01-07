import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PageContent from '../PageContent'
import Dashboard from '../../pages/Dashboard'
import AllVehicles from '../../pages/vehicles/all'
import AllCustomers from '../../pages/customers/all'


export default function AppRouter() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<PageContent />}>
            <Route index element={<Dashboard />} />
            {/* Vehicle Routes  */}
            <Route path='/vehicles' element={<AllVehicles />} />

            {/* Customer Routes  */}
            <Route path='/customers' element={<AllCustomers />} />

            {/* Driver Routes  */}

            {/* Booking Routes  */}
            
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
