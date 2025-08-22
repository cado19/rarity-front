// This component renders upcoming bookings
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "date-fns";
import { Mosaic } from "react-loading-indicators";
import BookingNav from "../../components/navs/bookingnav";
import BasicTable from "../../components/utility/basicTable";
import { bookingColumns } from "../../components/utility/tableColumns";
import { fetchUpcomingBookings } from "../../api/fetch";

export default function UpcomingBookings() {
  const [bookings, setBookings] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const renderCount = useRef(0);

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (!loggedIn) {
      navigate("/login");
    }
    getBookings();
  }, []);

  // fetch the bookings
  const getBookings = async () => {
    try {
      const response = await fetchUpcomingBookings();
      const bookingData = response.data.data.map((booking) => ({
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
    <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md mt-2 mx-3">
      <BookingNav />
      {/* <h1 className="text-bold text-center">Vehicles </h1> */}
     <h1 className="text-3xl font-bold text-end text-yellow-600 tracking-wide mb-4 mt-2">
        Upcoming Bookings
      </h1>
      <BasicTable
        data={bookings}
        columns={bookingColumns}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
    </div>
  );
}
