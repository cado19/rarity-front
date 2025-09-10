import React from 'react'
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom'
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
import NewBooking from '../../pages/bookings/new'
import EditBooking from '../../pages/bookings/edit'
import CancelBooking from '../bookings/cancel'
import CompleteBooking from '../bookings/complete'
import Booking from '../../pages/bookings/booking'
import NewCustomer from '../../pages/customers/new'
import Login from '../../pages/accounts/login'
import ShowContract from '../../pages/contracts/show'
import EditContract from '../../pages/contracts/edit'
import Success from '../../pages/utilities/success'
import RecentCustomers from '../../pages/customers/recent'
import BookingVoucher from '../../pages/bookings/voucher'
import SelfRegister from '../../pages/customers/self_register'
import LicenseUpload from '../../pages/customers/license_upload'
import IDUpload from '../../pages/customers/id_upload'
import ProfileUpload from '../../pages/customers/profile_upload'
import AllDrivers from '../../pages/drivers/all'
import NewDriver from '../../pages/drivers/new'
import AllAgents from '../../pages/agents/all'
import NewAgent from '../../pages/agents/new'
import Agent from '../../pages/agents/agent'
import Driver from '../../pages/drivers/driver'
import NewVehicle from '../../pages/vehicles/new'
import Calen from '../../pages/Dashboard/calen'
import NotFound from '../../pages/utilities/404'
import Analytics from '../../pages/analytics'
import ActivateBooking from '../bookings/activate'
import Logout from '../../pages/accounts/logout'
import Earnings from '../../pages/agents/earnings'
import VehicleAnalytics from '../../pages/analytics/vehicle'
import MonthStats from '../../pages/analytics/vehicle/monthstats'
import AllPayments from '../../pages/payments/all'
import WorkPlan from '../../pages/drivers/workplan'
import EditRate from '../../pages/vehicles/edit_rate'
import EditBasics from '../../pages/vehicles/edit_basics'
import EditExtras from '../../pages/vehicles/edit_extras'
import AllIssues from '../../pages/issues/all'
import NewIssue from '../../pages/issues/new'
import Issue from '../../pages/issues/issue'
import EditCustomer from '../../pages/customers/edit'


export default function AppRouter() {
  return (
    <div>
      <HashRouter>
        <Routes>
          <Route path='/' element={<PageContent />}>
            <Route index element={<Dashboard />} />
            <Route path='/calen' element={<Calen />} />
            {/* Vehicle Routes  */}
            <Route path='/vehicles' element={<AllVehicles />} />
            <Route path='/vehicle/:id' element={<Vehicle />} />
            <Route path='/vehicle/new' element={<NewVehicle />} />
            <Route path='/vehicle/edit_rate' element={<EditRate />} />
            <Route path='/vehicle/edit_basics/:id' element={<EditBasics />} />
            <Route path='/vehicle/edit_extras/:id' element={<EditExtras />} />
            <Route path='/issues' element={<AllIssues />} />
            <Route path='/issues/new' element={<NewIssue />}  />
            <Route path='/issues/:id' element={<Issue />} />

            {/* Customer Routes  */}
            <Route path='/customers' element={<AllCustomers />} />
            <Route path='/recent_clients' element={<RecentCustomers />} />
            <Route path='/customer/:id' element={<Customer />} />
            <Route path='/customer/new' element={<NewCustomer />} />
            <Route path='/customer/edit/:id' element={<EditCustomer />} />

            {/* Driver Routes  */}
            <Route path='/drivers' element={<AllDrivers />} />
            <Route path='/driver/new' element={<NewDriver />} />
            <Route path='/driver/:id' element={<Driver />} />
            <Route path='/driver/workplan' element={<WorkPlan />} />

            {/* Booking Routes  */}
            <Route path='/bookings/all' element={<AllBookings />} />
            <Route path='/bookings/active' element={<ActiveBookings />} />
            <Route path='/bookings/completed' element={<CompletedBookings />} />
            <Route path='/bookings/upcoming' element={<UpcomingBookings />} />
            <Route path='/bookings/cancelled' element={<CancelledBookings />} />
            <Route path='/bookings/new' element={<NewBooking />} />
            <Route path='/bookings/edit/:id' element={<EditBooking />} />
            <Route path='/booking/:id' element={<Booking />} />
            <Route path='/booking/:id/cancel' element={<CancelBooking />} />
            <Route path='/booking/:id/complete' element={<CompleteBooking />} />
            <Route path='/booking/:id/activate' element={<ActivateBooking />} />
            <Route path='/bookings/voucher/:id' element={<BookingVoucher />} />

            {/* Agent Routes  */}
            <Route path='/agents' element={<AllAgents />} />
            <Route path='/agents/new' element={<NewAgent />} />
            <Route path='/agent/:id' element={<Agent />} />
            <Route path='/agent/:id/earnings' element={<Earnings />}/>

            {/* Analytic Routes  */}
            <Route path='/analytics' element={<Analytics />} />
            <Route path='/analytics/vehicle' element={<VehicleAnalytics />} />
            <Route path='/analytics/vehicle/month-stats' element={<MonthStats />} />

            {/* Payment Routes  */}
            <Route path='/payments' element={<AllPayments />} />
            
          </Route>
          <Route path='*' element={<NotFound />} />
          <Route path='/login' element={<Login />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/contract/:id' element={<ShowContract /> } />
          <Route path='/sign_contract/:id' element={<EditContract />} />
          <Route path='/success' element={<Success />} />
          <Route path='/voucher/:id' element={<BookingVoucher />} />
          <Route path='/register' element={<SelfRegister />} />
          <Route path='/upload_license/:id' element={<LicenseUpload />} />
          <Route path='/upload_id/:id' element={<IDUpload />} />
          <Route path='/upload_profile/:id' element={<ProfileUpload />} />
        </Routes>
      </HashRouter>
    </div>
  )
}
