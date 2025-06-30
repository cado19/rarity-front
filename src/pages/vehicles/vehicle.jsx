// This component renders all vehicles
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaCheck } from "react-icons/fa";
import { baseURL } from "../../constants/url";
import Loading from "../../components/PageContent/Loading";
import VehicleInfoBoxes from "../../components/infoboxes/VehicleInfoBoxes";
import carImg from "../../assets/car-img.png";
import DailyRateForm from "../../components/vehicles/DailyRateForm";
import { Mosaic } from "react-loading-indicators";
import Swal from "sweetalert2";
import { deleteVehicle } from "../../api/delete";

export default function Vehicle() {
  const { id } = useParams();
  //   const carImg = require('../../assets/car-img.png');
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [disabled, setDisabled] = useState(false);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const vehicleUrl = baseUrl + `/api/fleet/read_single.php?id=${id}`;

  const rateUrl = baseUrl + "/api/fleet/update_rate.php";

  //   function to fetch vehicle from backend
  async function getVehicle() {
    try {
      const response = await axios.get(vehicleUrl);
      console.log(response);
      setVehicle(response.data);
      setLoading(false);
      // console.log(vehicle);
    } catch (error) {
      const errorMessage = "Error: " + error.message;
      console.log(errorMessage);
    }
  }
  const validate = (rate) => {
    const errors = {};
    if (!rate) {
      errors.rate = "Rate is required";
    }
    setErrors(errors);
    return errors;
  };

  const submitRate = async (data) => {
    setDisabled(true);
    console.log(data);
    const validationErrors = validate(data.rate);
    if (Object.keys(validationErrors).length > 0) {
      console.log("Form could not be submitted");
      console.log(validationErrors);
      setDisabled(false);
    } else {
      const response = await axios.post(rateUrl, data);
      Swal.fire({
        title: response.data.status,
        text: response.data.message,
        icon: response.data.status === "Success" ? "success" : "error",
        confirmButtonText: "OK",
      });
      getVehicle(); // Refresh vehicle data after updating rate
      setDisabled(false);
    }
  };

  const handleDelete = async () => {
    setDisabled(true);
    Swal.fire({
      title: "Are you sure?",
      text: "Deleting this vehicle will remove it from the system.",
      confirmButtonText: "Yes",
      denyButtonText: "No",
      showDenyButton: true,
      showConfirmButton: true,
    }).then((decision) => {
      if (decision.isConfirmed) {
        deleteVehicle(id).then((result) => {

          console.log(result);
          console.log(result.status);
          if (result.status === "Success") {
            Swal.fire({
              title: "Success",
              text: "Vehicle deleted successfully",
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              navigate("/vehicles");
            });
          } else {
            Swal.fire({
              title: "Error",
              text: result.message,
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        });
      }
    });
    setDisabled(false);
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (!loggedIn) {
      navigate("/login");
    }
    getVehicle();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md w-full flex items-center justify-center h-full">
        <Mosaic color="#32cd32" size="large" text="Loading..." textColor="" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 ml-1">
      <VehicleInfoBoxes
        make={vehicle.make}
        model={vehicle.model}
        number_plate={vehicle.number_plate}
        id={vehicle.id}
        category={vehicle.category_name}
      />
      <div className="flex flex-row gap-4 w-full">
        {/* vehicle image  */}
        <div className="w-[20rem] h-[25rem] bg-white p-4 rounded-sm border border-gray flex flex-col">
          <img src={carImg} />
        </div>
        {/* vehicle basic details  */}
        <div className=" bg-white p-4 rounded-sm border border-gray-200 flex flex-col flex-1">
          <strong className="text-gray-700 font-medium text-4xl">
            Details
          </strong>
          <p className="text-sm mt-2">
            The {vehicle.make} {vehicle.model} is a {vehicle.drive_train} car
            loved by many. It can carry {vehicle.seats} people. It's
            transmission is {vehicle.transmission} and it uses {vehicle.fuel}{" "}
            fuel
          </p>
          <div className="mt-4 text-2xl">
            {vehicle.daily_rate}/-
            <span className="text-amber-600">(Per Day)</span>
          </div>
          {/* daily rate form  */}
          <strong className="text-gray-700 font-medium text-xl mt-4 italic">
            Update Daily Rate
          </strong>

          <DailyRateForm
            vehicle_id={vehicle.id}
            onSubmit={submitRate}
            errors={errors}
            disabled={disabled}
          />
          {/* Key Features  */}
          <strong className="text-gray-700 font-medium text-xl mt-4">
            Key Features
          </strong>
          <ul className="ml-3">
            <li className="text-md italic flex flex-row">
              <span>
                <FaCheck className="text-amber-400" />
              </span>{" "}
              {vehicle.seats} seater
            </li>
            <li className="text-md italic flex flex-row">
              <span>
                <FaCheck className="text-amber-400" />
              </span>
              {vehicle.category_name}{" "}
            </li>
            <li className="text-md italic flex flex-row">
              <span>
                <FaCheck className="text-amber-400" />
              </span>
              {vehicle.drive_train}{" "}
            </li>
            <li className="text-md italic flex flex-row">
              <span>
                <FaCheck className="text-amber-400" />
              </span>
              {vehicle.color}{" "}
            </li>
          </ul>
          <p className="mt-4">
            <button
              onClick={handleDelete}
              disabled={disabled}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow-md transition duration-300 ease-in-out"
            >
              Delete
            </button>
          </p>
        </div>
      </div>
      {/* Vehicle will show up here */}
    </div>
  );
}
