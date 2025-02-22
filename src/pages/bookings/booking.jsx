import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { baseURL } from "../../constants/url";
import { voucherUrl } from "../../constants/url";
import { feUrl } from "../../constants/url";
import BookingInfoBoxes from "../../components/infoboxes/BookingInfoBoxes";
import axios from "axios";
import Extend from "./extend";
import Loading from "../../components/PageContent/Loading";
import Swal from "sweetalert2";

export default function Booking() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [extendInfo, setExtendInfo] = useState(null);
  const bookingUrl = baseURL + `/api/bookings/read_single.php?id=${id}`;
  const contractSignUrl = feUrl + `/sign_contract/${id}`;
  const contractViewURL = feUrl + `/contract/${id}`;
  const bookingVoucherURL = voucherUrl + `/${id}`;

  const navigate = useNavigate();
  const location = useLocation();

  const checkMessage = () => {
    if (location.state) {
      if (location.state.message == "Booking cancelled") {
        Swal.fire({
          title: "Booking Cancelled",
          text: "The booking has been cancelled",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else if (location.state.message == "Booking could not be cancelled") {
        Swal.fire({
          // title: "Booking could not be cancelled",
          text: "The booking could not be cancelled",
          icon: "error",
          confirmButtonText: "OK",
        });
      } else if (location.state.message == "Booking completed") {
        Swal.fire({
          title: "Booking completed",
          text: "The booking has been completed",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else if (location.state.message == "Booking could not be completed") {
        Swal.fire({
          title: "Booking could not be completed",
          // text: "The booking could not been completed",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else if (location.state.message = "Booking updated successfully") {
        Swal.fire({
          title: "Booking updated",
          text: "The booking has been updated",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    }
  };

  // function to handle extend date of booking
  const extendData = (data) => {
    // const data = {id: id, endDate: endDate};
    console.log(data);
  };

  // function to cancel booking
  const cancelBooking = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Cancelling booking",
      confirmButtonText: "Yes",
      denyButtonText: "No",
      showDenyButton: true,
      showConfirmButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/booking/${id}/cancel`);
      }
    });
  };

  // function to complete booking
  const completeBooking = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Completing booking",
      confirmButtonText: "Yes",
      denyButtonText: "No",
      showDenyButton: true,
      showConfirmButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/booking/${id}/complete`);
      }
    });
  };

  const copySignatureLink = () => {
    navigator.clipboard.writeText(contractSignUrl);
    Swal.fire({
      title: "Link copied",
      text: "Signature link has been copied to your clipboard",
      icon: "success",
      confirmButtonText: "OK",
    });
  };
  const copyVoucherLink = () => {
    navigator.clipboard.writeText(bookingVoucherURL);
    Swal.fire({
      title: "Link copied",
      text: "Voucher link has been copied to your clipboard",
      icon: "success",
      confirmButtonText: "OK",
    });
  };
  const copyContractLink = () => {
    navigator.clipboard.writeText(contractViewURL);
    Swal.fire({
      title: "Link copied",
      text: "Contract link has been copied to your clipboard",
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  // function to get booking data
  const getBooking = async () => {
    try {
      await axios.get(bookingUrl).then((response) => {
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
    checkMessage();
  }, []);

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
    <div>
      <Extend
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        id={id}
        onSubmit={extendData}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      />

      <h2 className="text-2xl">Booking: {booking.booking_no}</h2>
      <BookingInfoBoxes
        fname={booking.c_fname}
        lname={booking.c_lname}
        start={booking.start_date}
        end={booking.end_date}
      />
      <div className="flex flex-row gap-4 mt-2 ml-2 mr-1 overflow-hidden">
        {/* Booking details  */}
        <div className="w-[50rem] h-[25rem] bg-white p-4 rounded-sm border border-gray flex flex-col">
          <p className="leading-loose text-center">
            <span className="font-bold">Vehicle:</span> {booking.make}{" "}
            {booking.model} {booking.number_plate}
          </p>
          <p className="leading-loose text-center">
            <span className="font-bold">Rate:</span>{" "}
            {booking.custom_rate > 0 ? (
              <span>
                <span className="line-through text-gray-400">
                  {booking.daily_rate}
                </span>{" "}
                <span>{booking.custom_rate}</span>
              </span>
            ) : (
              <span>{booking.daily_rate}</span>
            )}
            /-
          </p>
          <p className="leading-loose text-center">
            <span className="font-bold">Total:</span> {booking.total}/-
          </p>
          <p className="leading-loose text-center">
            <span className="font-bold">Status:</span> {booking.status}
          </p>
          <p className="leading-loose text-center">
            <span className="font-bold">Driver:</span> {booking.d_fname}{" "}
            {booking.d_lname}
          </p>
          <p className="leading-loose text-center">
            <span className="font-bold">Start Time:</span> {booking.start_time}
          </p>
          <p className="leading-loose text-center">
            <span className="font-bold">End Time:</span> {booking.end_time}
          </p>
          <hr />
          <div className="flex flex-row gap-4 w-full mt-10">
            {booking.status == "upcoming" && (
              <button className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-bold py-2 px-4 rounded transition duration-300">
                Activate Booking
              </button>
            )}
            {booking.status == "active" && (
              <button
                className="border border-gray-800 text-gray-800 dark:border-gray-400 dark:text-gray-400 hover:bg-gray-800 hover:text-white dark:hover:bg-gray-400 dark:hover:text-gray-800 font-bold py-2 px-4 rounded transition duration-300"
                onClick={() => setIsModalOpen(true)}
              >
                Extend Booking
              </button>
            )}
            <button
              className="border border-green-700 text-green-700 hover:bg-green-700 hover:text-white font-bold py-2 px-4 rounded transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-400 dark:hover:text-black"
              onClick={() => navigate(`/bookings/edit/${id}`)}
            >
              Edit Booking
            </button>
            {booking.status != "cancelled" && (
              <button
                className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-bold py-2 px-4 rounded transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-400 dark:hover:text-black"
                onClick={() => cancelBooking()}
              >
                Cancel Booking
              </button>
            )}
            {booking.status == "active" && (
              <button
                className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-bold py-2 px-4 rounded transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-400 dark:hover:text-black"
                onClick={() => completeBooking()}
              >
                Complete Booking
              </button>
            )}
          </div>
        </div>

        {/* Contract details  */}
        <div className="h-[25rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col flex-1">
          <h1 className="2xl">Contract Details</h1>
          <p>
            This is a contract of a booking between the renter{" "}
            <span className="font-bold">Rarity rental</span> and client{" "}
            <span className="font-bold">
              {booking.c_fname} {booking.c_lname}
            </span>
          </p>
          <p className="mt-2">
            Contract status is{" "}
            <span className="font-bold">{booking.ct_status}</span>
          </p>
          <button
            className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-bold mt-2 py-2 px-4 rounded transition duration-300"
            onClick={() => copyVoucherLink()}
          >
            Copy voucher link
          </button>
          <button
            className="border border-gray-800 text-gray-800 dark:border-gray-400 dark:text-gray-400 hover:bg-gray-800 hover:text-white dark:hover:bg-gray-400 dark:hover:text-gray-800 font-bold mt-2 py-2 px-4 rounded transition duration-300"
            onClick={() => copyContractLink()}
          >
            Copy contract link
          </button>
          {booking.ct_status == "unsigned" && (
            <button
              className="border border-green-700 text-green-700 hover:bg-green-700 hover:text-white font-bold mt-2 py-2 px-4 rounded transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-400 dark:hover:text-black"
              onClick={() => copySignatureLink()}
            >
              Sign contract link
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
