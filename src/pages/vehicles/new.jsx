import React, { useState } from "react";
import Select from "react-select";
import { baseURL } from "../../constants/url";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import VehicleNav from "../../components/navs/vehicleNav";
export default function NewVehicle() {
  const [inputs, setInputs] = useState({
    make: "",
    model: "",
    number_plate: "",
    category_id: "",
    transmission: "",
    fuel: "",
    drive_train: "",
    seats: "",
    colour: "",
    daily_rate: "",
    vehicle_excess: "",
  });
  const [category, setCategory] = useState(null);
  const [transmission, setTransmission] = useState(null);
  const [fuel, setFuel] = useState(null);
  const [driveTrain, setDriveTrain] = useState(null);
  const [plate1, setPlate1] = useState("");
  const [plate2, setPlate2] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const categoryOptions = [
    { value: "1", label: "SUV" },
    { value: "2", label: "Mid Size SUV" },
    { value: "3", label: "Medium Car" },
    { value: "4", label: "Small Car" },
    { value: "5", label: "Safari" },
    { value: "6", label: "Luxury" },
    { value: "7", label: "Commercial" },
    { value: "8", label: "Truck" },
  ];

  const transmissionOptions = [
    { value: "Automatic", label: "Automatic" },
    { value: "Manual", label: "Manual" },
  ];

  const driveTrainOptions = [
    { value: "2WD", label: "2WD" },
    { value: "4WD", label: "4WD" },
  ];

  const fuelOptions = [
    { value: "Petrol", label: "Petrol" },
    { value: "Diesel", label: "Diesel" },
    { value: "Hybrid", label: "Hybrid" },
  ];

  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const vehicleURL = baseUrl + `/api/fleet/create.php`;

  const capitalizePlate2 = () => {
    // const { value } = e.target;
    const newPlate2 = plate2.slice(0, -1) + plate2.slice(-1).toUpperCase();
    setPlate2(newPlate2);
    const newNumberPlate = `${plate1} ${newPlate2}`;
    setInputs({
      ...inputs,
      number_plate: newNumberPlate,
    });
  };

  const capitalizePlate = (str) => {
    return str.slice(0, -1) + str.slice(-1).toUpperCase();
  };

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // handle change function
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = capitalizeFirstLetter(value);
    setInputs({
      ...inputs,
      [name]: newValue,
    });
    // console.log(inputs);
  };

  const numberPlateChange = (e) => {
    const { value } = e.target;
    const newPlate1 = value.toUpperCase();
    setPlate1(newPlate1);
    // if (name === "plate_1") {
    // } else {
    //   const newPlate2 = capitalizePlate(value);
    //   setPlate2(newPlate2);
    // }
    // console.log(plate2);
    const numberPlate = `${plate1} ${plate2}`;
    setInputs({
      ...inputs,
      number_plate: numberPlate,
    });
  };

  const categoryChange = (value) => {
    setCategory(value);
    setInputs({
      ...inputs,
      category_id: value.value,
    });
  };

  const fuelChange = (value) => {
    setFuel(value);
    setInputs({
      ...inputs,
      fuel: value.value,
    });
  };

  const transmissionChange = (value) => {
    setTransmission(value);
    setInputs({
      ...inputs,
      transmission: value.value,
    });
  };

  const driveTrainChange = (value) => {
    setDriveTrain(value);
    setInputs({
      ...inputs,
      drive_train: value.value,
    });
  };

  //submit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);
    const validationErrors = validate(inputs);
    if (Object.keys(validationErrors).length > 0) {
      Swal.fire({
        title: "Validation Error",
        icon: "error",
        text: "Check form fields for highlighted errors",
      });
      setDisabled(false);
    } else {
      axios.post(vehicleURL, inputs).then((response) => {
        // console.log(response);
        if (response.data.status == "Success") {
          const id = response.data.vehicle_id;
          navigate(`/vehicle/${id}`, {
            state: { message: "Vehicle created successfully" },
          });
        } else {
          Swal.fire({
            title: "Error",
            icon: "error",
            text: "An error occured while creating vehicle",
          });
          setDisabled(false);
        }
      });
    }
    console.log(inputs);
    setDisabled(false);
  };

  // validation function
  const validate = (data) => {
    const errors = {};

    if (!data.make) errors.make = "Make is required";
    if (!data.model) errors.model = "Model is required";
    if (!data.number_plate) errors.number_plate = "Number Plate is required";
    if (!data.category_id) errors.category_id = "Category is required";
    if (!data.transmission) errors.transmission = "Transmission is required";
    if (!data.fuel) errors.fuel = "Fuel is required";
    if (!data.seats) errors.seats = "Seats Time is required";
    if (!data.colour) errors.colour = "Colour Time is required";
    if (!data.daily_rate) errors.daily_rate = "Daily rate is required";
    if (!data.vehicle_excess)
      errors.vehicle_excess = "Vehicle Excess is required";

    setErrors(errors);
    return errors;
  };

  return (
    <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md mt-2 mx-3">
      <VehicleNav />
      <h1 className="text-2xl text-gray-800 border-b-2 border-gray-200 p-2">
        Add New Vehicle
      </h1>
      <form className="max-w-md mx-auto p-3" onSubmit={handleSubmit}>
        {/* make input  */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="make"
            id="make"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            value={inputs.make}
            onChange={handleChange}
          />
          <label
            for="make"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Make
          </label>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>
        {/* model input  */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="model"
            id="model"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            value={inputs.model}
            onChange={handleChange}
          />
          <label
            for="model"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Make
          </label>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Number Plate inputs  */}
        <p className="font-medium text-sm text-gray-500">Number Plate</p>
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="plate_1"
              id="plate_1"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=""
              required
              value={plate1}
              onChange={numberPlateChange}
            />
            <label
              for="plate_1"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              First 3 Letters
            </label>
            {errors.first_name && (
              <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>
            )}
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="plate_2"
              id="plate_2"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              value={plate2}
              onBlur={capitalizePlate2}
              onChange={(e) => setPlate2(e.target.value)}
            />
            <label
              for="plate_2"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Last Part
            </label>
            {errors.last_name && (
              <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>
            )}
          </div>
        </div>

        {/* Category input  */}
        <div className="mb-5 group mt-5">
          <Select
            options={categoryOptions}
            defaultValue={categoryOptions[0]}
            value={category}
            onChange={categoryChange}
            placeholder="Select Category"
          />
          {errors.id_type && (
            <p className="text-red-500 text-xs mt-1">{errors.id_type}</p>
          )}
        </div>

        {/* Trannsmission input  */}
        <div className="mb-5 group mt-5">
          <Select
            options={transmissionOptions}
            defaultValue={transmissionOptions[0]}
            value={transmission}
            onChange={transmissionChange}
            placeholder="Select Transmission"
          />
          {errors.id_type && (
            <p className="text-red-500 text-xs mt-1">{errors.id_type}</p>
          )}
        </div>

        {/* Fuel input  */}
        <div className="mb-5 group mt-5">
          <Select
            options={fuelOptions}
            defaultValue={fuelOptions[0]}
            value={fuel}
            onChange={fuelChange}
            placeholder="Select Fuel Type"
          />
          {errors.id_type && (
            <p className="text-red-500 text-xs mt-1">{errors.id_type}</p>
          )}
        </div>

        {/* Drive Train input  */}
        <div className="mb-5 group mt-5">
          <Select
            options={driveTrainOptions}
            defaultValue={driveTrainOptions[0]}
            value={driveTrain}
            onChange={driveTrainChange}
            placeholder="Select Drive Train"
          />
          {errors.id_type && (
            <p className="text-red-500 text-xs mt-1">{errors.id_type}</p>
          )}
        </div>

        {/* Seats  */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="seats"
            id="seats"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            value={inputs.seats}
            onChange={handleChange}
          />
          <label
            for="model"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Seats
          </label>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* colour input  */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="colour"
            id="colour"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            value={inputs.colour}
            onChange={handleChange}
          />
          <label
            for="model"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Colour
          </label>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>
        <hr />
        <h3 className="text-2xl text-gray-800 border-b-2 border-gray-200 p-2 text-center">
          Vehicle Pricing
        </h3>

        {/* Daily Rate input  */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="daily_rate"
            id="daily_rate"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            value={inputs.daily_rate}
            onChange={handleChange}
          />
          <label
            for="model"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Daily Rate
          </label>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Vehicle Excess input  */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="vehicle_excess"
            id="vehicle_excess"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            value={inputs.vehicle_excess}
            onChange={handleChange}
          />
          <label
            for="model"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Vehicle Excess
          </label>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>
        <button
          disabled={disabled}
          className="w-full border-2 border-gray-800 text-gray-800 bg-white hover:bg-gray-800 hover:text-white transition duration-200 rounded-full px-4 py-2"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
