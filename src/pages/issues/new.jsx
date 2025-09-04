import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Mosaic } from "react-loading-indicators";
import { save_issue } from "../../api/post";
import VehicleInput from "../../components/styled/VehicleInput";
import VehicleTextarea from "../../components/styled/VeehicleTextArea";
import VehicleDropdown from "../../components/styled/VehicleDropdown";
import { get_all_vehicles } from "../../api/fetch";
import { useNavigate } from "react-router-dom";

export default function NewIssue() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    vehicle_id: "",
    title: "",
    description: "",
    cost: "",
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchVehicles = async () => {
    try {
      const res = await get_all_vehicles();
      const fetchedVehicles = res.data.vehicles.map((vehicle) => ({
        label: `${vehicle.make}  ${vehicle.model}  ${vehicle.number_plate}`,
        value: `${vehicle.id}`,
      }));
      setVehicles(fetchedVehicles);
    } catch (err) {
      console.error("Failed to fetch vehicles:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchVehicles();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.vehicle_id) newErrors.vehicle_id = "Vehicle is required";
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.cost || Number(formData.cost) <= 0)
      newErrors.cost = "Cost must be greater than 0";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      const response = await save_issue(formData); // Replace with your actual API call
      console.log(response);
      if (response.data.status == "Success") {
        const id = response.data.issue_id;
        navigate(`/issues/${id}`, {
          state: { message: "Issue created successfully" },
        });
      } else {
        Swal.fire({
          title: "An error occured while updating.",
          text: "Please try again",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
      setSuccess(true);
      setFormData({ vehicle_id: "", title: "", description: "", cost: "" });
      setErrors({});
    } catch (err) {
      console.error("Issue creation failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md w-full flex items-center justify-center h-full">
        <Mosaic color="#32cd32" size="large" text="Loading..." textColor="" />
      </div>
    );
  }

  return (
    <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md mt-2 mx-3">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md space-y-4 max-w-xl mx-auto"
      >
        <h2 className="text-xl font-bold text-yellow-700">Add New Issue</h2>

        <VehicleDropdown
          label="Vehicle"
          options={vehicles}
          value={formData.vehicle_id}
          onChange={(selectedOption) =>
            setFormData((prev) => ({
              ...prev,
              vehicle_id: selectedOption?.value,
            }))
          }
        />
        {errors.vehicle_id && (
          <p className="text-red-500 text-xs mt-1">{errors.vehicle_id}</p>
        )}

        <VehicleInput
          label="Title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
        />

        <VehicleTextarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
        />

        <VehicleInput
          label="Cost"
          type="number"
          name="cost"
          value={formData.cost}
          onChange={handleChange}
          error={errors.cost}
        />

        <button
          type="submit"
          disabled={submitting}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
        >
          {submitting ? "Submitting..." : "Add Issue"}
        </button>

        {success && (
          <p className="text-green-600 text-sm mt-2">
            Issue added successfully!
          </p>
        )}
      </form>
    </div>
  );
}
