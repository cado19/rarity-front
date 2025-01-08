// This component renders all vehicles 
import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseURL } from "../../constants/url";
import Loading from "../../components/PageContent/Loading";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";

export default function AllVehicles() {
  const columns = [
    {
      name: "Make",
      selector: (row) => row.make,
      sortable: true
    },
    {
      name: "Model",
      selector: (row) => row.model,
      sortable: true
    },
    {
      name: "Number Plate",
      selector: (row) => row.number_plate,
    },
    {
      name: "Rate",
      selector: (row) => row.daily_rate,
      sortable: true
    },
    {
      name: "Options",
      cell: row => <Link to={`/vehicle/${row.id}`}>Details</Link>
    }
  ];

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const vehicleUrl = baseURL + "/api/fleet/all.php";
  useEffect(() => {
    getVehicles();
  }, []);

  async function getVehicles() {
    try {
      const response = await axios.get(vehicleUrl);
      console.log(response);
      setVehicles(response.data.vehicles);
      setLoading(false);
      // console.log(vehicles);
    } catch (error) {
      const errorMessage = "Error: " + error.message;
      console.log(errorMessage);
    }
  }
  console.log("vehicles: " + vehicles);
  if (loading) {
    return (
      <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md">
        <Loading />
      </div>
    );
  }

  return (
    <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md mt-2 mx-3">
      {/* <h1 className="text-bold text-center">Vehicles </h1> */}
      <DataTable columns={columns} data={vehicles} title="Vehicles" />
    </div>
  );
}
