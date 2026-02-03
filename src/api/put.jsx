// the functions here will handle updating data in the backend
import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// CUSTOMER FUNCTIONS
export const update_customer_details = async (customer) => {
    const response = await api.post(`/api/customers/update.php`, customer);
    return response;
}

export const update_booking_details = async (booking) => {
    const response = await api.post(`/api/bookings/update.php`, booking);
    return response;
}
