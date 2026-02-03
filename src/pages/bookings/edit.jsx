import React, { useEffect, useState } from "react";
import Select from "react-select";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import {
  fetchBooking,
  fetchBookingDrivers,
  get_booking_vehicles,
} from "../../api/fetch";
import { save_booking } from "../../api/post";
import Loading from "../../components/PageContent/Loading";
import BookingNav from "../../components/navs/bookingnav";
import { update_booking_details } from "../../api/put";

export default function EditBooking() {
  const { id } = useParams(); // booking id from route
  const navigate = useNavigate();

  // Helpers
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${year}-${month}-${day}`;
  };

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const suffix = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes} ${suffix}`;
  };

  // get userId from local storage to set as accountId
  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData.id;

  // State
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [inputs, setInputs] = useState({
    account_id: userId,
    customer_id: "",
    vehicle_id: "",
    driver_id: "",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    custom_rate: "",
  });
  const [customerName, setCustomerName] = useState(""); // display only
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);

  // Handlers
  const handleChange = (eOrName, maybeValue) => {
    if (typeof eOrName === "string") {
      setInputs((prev) => ({ ...prev, [eOrName]: maybeValue }));
    } else {
      const { name, value } = eOrName.target;
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDateTimeChange = (setter, field, value, type = "date") => {
    setter(value);
    setInputs((prev) => ({
      ...prev,
      [field]: type === "date" ? formatDate(value) : formatTime(value),
    }));
  };

  // Fetch booking + dropdowns
  useEffect(() => {
    const loadData = async () => {
      try {
        const [bookingRes, dRes, vRes] = await Promise.all([
          fetchBooking(id),
          fetchBookingDrivers(),
          get_booking_vehicles(),
        ]);

        const booking = bookingRes.data.booking;

        // Populate inputs
        setInputs({
          ...inputs,
          customer_id: booking.customer_id,
          vehicle_id: booking.vehicle_id,
          driver_id: booking.driver_id,
          start_date: booking.start_date,
          end_date: booking.end_date,
          start_time: booking.start_time,
          end_time: booking.end_time,
          custom_rate: booking.custom_rate,
        });

        // Customer name (read-only)
        setCustomerName(`${booking.c_fname} ${booking.c_lname}`);

        // Dropdowns
        setDrivers(
          dRes.drivers.map((d) => ({
            value: booking.driver_id,
            label: `${booking.d_fname} ${booking.d_lname}`,
          })),
        );
        setVehicles(
          vRes.vehicles.map((v) => ({
            value: booking.vehicle_id,
            label: `${booking.make} ${booking.model} ${booking.number_plate}`,
          })),
        );

        // Preselect driver/vehicle
        setSelectedDriver({
          value: booking.driver_id,
          label: `${booking.d_fname} ${booking.d_lname}`,
        });
        setSelectedVehicle({
          value: booking.vehicle_id,
          label: `${booking.make} ${booking.model} ${booking.number_plate}`,
        });

        // Dates/times
        setStartDate(new Date(booking.start_date));
        setEndDate(new Date(booking.end_date));
        // You may need to parse times into Date objects if backend returns strings
      } catch (err) {
        console.error("Error loading booking:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // Validation
  const validate = (data) => {
    const errors = {};
    if (!data.vehicle_id) errors.vehicle_id = "Vehicle is required";
    if (!data.driver_id) errors.driver_id = "Driver is required";
    if (!data.end_date) errors.end_date = "End Date is required";
    if (!data.start_time) errors.start_time = "Start Time is required";
    if (!data.end_time) errors.end_time = "End Time is required";
    setErrors(errors);
    return errors;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);
    const errors = validate(inputs);
    if (Object.keys(errors).length > 0) {
      Swal.fire({
        title: "Validation Error",
        icon: "error",
        text: "Check form fields",
      });
      setDisabled(false);
      return;
    }
    // console.log("Inputs: ", inputs);
    const res = await update_booking_details(inputs);
    if (res.data.status === "Success") {
      navigate(`/booking/${id}`, { state: { message: "Booking updated successfully" } });
    } else {
      Swal.fire({ title: "Error", icon: "error", text: res.data.message });
      setDisabled(false);
    }
    setDisabled(false);
  };

  if (loading) return <Loading />;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="bg-white px-4 pb-4 pt-4 rounded shadow-md mt-2 mx-3">
        <BookingNav />
        <h1 className="text-2xl sm:text-4xl my-5 text-center">Edit Booking</h1>

        <form onSubmit={handleSubmit} className="w-4/5 mx-auto">
          {/* Customer (read-only) */}
          <div className="mb-5 group">
            <input
              type="text"
              value={customerName}
              readOnly
              className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none"
            />
          </div>

          {/* Vehicle select */}
          <div className="mb-5 group">
            <Select
              options={vehicles}
              value={selectedVehicle}
              onChange={(option) => {
                setSelectedVehicle(option);
                handleChange("vehicle_id", option.value);
              }}
              placeholder="Select Vehicle"
              isSearchable
            />
            {errors.vehicle_id && (
              <p className="text-red-500 text-xs mt-1">{errors.vehicle_id}</p>
            )}
          </div>

          {/* Driver select */}
          <div className="mb-5 group">
            <Select
              options={drivers}
              value={selectedDriver}
              onChange={(option) => {
                setSelectedDriver(option);
                handleChange("driver_id", option.value);
              }}
              placeholder="Select Driver"
              isSearchable
            />
            {errors.driver_id && (
              <p className="text-red-500 text-xs mt-1">{errors.driver_id}</p>
            )}
          </div>

          {/* Booking dates */}
          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="relative z-0 w-full mb-5 group">
              <label>Start Date</label>
              <DatePicker
                className="block py-2.5 px-0 w-full text-sm text-gray-900
              bg-transparent border-0 border-b-2 border-gray-300 appearance-none
              dark:text-white dark:border-gray-600 dark:focus:border-blue-500
              focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                value={startDate}
                onChange={(val) =>
                  handleDateTimeChange(setStartDate, "start_date", val, "date")
                }
              />
              {errors.start_date && (
                <p className="text-red-500 text-xs mt-1">{errors.start_date}</p>
              )}
            </div>

            <div className="relative z-0 w-full mb-5 group">
              <label>End Date</label>
              <DatePicker
                className="block py-2.5 px-0 w-full text-sm text-gray-900
              bg-transparent border-0 border-b-2 border-gray-300 appearance-none
              dark:text-white dark:border-gray-600 dark:focus:border-blue-500
              focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                value={endDate}
                onChange={(val) =>
                  handleDateTimeChange(setEndDate, "end_date", val, "date")
                }
              />
              {errors.end_date && (
                <p className="text-red-500 text-xs mt-1">{errors.end_date}</p>
              )}
            </div>
          </div>

          {/* Booking times */}
          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="relative z-0 w-full mb-5 group">
              <label>Start Time</label>
              <TimePicker
                className="block py-2.5 px-0 w-full text-sm text-gray-900
              bg-transparent border-0 border-b-2 border-gray-300 appearance-none
              dark:text-white dark:border-gray-600 dark:focus:border-blue-500
              focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                value={startTime}
                onChange={(val) =>
                  handleDateTimeChange(setStartTime, "start_time", val, "time")
                }
              />
              {errors.start_time && (
                <p className="text-red-500 text-xs mt-1">{errors.start_time}</p>
              )}
            </div>

            <div className="relative z-0 w-full mb-5 group">
              <label>End Time</label>
              <TimePicker
                className="block py-2.5 px-0 w-full text-sm text-gray-900
              bg-transparent border-0 border-b-2 border-gray-300 appearance-none
              dark:text-white dark:border-gray-600 dark:focus:border-blue-500
              focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                value={endTime}
                onChange={(val) =>
                  handleDateTimeChange(setEndTime, "end_time", val, "time")
                }
              />
              {errors.end_time && (
                <p className="text-red-500 text-xs mt-1">{errors.end_time}</p>
              )}
            </div>
          </div>

          {/* Custom Rate */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="custom_rate"
              id="custom_rate"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              value={inputs.custom_rate}
              onChange={handleChange}
            />
            <label
              htmlFor="custom_rate"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Custom Rate
            </label>
          </div>

          {/* Submit */}
          <button
            disabled={disabled}
            className="w-full border-2 border-gray-800 text-gray-800 bg-white hover:bg-gray-800 hover:text-white transition duration-200 rounded-full px-4 py-2"
          >
            Update Booking
          </button>
        </form>
      </div>
    </LocalizationProvider>
  );
}
