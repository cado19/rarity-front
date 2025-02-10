import React, { useEffect, useState } from "react";
import Select from "react-select";
import { DatePicker } from "@mui/x-date-pickers/DatePicker"; // Import the DatePicker component
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import axios from "axios";
import { baseURL } from "../../constants/url";
import Loading from "../../components/PageContent/Loading";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();


  const customersURL = baseURL + "/api/customers/booking_customers.php";
  const vehiclesURL = baseURL + "/api/fleet/booking_vehicles.php";
  const driversURL = baseURL + "/api/drivers/booking_drivers.php";
  const bookingURL = baseURL + "/api/bookings/create.php";

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
    } catch (error) {
      
    }
  }

  useEffect(() => {
    fetchClients();
    fetchVehicles();
    fetchDrivers();
    setAccountId();
  }, []);

  // Change functions
  // set account_id

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

    if(!data.vehicle_id) errors.vehicle_id = "Vehicle is required";
    if(!data.customer_id) errors.customer_id = "Client is required";
    if(!data.driver_id) errors.driver_id = "Driver is required";
    if(!data.start_date) errors.start_date = "Start Date is required";
    if(!data.end_date) errors.end_date = "End Date is required";
    if(!data.start_time) errors.start_time = "Start Time is required";
    if(!data.end_time) errors.end_time = "End Time is required";

    return errors;
  }


  // submit function
  const handleSubmit = (e) => {
    e.preventDefault();
    setDisabled(true);
    const validationErrors = validate(inputs);
    if (Object.keys(validationErrors).length > 0) {
      Swal.fire({
        title: "Validation Error",
        icon: "error",
        text: "Check form fields for highlighted errors"
      });
      setDisabled(false);
    } else {
      axios.post(bookingURL, inputs).then((response) => {
        if(response.data.status == "Success"){
          const id = response.data.booking_id;
          navigate(`/booking/${id}`,{ state: {message: "Booking created successfully"}});
        } else {
          Swal.fire({
            title: "Error",
            icon: "error",
            text: "An error occured while creating booking"
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
      <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md">
        <Loading /> 
      </div>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="bg-white px-4 pb-4 pt-4 rounded border-gray-200 flex-1 shadow-md mt-2 mx-3">
        <h3>New Booking</h3>
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
            <button
              disabled={disabled}
              className="border-2 border-gray-800 text-gray-800 bg-white hover:bg-gray-800 hover:text-white transition duration-200 rounded-full px-4 py-2"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </LocalizationProvider>
  );
}
