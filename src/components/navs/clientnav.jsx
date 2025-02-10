import React from "react";
import { NavLink } from "react-router-dom";

export default function ClientNav() {
  const activeLink = `inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500`;
  const inActiveLink = `inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300`;

  const classNameFunc = ({ isActive }) =>
    isActive ? activeLink : inActiveLink;
  return (
    <div>
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <ul class="flex flex-wrap -mb-px">
          <li class="me-2">
            <NavLink to="/customers" className={classNameFunc}>
              All
            </NavLink>
          </li>
          <li className="me-2">
            <NavLink to="/recent_clients" className={classNameFunc}>
              Recent
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}
