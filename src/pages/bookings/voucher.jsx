import React, { useEffect, useState } from "react";
import Logo from "../../assets/rarity_logo.png";
import { baseURL } from "../../constants/url";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loading from "../../components/PageContent/Loading";
import FormattedDate from "../../components/PageContent/formattedDate";
export default function BookingVoucher() {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { id } = useParams();

  const bookingURL = baseURL + `/api/bookings/voucher.php?id=${id}`;

  const getBooking = async () => {
    try {
      await axios.get(bookingURL).then((response) => {
        console.log(response);
        setBooking(response.data.booking);
        setLoading(false);
      });
    } catch (error) {
      const errorMessage = "Error: " + error.message;
      setError(errorMessage);
    }
  };

  useEffect(() => {
    getBooking();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div>
          <img src={Logo} />
        </div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div>
        <img src={Logo} />
      </div>
      <div className="leading-loose">
        <p>
          <span className="font-bold">Booking No: </span> {booking.booking_no}
        </p>
        <p>
          <span className="font-bold">Name: </span>
          {booking.c_fname} {booking.c_lname}
        </p>
        <p>
          <span className="font-bold">Vehicle: </span>
          {booking.make} {booking.model}
        </p>
        <p>
          <span className="font-bold">Registration: </span>
          {booking.number_plate}
        </p>
        <p>
          <span className="font-bold">Rate: </span>
          {booking.daily_rate}
        </p>
        <p>
          <span className="font-bold">Total: </span>
          {booking.number_plate}
        </p>
        <p>
          <span className="font-bold">Start Date: </span>{" "}
          <FormattedDate date={booking.start_date} />
        </p>
        <p>
          <span className="font-bold">End Date: </span>
          <FormattedDate date={booking.end_date} />
        </p>
        <p>
          <span className="font-bold">Start Time: </span>
          {booking.start_time}
        </p>
        <p>
          <span className="font-bold">End Time: </span>
          {booking.end_time}
        </p>
      </div>
      <div className="border-2 border-black rounded-md p-2">
        <h3 className="font-bold text-center">PAYMENT DETAILS: </h3>

        <p>
          <b>BANK NAME:</b> NCBA BANK
        </p>
        <p>
          <b>BRANCH:</b> WESTLANDS MALL
        </p>
        <p>
          <b>Account Name:</b> SESOM VENTURES LTD
        </p>
        <p>
          <b>ACCOUNT NUMBER:</b> 8468960011 (KES)
        </p>
        <p>
          <b>ACCOUNT NUMBER:</b> 8468960027 (USD)
        </p>
        <p>
          <b>S.W.I.F.T BIC:</b> CBAFKENX
        </p>
        <p>
          <b>BRANCH CODE:</b> 105
        </p>
        <p>
          <b>MPESA PAYBILL:</b> 400200
        </p>
        <p>
          <b>ACCOUNT:</b> 40044610
        </p>

        <p>
          <b>SECURE ONLINE PAYMENT PORTAL: </b>
        <a
          href="https://payments.pesapal.com/rarityrentacar"
          className="border border-green-500 text-green-500 bg-transparent hover:bg-green-500 hover:text-white font-bold py-2 px-4 rounded"
          target="_blank"
        >
          Pay Now
        </a>
        </p>

      </div>
    </div>
  );
}
