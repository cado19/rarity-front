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
import BookingForm from "../../components/bookings/form";

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

  const parseDateTime = (dateStr, timeStr) => {
    // timeStr is like "8:00 am" or "4:00 pm"
    const [hoursPart, minutesPart] = timeStr.split(":");
    const [minutes, suffix] = minutesPart.split(" ");
    let h = parseInt(hoursPart, 10);
    const m = parseInt(minutes, 10);

    if (suffix.toLowerCase() === "pm" && h !== 12) h += 12;
    if (suffix.toLowerCase() === "am" && h === 12) h = 0;

    const d = new Date(dateStr);
    d.setHours(h, m, 0, 0);
    return d;
  };

  // get userId from local storage to set as accountId
  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData.id;

  // State
  const [no, setNo] = useState();
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
    booking_id: id,
    customer_id: "",
    vehicle_id: "",
    driver_id: "",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    custom_rate: "",
    override: false,
    vat: false,
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

        console.log("Drivers: ", dRes.drivers);

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
          vat: booking.vat > 0,
        });

        // set booking no
        setNo(booking.booking_no);

        // Customer name (read-only)
        setCustomerName(`${booking.c_fname} ${booking.c_lname}`);

        // Dropdowns
        setDrivers(
          dRes.drivers.map((d) => ({
            value: d.id,
            label: `${d.first_name} ${d.last_name}`,
          })),
        );

        setVehicles(
          vRes.vehicles.map((v) => ({
            value: v.id,
            label: `${v.make} ${v.model} ${v.number_plate}`,
            daily_rate: v.daily_rate,
          })),
        );

        // After setting vehicles find the booked vehicle's id from all the loaded vehicles to add daily_rate to it
        const matchedVehicle = vRes.vehicles.find(
          (v) => v.id === booking.vehicle_id,
        );

        // Preselect driver/vehicle
        setSelectedDriver({
          value: booking.driver_id,
          label: `${booking.d_fname} ${booking.d_lname}`,
        });
        if (matchedVehicle) {
          setSelectedVehicle({
            value: matchedVehicle.id,
            label: `${matchedVehicle.make} ${matchedVehicle.model} ${matchedVehicle.number_plate}`,
            daily_rate: matchedVehicle.daily_rate,
          });
        }
        // Dates/times
        // Dates
        setStartDate(parseDateTime(booking.start_date, booking.start_time));
        setEndDate(parseDateTime(booking.end_date, booking.end_time));

        // Times (for TimePicker)
        setStartTime(parseDateTime(booking.start_date, booking.start_time));
        setEndTime(parseDateTime(booking.end_date, booking.end_time));

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
      navigate(`/booking/${id}`, {
        state: { message: "Booking updated successfully" },
      });
    } else {
      Swal.fire({ title: "Error", icon: "error", text: res.data.message });
      setDisabled(false);
    }
    setDisabled(false);
  };

  if (loading) return <Loading />;

  return (
    <BookingForm
      title={`Edit Booking ${no ? `#${no}` : ""}`}
      inputs={inputs}
      setInputs={setInputs}
      drivers={drivers}
      vehicles={vehicles}
      selectedDriver={selectedDriver}
      setSelectedDriver={setSelectedDriver}
      selectedVehicle={selectedVehicle}
      setSelectedVehicle={setSelectedVehicle}
      startDate={startDate}
      setStartDate={setStartDate}
      endDate={endDate}
      setEndDate={setEndDate}
      startTime={startTime}
      setStartTime={setStartTime}
      endTime={endTime}
      setEndTime={setEndTime}
      errors={errors}
      disabled={disabled}
      onSubmit={handleSubmit}
      customerName={customerName}
    />
  );
}
