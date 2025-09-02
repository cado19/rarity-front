import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Mosaic } from "react-loading-indicators";
import Swal from "sweetalert2";
import { FaArrowLeft } from "react-icons/fa";
import { get_vehicle_base } from "../../api/fetch";
import VehicleInput from "../../components/styled/VehicleInput";
import VehicleDropdown from "../../components/styled/VehicleDropdown";
import { update_vehicle_basics } from "../../api/post";

export default function EditBasics() {
  const { id } = useParams();
  const navigate = useNavigate();
  // state
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false); // button disable
  const [error, setError] = useState();
  const [vehicle, setVehicle] = useState(null);
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

  // get the vehicle's make, model, number plate from the backend
  const getBase = async () => {
    try {
      const response = await get_vehicle_base(id);
      setVehicle(response.data.vehicle);
      console.log(response);
    } catch (error) {
      const errorMessage = "Error: " + error.message;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBase();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicle((prev) => ({ ...prev, [name]: value }));
  };

  const formatPlate = (plate) => {
    const match = plate.match(/^([a-zA-Z]{3})\s?(\d{3,4})([a-zA-Z])$/);
    if (!match) return plate.toUpperCase();
    const [, letters, numbers, last] = match;
    return `${letters.toUpperCase()} ${numbers}${last.toUpperCase()}`;
  };

  const handlePlateChange = (e) => {
    const formatted = formatPlate(e.target.value);
    setVehicle((prev) => ({ ...prev, number_plate: formatted }));
  };

  const handleSelectChange = (field) => (option) => {
    setVehicle((prev) => ({ ...prev, [field]: option.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPending(true);

    // add the id to the data being sent to the backend
    const payload = {
      vehicle_id: id,
      ...vehicle,
    };

    const response = await update_vehicle_basics(payload);
    console.log(response);
    if (response.data.status == "Success") {
      navigate(`/vehicle/${id}`, {
        state: { message: "Vehicle updated successfully" },
      });
    } else {
      Swal.fire({
        title: "An error occured while updating.",
        text: "Please try again",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
    setPending(false);
  };

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md w-full flex items-center justify-center h-full">
        <Mosaic color="#32cd32" size="large" text="Loading..." textColor="" />
      </div>
    );
  }

  return (
    <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md mt-2 mx-3">
      <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-4xl my-5 text-center ">
        {vehicle.make} {vehicle.model} {vehicle.number_plate} basics
      </h1>
      {/* Back Button  */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 transition"
      >
        <FaArrowLeft className="text-[#9ACD32]" /> {/* YellowGreen tone */} 
        <span className="text-[#9ACD32] font-medium">Go Back</span>
      </button>

      <form className="max-w-md mx-auto p-3" onSubmit={handleSubmit}>
        {/* Make */}
        <VehicleInput
          label="Make"
          name="make"
          value={vehicle.make}
          onChange={handleChange}
          error={errors.make}
        />

        {/* Model */}
        <VehicleInput
          label="Model"
          name="model"
          value={vehicle.model}
          onChange={handleChange}
          error={errors.model}
        />

        {/* Number Plate */}
        <VehicleInput
          label="Number Plate"
          name="number_plate"
          value={vehicle.number_plate}
          onChange={handlePlateChange}
          error={errors.number_plate}
        />

        {/* Seats */}
        <VehicleInput
          label="Seats"
          name="seats"
          value={vehicle.seats}
          onChange={handleChange}
          error={errors.seats}
        />

        {/* Capacity */}
        <VehicleInput
          label="Capacity (cc)"
          name="capacity"
          value={vehicle.capacity}
          onChange={handleChange}
          error={errors.capacity}
        />

        {/* Cylinders */}
        <VehicleInput
          label="Cylinders"
          name="cylinders"
          value={vehicle.cylinders}
          onChange={handleChange}
          error={errors.cylinders}
        />

        {/* Horsepower */}
        <VehicleInput
          label="Horsepower"
          name="horsepower"
          value={vehicle.horsepower}
          onChange={handleChange}
          error={errors.horsepower}
        />

        {/* Economy City */}
        <VehicleInput
          label="Economy (City)"
          name="economy_city"
          value={vehicle.economy_city}
          onChange={handleChange}
          error={errors.economy_city}
        />

        {/* Economy Highway */}
        <VehicleInput
          label="Economy (Highway)"
          name="economy_highway"
          value={vehicle.economy_highway}
          onChange={handleChange}
          error={errors.economy_highway}
        />

        {/* Acceleration */}
        <VehicleInput
          label="Acceleration (0–100 km/h)"
          name="acceleration"
          value={vehicle.acceleration}
          onChange={handleChange}
          error={errors.acceleration}
        />

        {/* Aspiration */}
        <VehicleInput
          label="Aspiration"
          name="aspiration"
          value={vehicle.aspiration}
          onChange={handleChange}
          error={errors.aspiration}
        />

        {/* Dropdowns */}
        <VehicleDropdown
          label="Category"
          options={categoryOptions}
          value={vehicle.category_id}
          onChange={handleSelectChange("category_id")}
        />
        <VehicleDropdown
          label="Transmission"
          options={transmissionOptions}
          value={vehicle.transmission}
          onChange={handleSelectChange("transmission")}
        />
        <VehicleDropdown
          label="Fuel Type"
          options={fuelOptions}
          value={vehicle.fuel_type}
          onChange={handleSelectChange("fuel_type")}
        />
        <VehicleDropdown
          label="Drive Train"
          options={driveTrainOptions}
          value={vehicle.drive_train}
          onChange={handleSelectChange("drive_train")}
        />

        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
