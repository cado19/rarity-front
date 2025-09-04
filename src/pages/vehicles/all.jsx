// This component renders all vehicles
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { baseURL } from "../../constants/url";

import { Link } from "react-router-dom";
import { IoIosAddCircleOutline } from "react-icons/io";
import VehicleNav from "../../components/navs/vehicleNav";
import { Mosaic } from "react-loading-indicators";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import BasicTable from "../../components/utility/basicTable";
import { get_all_vehicles } from "../../api/fetch";

export default function AllVehicles() {
  const columns = [
    {
      accessorKey: "make",
      header: "Make",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "model",
      header: "Model",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "number_plate",
      header: "Number Plate",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "rate",
      header: "Rate",
      cell: (info) => info.getValue(),
    },
    {
      id: "details",
      header: "Details",
      cell: (info) => {
        const vehicle = info.row.original;
        return <Link to={`/vehicle/${vehicle.id}`}>Details</Link>;
      },
    },
  ];

  const [vehicles, setVehicles] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = import.meta.env.VITE_BASE_URL;

  const vehicleUrl = baseUrl + "/api/fleet/all.php";


const getVehicles = async () => {
    try {
      const response = await get_all_vehicles();
      // const fetchedVehicles = response.data.vehicles.map((vehicle) => ({
      //   id: vehicle.id,
      //   make: vehicle.make,
      //   model: vehicle.model,
      //   number_plate: vehicle.number_plate,
      //   rate: vehicle.daily_rate,
      // }));
      setVehicles(response.data.vehicles);
    } catch (error) {
      const errorMessage = "Error: " + error.message;
      setError(errorMessage);
      console.log(errorMessage);
    } finally {
      setLoading(false);
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
  }, []);



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

      <h1 className="text-3xl font-bold text-end text-yellow-600 tracking-wide mb-4 mt-2">
        Vehicles
      </h1>
      <BasicTable columns={columns} columnFilters={columnFilters} data={vehicles} />

    </div>
  );
}
