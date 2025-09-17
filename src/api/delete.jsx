// the functions here will handle deleting data in the backend. Delete operations in this system are updates to the deleted field of any entity.
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;

// function to send delete request to the backend
export const deleteVehicle = async (vehicleId) => {
  const deleteUrl = baseUrl + `/api/fleet/delete.php`;

  try {
    const response = await axios.post(deleteUrl, {vehicle_id: vehicleId});
    return response.data;
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    throw error;
  }
}

// function to send delete request to the backend
export const deleteCustomer = async (customerId) => {
  const deleteUrl = baseUrl + `/api/customers/delete.php?id=${customerId}`;
  const response = await axios.post(deleteUrl)
  return response;
}