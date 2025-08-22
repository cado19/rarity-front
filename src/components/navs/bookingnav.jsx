import React from "react";
import { NavLink } from "react-router-dom";

export default function BookingNav() {
  const activeLink = `inline-block p-4 text-yellow-600 border-b-2 border-yellow-600 rounded-t-lg active dark:text-yellow-500 dark:border-yellow-500`;
  const inActiveLink = `inline-block p-4 text-yellow-500 border-b-2 border-transparent rounded-t-lg hover:text-yellow-600 hover:border-yellow-400 dark:text-yellow-400 dark:hover:text-yellow-300`;

  const classNameFunc = ({ isActive }) =>
    isActive ? activeLink : inActiveLink;
  return (
    <div>
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <ul class="flex flex-wrap -mb-px">
          <li class="me-2">
            <NavLink to="/bookings/all" className={classNameFunc}>
              All
            </NavLink>
          </li>
          <li className="me-2">
            <NavLink to="/bookings/active" className={classNameFunc}>
              Active
            </NavLink>
          </li>
          <li className="me-2">
            <NavLink to="/bookings/upcoming" className={classNameFunc}>
              Upcoming
            </NavLink>
          </li>
          <li cclassNamelass="me-2">
            <NavLink to="/bookings/cancelled" className={classNameFunc}>
              Cancelled
            </NavLink>
          </li>
          <li cclassNamelass="me-2">
            <NavLink to="/bookings/completed" className={classNameFunc}>
              Completed
            </NavLink>
          </li>
          <li cclassNamelass="me-2">
            <NavLink to="/bookings/new" className={classNameFunc}>
              Create Booking
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}
