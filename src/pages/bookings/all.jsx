// This component renders all bookings
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { baseURL } from "../../constants/url";

import { Link } from "react-router-dom";
import { formatDate } from "date-fns";
import { Mosaic } from "react-loading-indicators";
import BookingNav from "../../components/navs/bookingnav";
import BookingTable from "../../components/bookings/table";
import BasicTable from "../../components/utility/basicTable";
import { bookingColumns } from "../../components/utility/tableColumns";
import { fetchBookings } from "../../api/fetch";

export default function AllBookings() {
  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData.id;
  const roleId = userData.role_id;
  const [bookings, setBookings] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getBookings();
  }, []);

  const getBookings = async () => {
    try {
      const response = await fetchBookings();
      // console.log(response);
      // raw bookings from backend
      let bookings = response.data.data;

      // filter only if roleId is not 0
      if (roleId !== "0") {
        bookings = bookings.filter((booking) => booking.agent_id === userId);
      }

      const bookingData = bookings.map((booking) => ({
        id: booking.id,
        booking_no: booking.booking_no,
        client: booking.client,
        vehicle: booking.vehicle,
        number_plate: booking.number_plate,
        start_date: formatDate(new Date(booking.start_date), "do MMMM yyyy"),
        end_date: formatDate(new Date(booking.end_date), "do MMMM yyyy"),
      }));
      setBookings(bookingData);
    } catch (error) {
      const errorMessage = "Error: " + error.message;
      setError(errorMessage);
      console.log(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  // console.log(bookings);
  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md w-full flex items-center justify-center h-full">
        <Mosaic color="#32cd32" size="large" text="Loading..." textColor="" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md">
        <h1 className="text-bold text-center">Error</h1>
        <p className="text-center">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md mt-2 mx-3">
        <BookingNav />

        <h1 className="text-3xl font-bold text-end text-yellow-600 tracking-wide mb-4 mt-2">
          All Bookings
        </h1>

        {/* <BookingTable bookings={bookings} /> */}
        <BasicTable
          data={bookings}
          columns={bookingColumns}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
        />
      </div>
    </>
  );
}
