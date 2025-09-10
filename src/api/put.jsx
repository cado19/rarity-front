// the functions here will handle updating data in the backend
import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

// CUSTOMER FUNCTIONS
export const update_customer_details = async (customer) => {
    const endPoint = baseUrl + `/api/customers/update.php`;
    const response = await axios.post(endPoint, customer);
    return response;
}
