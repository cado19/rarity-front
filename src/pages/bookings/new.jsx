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
import { save_booking, save_one_day_booking } from "../../api/post";

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

  // submit normal booking
  const saveNormalBooking = async () => {
    setDisabled(true);
    const errors = validate(inputs);
    if (Object.keys(errors).length > 0) {
      Swal.fire({
        title: "Validation Error",
        icon: "error",
        text: "Check form fields for highlighted errors",
      });
      console.log("Validation Errors: ", errors);
      setDisabled(false);
    } else {
      console.log("Inputs: ", inputs);
      const res = await save_booking(inputs);
      // console.log(response);
      if (res.data.status == "Success") {
        const id = res.data.booking_id;
        navigate(`/booking/${id}`, {
          state: { message: "Booking created successfully" },
        });
      } else {
        Swal.fire({
          title: "Error",
          icon: "error",
          text: response.data.message,
          confirmButtonText: "OK",
        });
        setDisabled(false);
      }
    }
  };

  //save one day booking
  const saveOneDayBooking = async () => {
    setDisabled(true);
    const errors = validateOneDay(inputs);
    if (Object.keys(errors).length > 0) {
      Swal.fire({
        title: "Validation Error",
        icon: "error",
        text: "Check form fields for highlighted errors",
      });
      console.log("Validation Errors: ", errors);
      setDisabled(false);
    } else {
      const res = await save_one_day_booking(inputs);
      console.log(res);
      if (res.data.status == "Success") {
        const id = res.data.booking_id;
        navigate(`/booking/${id}`, {
          state: { message: "Booking created successfully" },
        });
      } else {
        Swal.fire({
          title: "Error",
          icon: "error",
          text: response.data.message,
          confirmButtonText: "OK",
        });
        setDisabled(false);
      }
    }
  };

  // submit function
  const handleSubmit = (e) => {
    e.preventDefault();
    if (oneday) {
      saveOneDayBooking();
    } else {
      saveNormalBooking();
    }
    console.log(inputs);
  };

  // console.log(typeof startTime);

  if (loading) {
    return <Loading />;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="bg-white px-4 pb-4 pt-4 rounded border-gray-200 flex-1 shadow-md mt-2 mx-3">
        <BookingNav />
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-4xl my-5 text-center ">
          New Booking
        </h1>
        <form onSubmit={handleSubmit} className="w-4/5 mx-auto">
          {/* Checkbox for one day  */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={oneday}
              onChange={() => {
                setOneDay(!oneday);
              }}
              className="form-checkbox h-5 w-5 text-blue-600 m-3"
            />
            <span className=" text-gray-500 dark:text-gray-400">
              {oneday
                ? "One Day Booking Turned On"
                : "One Day Booking Turned Off"}
            </span>
          </label>

          {/* Client select  */}
          <div className=" mb-5 group">
            <Select
              options={clients}
              defaultValue={clients[0]}
              value={selectedClient}
              onChange={(option) => {
                setSelectedClient(option);
                handleSelectChange("customer_id", option.value);
              }}
              placeholder="Select Client"
              isSearchable
            />
            {errors.customer_id && (
              <p className="text-red-500 text-xs mt-1">{errors.customer_id}</p>
            )}
          </div>

          {/* Vehicle select  */}
          <div className=" mb-5 group">
            <Select
              options={vehicles}
              defaultValue={vehicles[0]}
              value={selectedVehicle}
              onChange={(option) => {
                setSelectedVehicle(option);
                handleSelectChange("vehicle_id", option.value);
              }}
              placeholder="Select Vehicle"
              isSearchable
            />
            {errors.vehicle_id && (
              <p className="text-red-500 text-xs mt-1">{errors.vehicle_id}</p>
            )}
          </div>

          {/* Driver select  */}
          <div className=" mb-5 group">
            <Select
              options={drivers}
              defaultValue={drivers[0]}
              value={selectedDriver}
              onChange={(option) => {
                setSelectedDriver(option);
                handleSelectChange("driver_id", option.value);
              }}
              placeholder="Select Driver"
              isSearchable
            />
            {errors.driver_id && (
              <p className="text-red-500 text-xs mt-1">{errors.driver_id}</p>
            )}
          </div>
          {/* Show locations  */}
          {!oneday && (
            <div className="flex flex-row">
              <p
                className="text-blue-400 flex flex-row mb-4 cursor-pointer"
                onClick={() => setShow(!show)}
              >
                Locations
                {show ? (
                  <span>
                    <AiFillCaretDown size={15} className="mt-1" />
                  </span>
                ) : (
                  <AiFillCaretRight size={15} className="mt-1" />
                )}
              </p>
            </div>
          )}

          {/* Location  */}
          {show &&
            !oneday(
              <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="text"
                    name="in_capital"
                    id="in_capital"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=""
                    required
                    value={inputs.in_capital}
                    onChange={handleChange}
                  />
                  <label
                    for="first_name"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Within Nairobi
                  </label>
                  {errors.in_capital && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.in_capital}
                    </p>
                  )}
                </div>

                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="text"
                    name="out_capital"
                    id="out_capital"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=""
                    required
                    value={inputs.out_capital}
                    onChange={handleChange}
                  />
                  <label
                    for="last_name"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Outside Nairobi
                  </label>
                  {errors.out_capital && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.last_name}
                    </p>
                  )}
                </div>
              </div>,
            )}

          {/* Booking dates  */}
          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="relative z-0 w-full mb-5 group">
              <label>Start Date</label>
              <DatePicker
                className="block py-2.5 px-0 w-full text-sm text-gray-900
              bg-transparent border-0 border-b-2 border-gray-300 appearance-none
              dark:text-white dark:border-gray-600 dark:focus:border-blue-500
              focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder="Start Date"
                value={startDate}
                onChange={(val) =>
                  handleDateTimeChange(setStartDate, "start_date", val, "date")
                }
              />
              {errors.start_date && (
                <p className="text-red-500 text-xs mt-1">{errors.start_date}</p>
              )}
            </div>
            {!oneday && (
              <div className="relative z-0 w-full mb-5 group">
                <label>End Date</label>
                <DatePicker
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder="End Date"
                  value={endDate}
                  onChange={(val) =>
                    handleDateTimeChange(setEndDate, "end_date", val, "date")
                  }
                />
                {errors.end_date && (
                  <p className="text-red-500 text-xs mt-1">{errors.end_date}</p>
                )}
              </div>
            )}
          </div>

          {/* Booking times  */}
          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="relative z-0 w-full mb-5 group">
              <label>Start Time</label>
              <TimePicker
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder="Start Time"
                value={startTime}
                onChange={(val) =>
                  handleDateTimeChange(setStartTime, "start_time", val, "time")
                }
                name="start_time"
              />
              {errors.start_time && (
                <p className="text-red-500 text-xs mt-1">{errors.start_time}</p>
              )}
            </div>

            <div className="relative z-0 w-full mb-5 group">
              <label>End Time</label>
              <TimePicker
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder="End Time"
                value={endTime}
                onChange={(val) =>
                  handleDateTimeChange(setEndTime, "end_time", val, "time")
                }
                name="end_time"
              />
              {errors.end_time && (
                <p className="text-red-500 text-xs mt-1">{errors.end_time}</p>
              )}
            </div>
            {/* Driver select  */}
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="text"
                name="custom_rate"
                id="custom_rate"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                value={inputs.custom_rate}
                onChange={handleChange}
              />

              <label
                for="custom_rate"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Custome Rate
              </label>
            </div>
            <button
              disabled={disabled}
              className="w-full border-2 border-gray-800 text-gray-800 bg-white hover:bg-gray-800 hover:text-white transition duration-200 rounded-full px-4 py-2"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </LocalizationProvider>
  );
}
