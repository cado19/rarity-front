import React from "react";
import axios from "axios";
import { formatDate } from "date-fns";

export async function fetchBookings(url) {
  try {
    const response = await axios.get(url);
    const bookingData = response.data.bookings.map((booking) => ({
      id: booking.id,
      booking_no: booking.booking_no,
      client: booking.c_fname + " " + booking.c_lname,
      vehicle: booking.make + " " + booking.model,
      number_plate: booking.number_plate,
      start_date: formatDate(new Date(booking.start_date), "do MMMM yyyy"),
      end_date: formatDate(new Date(booking.end_date), "do MMMM yyyy"),
    }));


    return bookingData;
  } catch (error) {
    const errorMessage = "Error: " + error.message;
    console.log(errorMessage);
    throw new Error(errorMessage);
  }
}
