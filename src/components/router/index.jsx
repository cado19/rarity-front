import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PageContent from '../PageContent'
import Dashboard from '../../pages/Dashboard'
import AllVehicles from '../../pages/vehicles/all'
import AllCustomers from '../../pages/customers/all'
import Vehicle from '../../pages/vehicles/vehicle'
import Customer from '../../pages/customers/customer'
import AllBookings from '../../pages/bookings/all'
import ActiveBookings from '../../pages/bookings/active'
import UpcomingBookings from '../../pages/bookings/upcoming'
import CompletedBookings from '../../pages/bookings/completed'
import CancelledBookings from '../../pages/bookings/cancelled'
import Booking from '../../pages/bookings/booking'
import NewCustomer from '../../pages/customers/new'
import Login from '../../pages/accounts/login'
import NewBooking from '../../pages/bookings/new'
import ShowContract from '../../pages/contracts/show'
import EditContract from '../../pages/contracts/edit'
import Success from '../../pages/utilities/success'
import RecentCustomers from '../../pages/customers/recent'
import BookingVoucher from '../../pages/bookings/voucher'
import SelfRegister from '../../pages/customers/self_register'
import CancelBooking from '../bookings/cancel'
import CompleteBooking from '../bookings/complete'
import LicenseUpload from '../../pages/customers/license_upload'
import IDUpload from '../../pages/customers/id_upload'
import ProfileUpload from '../../pages/customers/profile_upload'
import AllDrivers from '../../pages/drivers/all'
import NewDriver from '../../pages/drivers/new'
import AllAgents from '../../pages/agents/all'
import NewAgent from '../../pages/agents/new'
import Agent from '../../pages/agents/agent'
import Driver from '../../pages/drivers/driver'


export default function AppRouter() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<PageContent />}>
            <Route index element={<Dashboard />} />
            {/* Vehicle Routes  */}
            <Route path='/vehicles' element={<AllVehicles />} />
            <Route path='/vehicle/:id' element={<Vehicle />} />

            {/* Customer Routes  */}
            <Route path='/customers' element={<AllCustomers />} />
            <Route path='/recent_clients' element={<RecentCustomers />} />
            <Route path='/customer/:id' element={<Customer />} />
            <Route path='/customer/new' element={<NewCustomer />} />

            {/* Driver Routes  */}
            <Route path='/drivers' element={<AllDrivers />} />
            <Route path='/driver/new' element={<NewDriver />} />
            <Route path='/driver/:id' element={<Driver />} />

            {/* Booking Routes  */}
            <Route path='/bookings/all' element={<AllBookings />} />
            <Route path='/bookings/active' element={<ActiveBookings />} />
            <Route path='/bookings/completed' element={<CompletedBookings />} />
            <Route path='/bookings/upcoming' element={<UpcomingBookings />} />
            <Route path='/bookings/cancelled' element={<CancelledBookings />} />
            <Route path='/bookings/new' element={<NewBooking />} />
            <Route path='/booking/:id' element={<Booking />} />
            <Route path='/booking/:id/cancel' element={<CancelBooking />} />
            <Route path='/booking/:id/complete' element={<CompleteBooking />} />

            {/* Agent Routes  */}
            <Route path='/agents' element={<AllAgents />} />
            <Route path='/agents/new' element={<NewAgent />} />
            <Route path='/agent/:id' element={<Agent />} />
            
          </Route>
          <Route path='/login' element={<Login />} />
          <Route path='/contract/:id' element={<ShowContract /> } />
          <Route path='/sign_contract/:id' element={<EditContract />} />
          <Route path='/success' element={<Success />} />
          <Route path='/voucher/:id' element={<BookingVoucher />} />
          <Route path='/register' element={<SelfRegister />} />
          <Route path='/upload_license/:id' element={<LicenseUpload />} />
          <Route path='/upload_id/:id' element={<IDUpload />} />
          <Route path='/upload_profile/:id' element={<ProfileUpload />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
