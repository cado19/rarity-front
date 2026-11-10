// This component renders upcoming bookings
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "date-fns";
import Swal from "sweetalert2";
import { Mosaic } from "react-loading-indicators";
import BookingNav from "../../components/navs/bookingnav";
import BasicTable from "../../components/utility/basicTable";
import { bookingColumns } from "../../components/utility/tableColumns";
import { fetchUpcomingBookings } from "../../api/fetch";
import { activateBookings } from "../../api/put";

export default function UpcomingBookings() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const roles = user?.roles?.map((r) => r.name) || []; // roles array from localStorage

  const [bookings, setBookings] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({}); // For selecting a row
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const renderCount = useRef(0);

  // Custom columns to help us with multiselect
  const bookingColumnsWithSelection = [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    },
    ...bookingColumns,
  ];

  const handleBulkActivate = async () => {
    if (selectedBookingIds.length === 0) return;

    const decision = await Swal.fire({
      title: "Activate Bookings?",
      text: `${selectedBookingIds.length} bookings will be activated.`,
      icon: "question",
      showCancelButton: true,
    });

    if (!decision.isConfirmed) return;

    const result = await activateBookings(selectedBookingIds);

    if (result.status === "Success") {
      Swal.fire({
        title: "Success",
        text: result.message,
        icon: "success",
      });

      getBookings();
      setRowSelection({});
    }
  };

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

      let bookings = response.data.data;

      if (roles.includes("salesperson")) {
        bookings = bookings.filter((b) => b.agent_id === userId);
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

  const selectedBookingIds = Object.keys(rowSelection)
    .filter((key) => rowSelection[key])
    .map((key) => bookings[key]?.id);

  return (
    <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md mt-2 mx-3">
      <BookingNav />
      {/* <h1 className="text-bold text-center">Vehicles </h1> */}
      <h1 className="text-3xl font-bold text-end text-yellow-600 tracking-wide mb-4 mt-2">
        Upcoming Bookings
      </h1>
      {selectedBookingIds.length > 0 && (
        <button
          onClick={handleBulkActivate}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Activate Selected ({selectedBookingIds.length})
        </button>
      )}
      <BasicTable
        data={bookings}
        columns={bookingColumnsWithSelection}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />
    </div>
  );
}
