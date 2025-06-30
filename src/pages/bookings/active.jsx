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
import { formatDate } from "date-fns";
import { fetchBookings } from "../../components/bookings/fetch";

export default function ActiveBookings() {
  const bookingData = [];
  const [bookings, setBookings] = useState(bookingData);
  const [alteredData, setAlteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const renderCount = useRef(0);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const bookingUrl = baseUrl + "/api/bookings/active.php";

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (!loggedIn) {
      navigate("/login");
    }
    getBookings();
  }, [bookings]);

  async function getBookings() {
    try {
      const fetchedBookings = await fetchBookings(bookingUrl); 
      console.log("Fetched bookings: ", fetchedBookings);
      bookingData.length = 0; // Clear the bookingData array
      bookingData.push(...fetchedBookings); // Push the fetched bookings into the bookingData array

      setLoading(false);
    } catch (error) {
      const errorMessage = "Error: " + error.message;
      setError(errorMessage);
      console.log(errorMessage);
    }
  }
  // console.log(bookings);


  const handleSearch = (e) => {
    let query = e.target.value;
    const newRecords = bookingData.filter(
      (item) =>
        item.booking_no
          .toLocaleLowerCase()
          .includes(query.toLocaleLowerCase()) ||
        item.client.toLocaleLowerCase().includes(query.toLocaleLowerCase()) ||
        item.vehicle.toLocaleLowerCase().includes(query.toLocaleLowerCase()) ||
        item.number_plate
          .toLocaleLowerCase()
          .includes(query.toLocaleLowerCase()) ||
        item.start_date
          .toLocaleLowerCase()
          .includes(query.toLocaleLowerCase()) ||
        item.end_date.toLocaleLowerCase().includes(query.toLocaleLowerCase())
      // item.rate.toLocaleLowerCase().includes(query.toLocaleLowerCase())
    );
    setBookings(newRecords);
    console.log("Filtered bookings: ", bookings);
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

      {/* Search bar  */}
      {/* <h1 className="text-bold text-center">Vehicles </h1> */}
      <div className="flex justify-end">
        <div class="relative mt-2">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search Bookings..."
            onChange={handleSearch}
          />
        </div>
      </div>

      <BookingTable bookings={bookings} />
    </div>
  );
}
