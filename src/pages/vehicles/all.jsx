// This component renders all vehicles
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { baseURL } from "../../constants/url";
import Loading from "../../components/PageContent/Loading";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { IoIosAddCircleOutline } from "react-icons/io";
import VehicleNav from "../../components/navs/vehicleNav";
import { Mosaic } from "react-loading-indicators";

export default function AllVehicles() {
  const columns = [
    {
      name: "Make",
      selector: (row) => row.make,
      sortable: true,
    },
    {
      name: "Model",
      selector: (row) => row.model,
      sortable: true,
    },
    {
      name: "Number Plate",
      selector: (row) => row.number_plate,
    },
    {
      name: "Rate",
      selector: (row) => row.rate,
      sortable: true,
    },
    {
      name: "Options",
      cell: (row) => <Link to={`/vehicle/${row.id}`}>Details</Link>,
    },
  ];

  const vehicleData = [];

  const addVehicle = (vehicle) => {
    vehicleData.push({
      id: vehicle.id,
      make: vehicle.make,
      model: vehicle.model,
      number_plate: vehicle.number_plate,
      rate: vehicle.daily_rate,
    });
    // console.log(vehicleData);
  };
  const [vehicles, setVehicles] = useState(vehicleData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = import.meta.env.VITE_BASE_URL;

  const vehicleUrl = baseUrl + "/api/fleet/all.php";

  const handleSearch = (e) => {
    // let searchValue;
    // let makeValue;
    // let modelValue;
    // let numberPlateValue;
    // let rateValue;

    // const newRows = vehicleData.filter((row) => {
    //   makeValue = row.make
    //     .toString()
    //     .toLowerCase()
    //     .includes(e.target.value.toLowerCase());

    //   modelValue = row.model
    //     .toLowerCase()
    //     .includes(e.target.value.toLowerCase());

    //   numberPlateValue = row.number_plate
    //     .toLowerCase()
    //     .includes(e.target.value.toLowerCase());

    //   rateValue = row.rate.toLowerCase().includes(e.target.value.toLowerCase());

    //   if (makeValue) {
    //     searchValue = makeValue;
    //   } else if (modelValue) {
    //     searchValue = modelValue;
    //   } else if (numberPlateValue) {
    //     searchValue = numberPlateValue;
    //   } else {
    //     searchValue = rateValue;
    //   }
    //   return searchValue;
    // });

    // setVehicles(newRows);

    let query = e.target.value;
    const newRecords = vehicleData.filter(
      (item) =>
        item.make.toLocaleLowerCase().includes(query.toLocaleLowerCase()) ||
        item.model.toLocaleLowerCase().includes(query.toLocaleLowerCase()) ||
        item.number_plate.toLocaleLowerCase().includes(query.toLocaleLowerCase()) 
      // item.rate.toLocaleLowerCase().includes(query.toLocaleLowerCase()) ||
    );
    setVehicles(newRecords);
  };

  const getVehicles = async () => {
    try {
      await axios.get(vehicleUrl).then((response) => {
        // console.log(response);
        response.data.vehicles.forEach((vehicle) => addVehicle(vehicle));
        console.log(vehicles);
        setLoading(false);
      });
    } catch (error) {
      const errorMessage = "Error: " + error.message;
      setError(errorMessage);
      console.log(errorMessage);
    }
  };
  // console.log("vehicles: " + vehicles);
  // console.log(vehicleData);

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (!loggedIn) {
      navigate("/login");
    }
    getVehicles();
  }, [vehicles]);

  if (error) {
    return (
      <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md">
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md w-full flex items-center justify-center h-full">
        <Mosaic color="#32cd32" size="large" text="Loading..." textColor="" />
      </div>
    );
  }

  return (
    <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md mt-2 mx-3">
      <VehicleNav />

      {/* <h1 className="text-bold text-center">Vehicles </h1> */}
      <div className="flex justify-end">
        <div class="relative mt-2">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search Vehicles..."
            onChange={handleSearch}
          />
        </div>
      </div>
      <DataTable
        columns={columns}
        data={vehicles}
        pagination
        highlightOnHover
        progressPending={loading}
        title="Vehicles"
      />
    </div>
  );
}
