import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

// VEHICLES FETCH
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

export const get_vehicle_extras = async (id) => {
  const response = await axios.get(baseUrl + `/api/fleet/read_extras.php?id=${id}`);
  return response;
}

export const get_vehicle_base = async (id) => {
  const response = await axios.get(baseUrl + `/api/fleet/read_base.php?id=${id}`);
  return response;
}

// BOOKINGS FETCH
// get all bookings
export const fetchBookings = async () => {
  const response = await axios.get(baseUrl + "/api/bookings/all.php");
  return response;
};

// get cancelled bookings
export const fetchCancelledBookings = async () => {
  const response = await axios.get(baseUrl + "/api/bookings/cancelled.php");
  return response;
};

// get completed bookings
export const fetchCompletedBookings = async () => {
  const response = await axios.get(baseUrl + "/api/bookings/completed.php");
  return response;
};

// get upcoming bookings
export const fetchUpcomingBookings = async () => {
  const response = await axios.get(baseUrl + "/api/bookings/upcoming.php");
  return response;
};

// get active bookings
export const fetchActiveBookings = async () => {
  const response = await axios.get(baseUrl + "/api/bookings/active.php");
  return response;
};

// CUSTOMERS FETCH
export const fetchCustomers = async () => {
  const response = await axios.get(baseUrl + "/api/customers/all.php");
  return response;
};
