import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// -------------------- Vehicle Functions --------------------
export const update_vehicle_extras = async (extras) => {
  const extrasUrl = baseUrl + `/api/fleet/update_extras.php`;
  const response = await axios.post(extrasUrl, extras);
  return response;
};

export const update_vehicle_basics = async (basics) => {
  const extrasUrl = baseUrl + `/api/fleet/update_base.php`;
  const response = await axios.post(extrasUrl, basics);
  return response;
};

export const save_issue = async (issues) => {
  const issuesUrl = baseUrl + `/api/fleet/create_issue.php`;
  const response = await axios.post(issuesUrl, issues);
  return response;
};

// -------------------- Bookings Functions --------------------

// save booking
export const save_booking = async (payload) => {
  const response = await api.post("/api/bookings/create.php", payload);
  return response;
};

// save one day booking
export const save_one_day_booking = async (payload) => {
  const response = await api.post("/api/bookings/create_one_day.php", payload);
  return response;
};
