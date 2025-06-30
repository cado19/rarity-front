import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaCalendarPlus, FaCalendar } from "react-icons/fa";
import { BsPersonPlusFill } from "react-icons/bs";
import { BiSolidBadgeDollar } from "react-icons/bi";
import { Tooltip } from "react-tooltip";
import { userUrl } from "../../constants/url";
import Swal from "sweetalert2";

export default function Header() {
  // Get the user's name from local storage
  const [isOpen, setIsOpen] = useState(false);

  const userData = localStorage.getItem("user");
  const userName = userData ? JSON.parse(userData).name : "Guest";
  const userId = userData ? JSON.parse(userData).id : null;

  const newCustomerUrl = userUrl  + "/new"
  

  const copyNewCustomerURL = () => {
    navigator.clipboard.writeText(newCustomerUrl);
    Swal.fire({
      title: "Link copied",
      text: "New Customer Link copied to clipboard",
      icon: "success",
      confirmButtonText: "OK",
    });
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-white h-16 px-4 flex justify-end items-center border-b border-gray-200">
      {/* Utility Links  */}
      <div className="flex items-center space-x-4 mr-5">
        <Link
          to="/bookings/new"
          data-tooltip-id="new-booking-tooltip"
          data-tooltip-content="New Booking"
          className="text-gray-700 hover:text-blue-500inline-flex justify-center"
          rel="New booking"
        >
          <FaCalendarPlus size={14} />
        </Link>

        <Link
          to="/bookings/upcoming"
          data-tooltip-id="upcoming-booking-tooltip"
          data-tooltip-content="Reservations"
          className="text-gray-700 hover:text-blue-500inline-flex justify-center"
          rel="Upcoming bookings">
          <FaCalendar size={14} />
        </Link>

        <Link
          to="/vehicle/edit_rate"
          data-tooltip-id="change-rate-tooltip"
          data-tooltip-content="Change category rate"
          className="text-gray-700 hover:text-blue-500inline-flex justify-center"
          rel="Upcoming bookings">
          <BiSolidBadgeDollar size={15} />
        </Link>

        <div className="relative inline-block text-left">
          <button onClick={() => setIsOpen(!isOpen)} className="mt-1 " data-tooltip-id="new-customer-tooltip" data-tooltip-content="New Customer">
            <BsPersonPlusFill size={15} />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                <Link
                  onClick={() => setIsOpen(false)}
                  to="/customer/new"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Add User
                </Link>
                <button
                  onClick={copyNewCustomerURL}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Copy Link
                </button>
              </div>
            </div>
          )}
        </div>

 
      </div>
      {/* Display the user's name on the right side */}
      <div className="text-gray-700">
        <Link to={`/agent/${userId}`}>{userName}</Link>
      </div>
      <Tooltip id="new-booking-tooltip" place="bottom" />
      <Tooltip id="upcoming-booking-tooltip" place="bottom" />
      <Tooltip id="new-customer-tooltip" place="bottom" />
      <Tooltip id="change-rate-tooltip" place="bottom" />
    </div>
  );
}
