// the functions here will handle updating data in the backend
import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// -------------------- Customer Functions --------------------
export const update_customer_details = async (customer) => {
  const response = await api.post(`/api/customers/update.php`, customer);
  return response;
};

// -------------------- Bookings Functions --------------------
export const update_booking_details = async (booking) => {
  const response = await api.post(`/api/bookings/update.php`, booking);
  return response;
};

export const cancel_booking = async (id) => {
  const response = await api.post(`/api/bookings/cancel.php`, {id});
  return response;
}

// -------------------- Vehicle Functions --------------------
export const update_vehicle_extras = async (extras) => {
  const extrasUrl = baseUrl + `/api/fleet/update_extras.php`;
  const response = await axios.post(extrasUrl, extras);
  return response;
};

export const update_vehicle_basics = async (basics) => {
  const response = await api.post(`/api/fleet/update_base.php`, basics);
  return response;
};

export const update_vehicle_pricing = async (pricing) => {
  const response = await api.post(`/api/fleet/update_pricing.php`, pricing);
  return response;
};

// Update vehicle status
export const update_vehicle_status = async (statusData) => {
  // statusData should be { id: vehicleId, status: "available" | "booked" | "maintenance" }
  const response = await api.post(`/api/fleet/update_status.php`, statusData);
  return response;
};

export const update_work_order = async (payload) => {
  const response = api.post(`/api/workorders/update.php`, payload);
  return response;
};

// -------------------- Vehicle Loan Functions --------------------
// Update loan
export const updateLoan = async (payload) => {
  const response = await api.post("/api/loans/update.php", payload);
  return response.data;
};

// Update repayment
export const updateRepayment = async (payload) => {
  const response = await api.post("/api/repayments/update.php", payload);
  return response.data;
};

// -------------------- Contract Functions --------------------
export const upload_signature = async (payload) => {
  // cdw is optional, defaults to false
  const response = await api.post(`/api/contracts/update.php`, {
    id: payload.id,
    image: payload.image,
    cdw: payload.cdw ? "true" : "false",
  });
  return response;
};

// -------------------- Agent Functions --------------------
export const updateAgent = async (id, agentData) => {
  const response = await api.post(`/api/accounts/update_agent.php`, {
    ...agentData,
    id,
  });
  return response.data;
};
