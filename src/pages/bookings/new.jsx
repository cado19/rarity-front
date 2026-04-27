import React, { useEffect, useState } from "react";
import Select from "react-select";
import { DatePicker } from "@mui/x-date-pickers/DatePicker"; // Import the DatePicker component
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import axios from "axios";
import { baseURL } from "../../constants/url";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Mosaic } from "react-loading-indicators";
import Loading from "../../components/PageContent/Loading";
import BookingNav from "../../components/navs/bookingnav";
import { AiFillCaretRight } from "react-icons/ai";
import { AiFillCaretDown } from "react-icons/ai";
import {
  fetchBookingCustomers,
  fetchBookingDrivers,
  get_booking_vehicles,
} from "../../api/fetch";
import { save_booking } from "../../api/post";
import BookingForm from "../../components/bookings/form";

export default function NewBooking() {
  // Format date helper
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${year}-${month}-${day}`;
  };

  // Format time helper
  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const suffix = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes} ${suffix}`;
  };

  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData.id;

  const today = new Date();

  // state

  const [clients, setClients] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [dailyRate, setDailyRate] = useState(0);

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [startDate, setStartDate] = useState(new Date(today));
  const [endDate, setEndDate] = useState(new Date(today));
  const [startTime, setStartTime] = useState(new Date(today));
  const [endTime, setEndTime] = useState(new Date(today));
  const [errors, setErrors] = useState({});
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [oneday, setOneDay] = useState(false);

  const [inputs, setInputs] = useState({
    account_id: userId,
    customer_id: "",
    vehicle_id: "",
    driver_id: "",
    start_date: formatDate(today),
    end_date: "",
    start_time: "",
    end_time: "",
    custom_rate: "",
    in_capital: "0",
    out_capital: "0",
    oneday: false,
    vat: false,
    override: false,
  });

  const navigate = useNavigate();

  const baseUrl = import.meta.env.VITE_BASE_URL;

  const oneDayBookingUrl = baseUrl + "/api/bookings/create_one_day.php";

  // fetch dropdown data
  const fetchDropdowns = async () => {
    try {
      const [cRes, dRes, vRes] = await Promise.all([
        fetchBookingCustomers(),
        fetchBookingDrivers(),
        get_booking_vehicles(),
      ]);
      // set state
      setClients(
        cRes.clients.map((c) => ({
          value: c.id,
          label: `${c.first_name} ${c.last_name}`,
        })),
      );
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
    } catch (error) {
      console.error("Error fetching dropdown data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (!loggedIn) {
      navigate("/login");
    }
    fetchDropdowns();
    // setAccountId();
    // initFormValues();
  }, []);

  // Change functions

  const handleDateTimeChange = (setter, field, value, type = "date") => {
    setter(value);
    setInputs((prev) => ({
      ...prev,
      [field]: type === "date" ? formatDate(value) : formatTime(value),
    }));
  };

  // handle change function
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
    // console.log(inputs);
  };

  // handle the select change
  const handleSelectChange = (name, value) => {
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // validation function
  const validate = (data) => {
    const errors = {};

    if (!data.vehicle_id) errors.vehicle_id = "Vehicle is required";
    if (!data.customer_id) errors.customer_id = "Client is required";
    if (!data.driver_id) errors.driver_id = "Driver is required";
    if (!data.end_date) errors.end_date = "End Date is required";
    if (!data.start_time) errors.start_time = "Start Time is required";
    if (!data.end_time) errors.end_time = "End Time is required";

    setErrors(errors);

    return errors;
  };

  // validation one day booking function
  const validateOneDay = (data) => {
    const errors = {};

    if (!data.vehicle_id) errors.vehicle_id = "Vehicle is required";
    if (!data.customer_id) errors.customer_id = "Client is required";
    if (!data.driver_id) errors.driver_id = "Driver is required";
    if (!data.start_time) errors.start_time = "Start Time is required";
    if (!data.end_time) errors.end_time = "End Time is required";

    setErrors(errors);

    return errors;
  };

  // submit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);

    const errs = validate(inputs);
    if (Object.keys(errs).length > 0) {
      Swal.fire({
        title: "Validation Error",
        icon: "error",
        text: "Check form fields",
      });
      setDisabled(false);
      return;
    }
    // console.log("Inputs: ", inputs);
    // setDisabled(false);
    try {
      const res = await save_booking(inputs);
      if (res.data.status === "Success") {
        navigate(`/booking/${res.data.booking_id}`, {
          state: { message: "Booking created successfully" },
        });
      } else {
        Swal.fire({ title: "Error", icon: "error", text: res.data.message });
      }
    } catch (err) {
      Swal.fire({ title: "Error", icon: "error", text: "Server error" });
    } finally {
      setDisabled(false);
    }
  };

  // console.log(typeof startTime);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="bg-white px-4 pb-4 pt-4 rounded shadow-md mt-2 mx-3">
      <BookingNav />

      <BookingForm
        title="New Booking"
        inputs={inputs}
        setInputs={setInputs}
        clients={clients}
        drivers={drivers}
        vehicles={vehicles}
        selectedClient={selectedClient}
        setSelectedClient={setSelectedClient}
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
        customerName={""}
      />
    </div>
  );
}
