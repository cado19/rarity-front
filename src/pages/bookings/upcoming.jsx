// This component renders upcoming bookings
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { baseURL } from "../../constants/url";
import Loading from "../../components/PageContent/Loading";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import BookingNav from "../../components/navs/bookingnav";

export default function UpcomingBookings() {
  const columns = [
    {
      name: "No",
      selector: (row) => row.booking_no,
      sortable: true,
    },
    {
      name: "Client",
      selector: (row) => row.client,
      sortable: true,
    },
    {
      name: "Vehicle",
      selector: (row) => row.vehicle,
    },
    {
      name: "Number Plate",
      selector: (row) => row.number_plate,
      sortable: true,
    },
    {
      name: "Start Date",
      selector: (row) => row.start_date,
      sortable: true,
    },
    {
      name: "End Date",
      selector: (row) => row.end_date,
      sortable: true,
    },
    {
      name: "Options",
      cell: (row) => <Link to={`/booking/${row.id}`}>Details</Link>,
    },
  ];
  const [bookings, setBookings] = useState([]);
  const [alteredData, setAlteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const renderCount = useRef(0);
  const bookingUrl = baseURL + "/api/bookings/upcoming.php";

  useEffect(() => {
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
      <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md">
        <Loading />
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
      <DataTable
        columns={columns}
        data={alteredData}
        pagination
        title="Upcoming Bookings"
      />
    </div>
  );
}
