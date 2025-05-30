// THIS FILE WILL SHOW THE VEHICLE ANALYTICS PAGE. IT WILL SHOW ALL TIME STATS
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
// import { Chart } from "react-google-charts";
import axios from "axios";
import Chart from "react-google-charts";
import { Mosaic } from "react-loading-indicators";
import VehicleAnalyticsInfoBoxes from "../../../components/infoboxes/VehicleAnalyticsInfoBoxes";
import VehicleTotalsTable from "../../../components/vehicles/totalstable";
import Fetchstats from "./fetchstats";

export default function VehicleAnalytics() {
  const [popVehicle, setPopVehicle] = useState([]);
  const [profVehicle, setProfVehicle] = useState([]);
  const [vehicleTotals, setVehicleTotals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // months
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  // years
  const years = [
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
  ];

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const popVehicleUrl = baseUrl + "/api/analytics/vehicle/popular_vehicle.php"; // URL for the most popukar (booked) vehicle
  const profVehicleUrl =
    baseUrl + "/api/analytics/vehicle/profitable_vehicle.php"; // URL for the most propfitable vehicle
  const vehicleTotalsUrl =
    baseUrl + "/api/analytics/vehicle/vehicle_totals.php"; // URL for the total number of vehicles
  const vehicleStatsUrl =
    baseUrl + "/api/analytics/vehicle/month_vehicle_totals.php"; // URL for the monthly vehicle stats


  const navigate = useNavigate();

  // handle submit for the stats form
  const handleSubmit = async (data) => {
    console.log("data: ", data);
    setIsModalOpen(false);
    try {
      const response = await axios.post(vehicleStatsUrl, data);
      if (response.data.status === "Success") {
        const stats = response.data.data;
        navigate("/analytics/vehicle/month-stats", {
          state: {
            stats: stats,
            month: data.month,
            year: data.year,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch data.",
      });
    }
  };

  const getProfVehicle = async () => {
    try {
      const response = await axios.get(profVehicleUrl);
      console.log("profVehicleData: ", response.data);
      setProfVehicle(response.data.data);
    } catch (error) {
      console.error("Error fetching profitable vehicle data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch data.",
      });
    }
  };

  const getPopVehicle = async () => {
    try {
      const response = await axios.get(popVehicleUrl);
      console.log("popVehicleData: ", response.data);
      setPopVehicle(response.data.data);
    } catch (error) {
      console.error("Error fetching popular vehicle data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch data.",
      });
    }
  };

  const getVehicleTotals = async () => {
    try {
      const response = await axios.get(vehicleTotalsUrl);
      console.log("vehicleTotalsData: ", response.data);
      setVehicleTotals(response.data.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch data.",
      });
    }
  };

  useEffect(() => {
    getProfVehicle();
    getPopVehicle();
    getVehicleTotals();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Mosaic color="#32cd32" size={100} />
      </div>
    );
  }

  return (
    <div>
      <VehicleAnalyticsInfoBoxes
        profVehicle={profVehicle}
        popVehicle={popVehicle}
      />
      <button
        className=" ml-4 border border-gray-800 text-gray-800 dark:border-gray-400 dark:text-gray-400 hover:bg-gray-800 hover:text-white dark:hover:bg-gray-400 dark:hover:text-gray-800 font-bold py-2 px-4 mt-3 rounded transition duration-300"
        onClick={() => setIsModalOpen(true)}
      >
        Generate Monthly Stats
      </button>
      <div className="flex flex-col gap-4 mt-2 ml-1 mr-1">
        <VehicleTotalsTable totals={vehicleTotals} />
      </div>

      <Fetchstats
        months={months}
        years={years}
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      />
    </div>
  );
}
