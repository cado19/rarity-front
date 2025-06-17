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

export default function NewBooking() {
  const clientOptions = [];
  const carOptions = [];
  const driverOptions = [];
  const [inputs, setInputs] = useState({
    account_id: "",
    customer_id: "",
    vehicle_id: "",
    driver_id: "",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    custom_rate: "",
    in_capital: "0",
    out_capital: "0",
  });
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [bookingClients, setBookingClients] = useState(clientOptions);
  const [bookingVehicles, setBookingVehicles] = useState(carOptions);
  const [bookingDrivers, setBookingDrivers] = useState(driverOptions);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [errors, setErrors] = useState({});
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  const baseUrl = import.meta.env.VITE_BASE_URL;

  const customersURL = baseUrl + "/api/customers/booking_customers.php";
  const vehiclesURL = baseUrl + "/api/fleet/booking_vehicles.php";
  const driversURL = baseUrl + "/api/drivers/booking_drivers.php";
  const bookingURL = baseUrl + "/api/bookings/create.php";

  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData.id;

  // data fetch functions
  const addClientOptions = (client) => {
    clientOptions.push({
      value: client.id,
      label: `${client.first_name} ${client.last_name}`,
    });
  };

  const addDriverOptions = (driver) => {
    driverOptions.push({
      value: driver.id,
      label: `${driver.first_name} ${driver.last_name}`,
    });
  };

  const addVehicleOptions = (vehicle) => {
    carOptions.push({
      value: vehicle.id,
      label: `${vehicle.make} ${vehicle.model} ${vehicle.number_plate}`,
    });
  };

  const fetchClients = async () => {
    try {
      axios.get(customersURL).then((response) => {
        // console.log(response);
        response.data.clients.forEach((client) => addClientOptions(client));
      });
    } catch (error) {}
  };

  const fetchVehicles = async () => {
    try {
      axios.get(vehiclesURL).then((response) => {
        // console.log(response);
        response.data.vehicles.forEach((vehicle) => addVehicleOptions(vehicle));
        setLoading(false);
      });
    } catch (error) {}
  };

  const fetchDrivers = async () => {
    try {
      axios.get(driversURL).then((response) => {
        // console.log(response.data.drivers);
        response.data.drivers.forEach((driver) => addDriverOptions(driver));
      });
    } catch (error) {}
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (!loggedIn) {
      navigate("/login");
    }
    fetchClients();
    fetchVehicles();
    fetchDrivers();
    // setAccountId();
    initFormValues();
  }, []);

  // Change functions
  // set account_id

  //initialize account id and start date 
  const initFormValues = () => {
    const today = new Date();
    setStartDate(today);
    const day = today.getDate().toString().padStart(2, "0");
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const year = today.getFullYear().toString();
    const formattedStartDate = `${year}-${month}-${day}`;
    setInputs({
      ...inputs,
      account_id: userId,
      start_date: formattedStartDate,
    });
  }
  const setAccountId = () => {
    setInputs({
      ...inputs,
      account_id: userId,
    });
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

  const startDateChange = (value) => {
    setStartDate(value);
    const day = value.getDate().toString().padStart(2, "0");
    const month = (value.getMonth() + 1).toString().padStart(2, "0");
    const year = value.getFullYear().toString();
    const formattedStartDate = `${year}-${month}-${day}`;
    setInputs({
      ...inputs,
      start_date: formattedStartDate,
    });

    // console.log(inputs);
  };

  const initStartDate = () => {
    const today = new Date();
    // setStartDate(today);
    const day = today.getDate().toString().padStart(2, "0");
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const year = today.getFullYear().toString();
    const formattedStartDate = `${year}-${month}-${day}`;
    setInputs({
      ...inputs,
      start_date: formattedStartDate,
    });
  };

  const endDateChange = (value) => {
    setEndDate(value);
    const day = value.getDate().toString().padStart(2, "0");
    const month = (value.getMonth() + 1).toString().padStart(2, "0");
    const year = value.getFullYear().toString();
    const formattedEndDate = `${year}-${month}-${day}`;
    setInputs({
      ...inputs,
      end_date: formattedEndDate,
    });

    // console.log(inputs);
  };

  const startTimeChange = (value) => {
    setStartTime(value);
    const hours = value.getHours().toString().padStart(2, "0");
    const minutes = value.getMinutes().toString().padStart(2, "0");
    const suffix = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 || 12;
    const formattedStartTime = `${formattedHours}:${minutes} ${suffix}`;
    setInputs({
      ...inputs,
      start_time: formattedStartTime,
    });

    // console.log(inputs);
  };

  const endTimeChange = (value) => {
    setEndTime(value);
    const hours = value.getHours().toString().padStart(2, "0");
    const minutes = value.getMinutes().toString().padStart(2, "0");
    const suffix = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 || 12;
    const formattedEndTime = `${formattedHours}:${minutes} ${suffix}`;
    setInputs({
      ...inputs,
      end_time: formattedEndTime,
    });

    // console.log(inputs);
  };

  const customerChange = (value) => {
    setSelectedClient(value);
    // const idTypeValue = selectedOption.value;
    setInputs({
      ...inputs,
      customer_id: value.value,
    });
    // console.log(value.value);
  };

  const vehicleChange = (value) => {
    setSelectedVehicle(value);
    // const idTypeValue = selectedOption.value;
    setInputs({
      ...inputs,
      vehicle_id: value.value,
    });
    // console.log(value.value);
  };

  const driverChange = (value) => {
    setSelectedDriver(value);
    // const idTypeValue = selectedOption.value;
    setInputs({
      ...inputs,
      driver_id: value.value,
    });
    // console.log(value.value);
  };

  // validation function
  const validate = (data) => {
    const errors = {};

    if (!data.vehicle_id) errors.vehicle_id = "Vehicle is required";
    if (!data.customer_id) errors.customer_id = "Client is required";
    if (!data.driver_id) errors.driver_id = "Driver is required";
    if (!data.start_date) initStartDate();
    if (!data.end_date) errors.end_date = "End Date is required";
    if (!data.start_time) errors.start_time = "Start Time is required";
    if (!data.end_time) errors.end_time = "End Time is required";

    setErrors(errors);

    return errors;
  };

  // submit function
  const handleSubmit = (e) => {
    e.preventDefault();
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
      axios.post(bookingURL, inputs).then((response) => {
        console.log(response);
        if (response.data.status == "Success") {
          const id = response.data.booking_id;
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
      });
    }
    console.log(inputs);
  };
  // console.log(typeof startTime);

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md w-full flex items-center justify-center h-full">
        <Mosaic color="#32cd32" size="large" text="Loading..." textColor="" />
      </div>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="bg-white px-4 pb-4 pt-4 rounded border-gray-200 flex-1 shadow-md mt-2 mx-3">
        <BookingNav />
        <h1 className="4xl my-2 text-center font-bold">New Booking</h1>
        <form onSubmit={handleSubmit}>
          {/* Client select  */}
          <div className=" mb-5 group">
            <Select
              options={bookingClients}
              defaultValue={bookingClients[0]}
              value={selectedClient}
              onChange={customerChange}
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
              options={bookingVehicles}
              defaultValue={bookingVehicles[0]}
              value={selectedVehicle}
              onChange={vehicleChange}
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
              options={bookingDrivers}
              defaultValue={bookingDrivers[0]}
              value={selectedDriver}
              onChange={driverChange}
              placeholder="Select Driver"
              isSearchable
            />
            {errors.driver_id && (
              <p className="text-red-500 text-xs mt-1">{errors.driver_id}</p>
            )}
          </div>
          {/* Show locations  */}
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

          {/* Location  */}
          {show && (
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
            </div>
          )}

          {/* Booking dates  */}
          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="relative z-0 w-full mb-5 group">
              <label>Start Date</label>
              <DatePicker
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder="Start Date"
                value={startDate}
                onChange={(value) => startDateChange(value)}
              />
              {errors.start_date && (
                <p className="text-red-500 text-xs mt-1">{errors.start_date}</p>
              )}
            </div>

            <div className="relative z-0 w-full mb-5 group">
              <label>End Date</label>
              <DatePicker
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder="End Date"
                value={endDate}
                onChange={(value) => endDateChange(value)}
              />
              {errors.end_date && (
                <p className="text-red-500 text-xs mt-1">{errors.end_date}</p>
              )}
            </div>
          </div>

          {/* Booking times  */}
          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="relative z-0 w-full mb-5 group">
              <label>Start Time</label>
              <TimePicker
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder="Start Time"
                value={startTime}
                onChange={(value) => startTimeChange(value)}
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
                onChange={(value) => endTimeChange(value)}
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
