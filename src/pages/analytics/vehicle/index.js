import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
// import { Chart } from "react-google-charts";
import Loading from "../../components/PageContent/Loading";
import axios from "axios";
import VehicleAnalyticsInfoBoxes from "../../../components/infoboxes/VehicleInfoBoxes";
import Chart from "react-google-charts";

export default function VehicleAnalytics() {
  const [popVehicle, setPopVehicle] = useState([]);
  const [profVehicle, setProfVehicle] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const popVehicleUrl = baseUrl + "/api/analytics/vehicle/popular_vehicle.php";
  const profVehicleUrl = baseUrl + "/api/analytics/vehicle/profitable_vehicle.php";
  return (
    <div>
      
    </div>
  )
}
