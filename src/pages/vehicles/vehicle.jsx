// This component renders all vehicles
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaCheck } from "react-icons/fa";
import { baseURL } from "../../constants/url";
import Loading from "../../components/PageContent/Loading";
import VehicleInfoBoxes from "../../components/infoboxes/VehicleInfoBoxes";
import carImg from '../../assets/car-img.png';
import DailyRateForm from "../../components/vehicles/DailyRateForm";

export default function Vehicle() {
  const { id } = useParams();
//   const carImg = require('../../assets/car-img.png');
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const vehicleUrl = baseURL + `/api/fleet/read_single.php?id=${id}`;

  //   function to fetch vehicle from backend
  async function getVehicle() {
    try {
      const response = await axios.get(vehicleUrl);
      //   console.log(response);
      setVehicle(response.data);
      setLoading(false);
      console.log(vehicle);
    } catch (error) {
      const errorMessage = "Error: " + error.message;
      console.log(errorMessage);
    }
  }
  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (!loggedIn){
      navigate("/login");
    };
    getVehicle();
  }, []);

  if (loading) {
    return (
      <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md">
        <Loading />
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
      <div className='flex flex-row gap-4 w-full'>
        {/* vehicle image  */}
        <div className='w-[20rem] h-[25rem] bg-white p-4 rounded-sm border border-gray flex flex-col'>
            <img src={carImg} />
        </div>
        {/* vehicle basic details  */}
        <div className='h-[25rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col flex-1'>
            <strong className='text-gray-700 font-medium text-4xl'>Details</strong>
            <p className="text-sm mt-2">The {vehicle.make} {vehicle.model} is a {vehicle.drive_train} car loved by many. It can carry {vehicle.seats} people. It's transmission is {vehicle.transmission} and it uses {vehicle.fuel} fuel</p>
            <div className="mt-4 text-2xl">
                {vehicle.daily_rate}/-
                <span className="text-amber-600">(Per Day)</span>
            </div>
            {/* daily rate form  */}
            <strong className='text-gray-700 font-medium text-xl mt-4 italic'>Update Daily Rate</strong>
            <DailyRateForm vehicle_id={vehicle.id} />
            {/* Key Features  */}
            <strong className='text-gray-700 font-medium text-xl mt-4'>Key Features</strong>
            <ul className="ml-3">
                <li className="text-md italic flex flex-row"><span><FaCheck className="text-amber-400" /></span> {vehicle.seats} seater</li>
                <li className="text-md italic flex flex-row"><span><FaCheck className="text-amber-400" /></span>{vehicle.category_name} </li>
                <li className="text-md italic flex flex-row"><span><FaCheck className="text-amber-400" /></span>{vehicle.drive_train} </li>
                <li className="text-md italic flex flex-row"><span><FaCheck className="text-amber-400" /></span>{vehicle.color} </li>
            </ul>
        </div>
      </div>
      {/* Vehicle will show up here */}
    </div>
  );
}
