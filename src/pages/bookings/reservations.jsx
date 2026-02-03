import React, { useEffect, useRef, useState } from "react";

import { Link } from "react-router-dom";
import { formatDate } from "date-fns";
import { Mosaic } from "react-loading-indicators";
import BookingNav from "../../components/navs/bookingnav";
import BasicTable from "../../components/utility/basicTable";
import { fetchReservations } from "../../api/fetch";
import { reservationColumns } from "../../components/utility/tableColumns";

export default function Reservations() {
  const bookingData = [];
  const [reservations, setReservations] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getReservations = async () => {
    try {
      const response = await fetchReservations();
      console.log(response);
      const reservationData = response.data.data.map((reservation) => ({
        id: reservation.id,
        client: reservation.client,
        category: reservation.category,
        start_date: formatDate(new Date(reservation.start_date), "do MMMM yyyy"),
        end_date: formatDate(new Date(reservation.end_date), "do MMMM yyyy"),
      }));
      setReservations(reservationData);
    } catch (error) {
      const errorMessage = "Error: " + error.message;
      setError(errorMessage);
      console.log(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReservations();
  }, []);

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
          All Reservations
        </h1>

        {/* <BookingTable bookings={bookings} /> */}
        <BasicTable
          data={reservations}
          columns={reservationColumns}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
        />
      </div>
    </>
  );;
}
