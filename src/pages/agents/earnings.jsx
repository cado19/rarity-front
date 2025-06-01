import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Mosaic } from "react-loading-indicators";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Earnings() {
  const { id } = useParams();

  const [totComm, setTotComm] = useState(null); // total commission in the month
  const [bookings, setBookings] = useState([]);
  const [agent, setAgent] = useState(null);
  const [hasMore, setHasMore] = useState(true); // Tracks whether more data is available
  const [page, setPage] = useState(1); // Tracks the current page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const earningsURL =
    baseUrl + `/api/commissions/earned_commissions.php?agent_id=${id}`;
  const agentURL = baseUrl + `/api/agents/read_single.php?id=${id}`;

  const getEarnings = async () => {
    try {
      const response = await axios.get(earningsURL);
      console.log(response);
      if (response.data.status === "Error") {
        setError(response.data.message);
        setLoading(false);
        return;
      }
      const bookingData = response.data.bookings;
      setBookings(bookingData);
      setTotComm(response.data.total_commission);
      console.log(response);
      setLoading(false);
    } catch (error) {
      console.log("error fetching earnings: ", error.message);
    }
  };

  const getMoreEarnings = async () => {
    try {
      const response = await axios.get(earningsURL);
      const bookingData = response.data.bookings;
      console.log(bookingData);
      if (bookingData.length === 0) {
        setHasMore(false);
      } else {
        setBookings((prev) => [...prev, ...bookingData]); // Append new data
        setPage((prev) => prev + 1); // Increment page
      }
      setTotComm(response.data.total_commission);
      console.log(response);
      setLoading(false);
    } catch (error) {
      console.log("error fetching earnings: ", error.message);
    }
  };

  const getAgent = async () => {
    try {
      const response = await axios.get(agentURL);
      console.log(response);
      setAgent(response.data.agent);
      // setLoading(false);
    } catch (error) {
      const errorMessage = error.message;
      setError(errorMessage);
    }
  };

  useEffect(() => {
    getAgent();
    getEarnings();
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
      <div className="bg-white p-4 rounded-lg shadow-md w-full flex items-center justify-center h-full">
        <h1 className="text-red-500 text-4xl">{error}</h1>
      </div>
    );
  }

  return (
    <>
      <div className="w-full p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Earnings Overview</h2>
        <p className="text-gray-700 mb-2">Agent Name: {agent.name}</p>
        <p className="text-gray-700 mb-2">Total Bookings: 50</p>
        <p className="text-gray-700 mb-2">
          Total Earnings: {Number(totComm).toLocaleString()}/-
        </p>
      </div>
      <div className="w-full p-4 bg-white rounded-lg shadow-md mt-4">
        <h2 className="text-xl font-bold mb-4">Bookings</h2>
        <InfiniteScroll
          dataLength={bookings.length}
          next={getMoreEarnings}
          hasMore={hasMore}
          loader={
            <Mosaic
              color="#32cd32"
              size="small"
              text="Loading more..."
              textColor=""
            />
          }
        >
          {bookings &&
            bookings.map((booking) => (
              <p key={booking.id} className="border p-4 rounded-lg space-y-2 mb-4">
                <p className="font-semibold">
                  Booking No: {booking.booking_no}
                </p>
                <p>Total: {Number(booking.total).toLocaleString()}/-</p>
                <p>
                  Commission Earned:{" "}
                  {Number(booking.commission).toLocaleString()}/-
                </p>
              </p>
            ))}
        </InfiniteScroll>
      </div>
    </>
  );
}
