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
}

// -------------------- Bookings Functions --------------------
export const update_booking_details = async (booking) => {
    const response = await api.post(`/api/bookings/update.php`, booking);
    return response;
}

// -------------------- Vehicle Functions --------------------
export const update_vehicle_pricing = async (pricing) => {
  const response = await api.post(`/api/fleet/update_pricing.php`, pricing)
  return response;
}
