import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { baseURL } from "../../constants/url";
import axios from "axios";
import Loading from "../../components/PageContent/Loading";
import NewRate from "./newrate";
import Swal from "sweetalert2";

export default function Driver() {
  const { id } = useParams();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [rate, setRate] = useState(0);
  const [role, setRole] = useState(null);
  const [bookings, setBookings] = useState([]); // upcoming bookings of driver
  const [bookingError, setBookingError] = useState(null);

  // get category data on load
  const locationOptions = [
    { value: "rate_in_capital", label: "In Nairobi" },
    { value: "rate_out_capital", label: "Outside Nairobi" },
  ];

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const driverURL = baseUrl + `/api/drivers/read_single.php?id=${id}`;
  const rateURL = baseUrl + `/api/drivers/update_rate.php`;
  // const driverBookingsURL = baseUrl + "/api/drivers/bookings.php";

  const getRole = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setRole(user.role_id);
    } else {
      setRole(null);
    }
  };

  const getDriver = async () => {
    try {
      await axios.get(driverURL).then((response) => {
        console.log(response);
        setDriver(response.data.driver);
        if (response.data.booking_status === "Error") {
          setBookingError("Driver has no bookings");
        } else {
          setBookings(response.data.bookings);
        }
        setLoading(false);
      });
    } catch (error) {
      const errorMessage = error.message;
      setError(errorMessage);
    }
  };

  useEffect(() => {
    getDriver();
    getRole();
  }, []);

  // handle submit for rate
  const handleRateSubmit = async (data) => {
    setRateModalOpen(false);
    console.log("Rate submitted: ", data);
    try {
      const response = await axios.post(rateURL, data);
      console.log(response);
      Swal.fire({
        title: response.data.status,
        text: response.data.message,
        icon: response.data.status.toString().toLowerCase(),
        confirmButtonText: "OK",
      });
    } catch (error) {
      const errorMessage = error.message;
      setError(errorMessage);
      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  //format dl expiry date
  const dl_expiry_date = new Date(driver?.dl_expiry);
  const birth_date = new Date(driver?.date_of_birth);
  if (error) {
    return (
      <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md">
        {error}
      </div>
    );
  }
  if (loading) {
    return (
      <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <div className=" rounded overflow-hidden shadow-lg flex flex-row bg-white">
        <div className="flex items-center justify-center">
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">Driver Details</div>{" "}
            <p className="text-gray-700 text-base">
              {" "}
              <span className="font-bold"> Name:</span> {driver.first_name}{" "}
              {driver.last_name}.{" "}
            </p>{" "}
            <p className="text-gray-700 text-base">
              {" "}
              <span className="font-bold">Email:</span> {driver.email}.{" "}
            </p>{" "}
            <p className="text-gray-700 text-base">
              {" "}
              <span className="font-bold">Tel:</span> {driver.phone_no}.{" "}
            </p>{" "}
            <p className="text-gray-700 text-base">
              {" "}
              <span className="font-bold">ID Number:</span> {driver.id_no}.{" "}
            </p>{" "}
            <p className="text-gray-700 text-base">
              {" "}
              <span className="font-bold">DL Number:</span> {driver.dl_no}.{" "}
            </p>{" "}
            <p className="text-gray-700 text-base">
              {" "}
              <span className="font-bold">DL Expiry:</span>{" "}
              {dl_expiry_date.toString()}.{" "}
            </p>{" "}
            <p className="text-gray-700 text-base">
              {" "}
              <span className="font-bold">Date of Birth:</span>{" "}
              {birth_date.toString()}.{" "}
            </p>{" "}
            <p className="text-gray-700 text-base m-4">
              {" "}
              <button
                className="border border-gray-800 text-gray-800 dark:border-gray-400 dark:text-gray-400 hover:bg-gray-800 hover:text-white dark:hover:bg-gray-400 dark:hover:text-gray-800 font-bold py-2 px-4 mt-3 rounded transition duration-300"
                onClick={() => setRateModalOpen(true)}
              >
                Set Rate
              </button>
            </p>{" "}
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="px-6 py-4 ml-4">
            <p className="text-lg"><b>Rate in Nairobi:</b> {" "} {driver.rate_in_capital}/-</p>
            <p className="text-lg"><b>Rate outside Nairobi:</b> {" "} {driver.rate_out_capital}/-</p>
          </div>
        </div>

        <NewRate
          show={rateModalOpen}
          onClose={() => setRateModalOpen(false)}
          onSubmit={handleRateSubmit}
          driverId={id}
          locationOptions={locationOptions}
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0.9, y: -100 },
          }}
        />
      </div>
      <div className=" rounded overflow-hidden shadow-lg flex flex-row bg-white">
          <div className="px-6 py-4">
            {bookingError ? (
              <h2 className="text-red-500 text-lg font-bold">{bookingError}</h2>
            ) : (
              <>
                <h2 className="text-lg font-bold mb-4">Upcoming Bookings</h2>
                
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="border border-gray-300 rounded p-4 mb-4"
                    >
                      <p>
                        <span className="font-bold">Booking ID:</span>{" "}
                        {booking.booking_no}
                      </p>
                      <p>
                        <span className="font-bold">Vehicle:</span>{" "}
                        {booking.vehicle}
                      </p>
                      
                      <p>
                        <span className="font-bold">Pickup Date:</span>{" "}
                        {new Date(booking.start_date).toLocaleDateString()}
                      </p>
                      <p>
                        <span className="font-bold">Dropoff Date:</span>{" "}
                        {new Date(booking.end_date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                 
              </>
            )}
          </div>
      </div>
    </>
  );
}
