import axios from "axios";

export const get_active_vehicles = async () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const vehicleUrl = baseUrl + "/api/dashboard/active_vehicles.php";

  const response = await axios.get(vehicleUrl);
  return response;
};

export const get_reserved_vehicles = async () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const vehicleUrl = baseUrl + "/api/dashboard/reserved_vehicles.php";

  const response = await axios.get(vehicleUrl);
  return response;
};

export const get_returning_vehicles = async () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const vehicleUrl = baseUrl + "/api/dashboard/due_out_count.php";

  const response = await axios.get(vehicleUrl);
  return response;
};

export const get_all_vehicles = async () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const vehicleUrl = baseUrl + "/api/dashboard/vehicle_count.php";

  const response = await axios.get(vehicleUrl);
  return response;
};
