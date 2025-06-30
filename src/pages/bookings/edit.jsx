import React, { useEffect, useState } from "react";
import Select from "react-select";
import { DatePicker } from "@mui/x-date-pickers/DatePicker"; // Import the DatePicker component
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import axios from "axios";
import { baseURL } from "../../constants/url";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/PageContent/Loading";
import BookingNav from "../../components/navs/bookingnav";
import { Mosaic } from "react-loading-indicators";
import { format, formatDate } from "date-fns"; // Import format function for date formatting

export default function EditBooking() {
  const navigate = useNavigate();
  const { id } = useParams();
  const clientOptions = [];
  const carOptions = [];
  const driverOptions = [];
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [bookingClients, setBookingClients] = useState(clientOptions);
  const [bookingVehicles, setBookingVehicles] = useState(carOptions);
  const [bookingDrivers, setBookingDrivers] = useState(driverOptions);
  const [booking, setBooking] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [inputs, setInputs] = useState({
    booking_id: id,
    account_id: "",
    customer: "",
    vehicle: "",
    driver: "",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    custom_rate: "",
  });

  const baseUrl = import.meta.env.VITE_BASE_URL;

  const bookingFetchURL = baseUrl + `/api/bookings/read_single.php?id=${id}`;
  const customersURL = baseUrl + "/api/customers/booking_customers.php";
  const vehiclesURL = baseUrl + "/api/fleet/booking_vehicles.php";
  const driversURL = baseUrl + "/api/drivers/booking_drivers.php";
  const bookingURL = baseUrl + "/api/bookings/update.php";

  // get user from local storage and get user id
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
        console.log(response.data.drivers);
        response.data.drivers.forEach((driver) => addDriverOptions(driver));
      });
    } catch (error) {}
  };

  const getBooking = async () => {
    try {
      await axios.get(bookingFetchURL).then((response) => {
        console.log(response);
        setBooking(response.data.booking);
        setStartDate(new Date(response.data.booking.start_date));
        setEndDate(new Date(response.data.booking.end_date));
        setStartTime(response.data.booking.start_time);
        setEndTime(response.data.booking.end_time);
        setInputs({
          account_id: response.data.booking.account_id,
          customer: clientOptions.find(
            (client) => client.value === response.data.booking.customer_id
          ),
          vehicle: carOptions.find(
            (vehicle) => vehicle.value === response.data.booking.vehicle_id
          ),
          driver: driverOptions.find(
            (driver) => driver.value === response.data.booking.driver_id
          ),
          start_date: response.data.booking.start_date,
          end_date: response.data.booking.end_date,
          start_time: response.data.booking.start_time,
          end_time: response.data.booking.end_time,
          custom_rate: response.data.booking.custom_rate,
        });
        setLoading(false);
      });
    } catch (error) {
      const errorMessage = error.message;
      setError(errorMessage);
    }
  };

  useEffect(() => {
    getBooking();
    fetchClients();
    fetchVehicles();
    fetchDrivers();
    setAccountId();
  }, []);

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
    if (!data.start_date) errors.start_date = "Start Date is required";
    if (!data.end_date) errors.end_date = "End Date is required";
    if (!data.start_time) errors.start_time = "Start Time is required";
    if (!data.end_time) errors.end_time = "End Time is required";

    setErrors(errors);

    return errors;
  };

  // validate date
  // const validateDate = (start, end) => {
  //   const errors = {};
  //   if (start > end) {
  //     errors.start_date = "Start date cannot be greater than end date";
  //   }
  //   return errors
  // }

  const booking_start_date = new Date(booking?.start_date).toString();
  const booking_end_date = new Date(booking?.end_date).toString();

  // submit function
  const handleSubmit = (e) => {
    e.preventDefault();
    setDisabled(true);
    // const validationErrors = validate(inputs);

    setDisabled(false);

    axios
      .post(bookingURL, {
        booking_id: id,
        customer_id: inputs.customer.value,
        vehicle_id: inputs.vehicle.value,
        driver_id: inputs.driver.value,
        start_date: inputs.start_date,
        end_date:  inputs.end_date,
        start_time: inputs.start_time,
        end_time: inputs.end_time,
        custom_rate: inputs.custom_rate,
      })
      .then((response) => {
        if (response.data.status == "Success") {
          // const id = response.data.booking_id;
          navigate(`/booking/${id}`, {
            state: { message: "Booking updated successfully" },
          });
        } else {
          console.log(response.data);
          Swal.fire({
            title: "Error",
            icon: "error",
            text: "An error occured while updating booking",
          });
          setDisabled(false);
        }
      });

    console.log({
        booking_id: id,
        customer_id: inputs.customer.value,
        vehicle_id: inputs.vehicle.value,
        driver_id: inputs.driver.value,
        start_date: inputs.start_date,
        end_date:  inputs.end_date,
        start_time: inputs.start_time,
        end_time: inputs.end_time,
        custom_rate: inputs.custom_rate,
      });
    setDisabled(false);
  };
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
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-4xl my-5 text-center ">
          Editing Booking {booking?.booking_no}
        </h1>
        <form onSubmit={handleSubmit} className="w-4/5 mx-auto">
          {/* Client select  */}
          <div className=" mb-5 group">
            <Select
              options={bookingClients}
              defaultValue={bookingClients[0]}
              value={inputs.customer}
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
              value={inputs.vehicle}
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
              value={inputs.driver}
              onChange={driverChange}
              placeholder="Select Driver"
              isSearchable
            />

            {errors.driver_id && (
              <p className="text-red-500 text-xs mt-1">{errors.driver_id}</p>
            )}
          </div>

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
              <p className="text-blue-500">Current: {booking_start_date} </p>
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
              <p className="text-blue-500">Current: {booking_end_date}</p>
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
              <p className="text-blue-500">Current: {booking.start_time}</p>
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
              <p className="text-blue-500">Current: {booking.end_time}</p>
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
