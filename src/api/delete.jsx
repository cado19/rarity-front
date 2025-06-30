// the functions here will handle deleting data in the backend. Delete operations in this system are updates to the deleted field of any entity.
import axios from "axios";

export const deleteVehicle = async (vehicleId) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const deleteUrl = baseUrl + `/api/fleet/delete.php`;

  try {
    const response = await axios.post(deleteUrl, {vehicle_id: vehicleId});
    return response.data;
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    throw error;
  }
}