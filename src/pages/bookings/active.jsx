// This component renders active bookings
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { baseURL } from "../../constants/url";
import Loading from "../../components/PageContent/Loading";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { Mosaic } from "react-loading-indicators";
import BookingNav from "../../components/navs/bookingnav";
import BookingTable from "../../components/bookings/table";

export default function ActiveBookings() {


  const [bookings, setBookings] = useState([]);
  const [alteredData, setAlteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const renderCount = useRef(0);
  const bookingUrl = baseURL + "/api/bookings/active.php";

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (!loggedIn) {
      navigate("/login");
    }
    getBookings();
  }, [loading]);

  async function getBookings() {
    try {
      const response = await axios.get(bookingUrl);
      setBookings(response.data.bookings);
      formatBookings();
      // console.log(response);

      setLoading(false);
    } catch (error) {
      const errorMessage = "Error: " + error.message;
      setError(errorMessage);
      console.log(errorMessage);
    }
  }
  // console.log(bookings);

  // function to alter the data format a bit
  function formatBookings() {
    const alteredData =
      bookings &&
      bookings.map((booking) => {
        return {
          ...booking,
          id: booking.id,
          no: booking.booking_no,
          client: booking.c_fname + " " + booking.c_lname,
          vehicle: booking.make + " " + booking.model,
          number_plate: booking.number_plate,
          start_date: booking.start_date,
          end_date: booking.end_date,
        };
      });
    setAlteredData(alteredData);
  }

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
      {/* <h1 className="text-2xl font-bold mb-4">Active Bookings</h1> */}
      <BookingTable bookings={alteredData} />
    </div>
  );
}
