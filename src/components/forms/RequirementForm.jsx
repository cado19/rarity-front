// src/components/forms/RequirementForm.jsx
import React, { useState, useEffect } from "react";
import Select from "react-select";
import { fetchAgents, get_booking_vehicles } from "../../api/fetch";
import Loading from "../PageContent/Loading";
import VehicleInput from "../styled/VehicleInput";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

export default function RequirementForm({
  initialData = {},
  onSubmit,
  mode = "create",
}) {
  const [vehicles, setVehicles] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    req_title: "",
    req_description: "",
    req_priority: "medium",
    req_status: "pending",
    req_category: "maintenance",
    req_assigned_to: "",
    req_cost_estimate: "",
    req_actual_cost: "",
    req_due_date: "",
    req_completed_at: "",
    req_notes: "",
    ...initialData, // prefill when editing
  });

  const loadAgents = async () => {
    try {
      const res = await fetchAgents();
      console.log("Agent response: ", res);
      setAgents(
        res.data.map((a) => ({
          value: a.id,
          label: a.name,
        })),
      );
      setLoading(false); // Last thing to be loaded so loading set to false here
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

  // useEffect(() => {
  //   setFormData((prev) => ({ ...prev, ...initialData }));
  // }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.req_title?.trim()) {
      newErrors.req_title = "Title is required";
    }

    if (!["high", "medium", "low"].includes(formData.req_priority)) {
      newErrors.req_priority = "Priority must be high, medium, or low";
    }

    if (
      !["pending", "in_progress", "completed", "deferred"].includes(
        formData.req_status,
      )
    ) {
      newErrors.req_status = "Invalid status";
    }

    // if (formData.req_cost_estimate && isNaN(formData.req_cost_estimate)) {
    //   newErrors.req_cost_estimate = "Cost estimate must be a number";
    // }

    if (formData.req_due_date && isNaN(Date.parse(formData.req_due_date))) {
      newErrors.req_due_date = "Invalid date format";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(formData); // parent handles API call
  };

  if (loading) return <Loading />;

  return (
    <div className="bg-white px-4 pb-4 pt-4 rounded border-gray-200 flex-1 shadow-md mt-2 mx-3">
      <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-4xl my-5 text-center">
        {mode === "create" ? "New Requirement" : "Edit Requirement"}
      </h1>
      <form onSubmit={handleSubmit} className="w-4/5 mx-auto">
        <VehicleInput
          label="Title"
          name="req_title"
          value={formData.req_title}
          onChange={handleChange}
        />
        {errors.req_title && <p className="text-red-600 text-sm">{errors.req_title}</p>}

        <VehicleInput
          label="Description"
          name="req_description"
          value={formData.req_description}
          onChange={handleChange}
        />

        {/* Priority */}
        <div className="mb-5 group">
          <label>Priority</label>
          <Select
            name="req_priority"
            value={
              formData.req_priority
                ? { value: formData.req_priority, label: formData.req_priority }
                : null
            }
            onChange={(selectedOption) =>
              setFormData((prev) => ({
                ...prev,
                req_priority: selectedOption ? selectedOption.value : "",
              }))
            }
            options={[
              { value: "high", label: "High" },
              { value: "medium", label: "Medium" },
              { value: "low", label: "Low" },
            ]}
            className="react-select-container"
            classNamePrefix="react-select"
          />
          {errors.req_priority && <p className="text-red-600 text-sm">{errors.req_priority}</p>}
        </div>

        {/* Status */}
        <div className="mb-5 group">
          <label>Status</label>
          <Select
            name="req_status"
            value={
              formData.req_status
                ? { value: formData.req_status, label: formData.req_status }
                : null
            }
            onChange={(selectedOption) =>
              setFormData((prev) => ({
                ...prev,
                req_status: selectedOption ? selectedOption.value : "",
              }))
            }
            options={[
              { value: "pending", label: "Pending" },
              { value: "in_progress", label: "In Progress" },
              { value: "completed", label: "Completed" },
              { value: "deferred", label: "Deferred" },
            ]}
            className="react-select-container"
            classNamePrefix="react-select"
          />
          {errors.req_status && <p className="text-red-600 text-sm">{errors.req_status}</p>}
        </div>

        <div className="mb-5 group">
          <label>Category</label>
          <Select
            name="req_category"
            value={
              formData.req_category
                ? { value: formData.req_category, label: formData.req_category }
                : null
            }
            onChange={(selectedOption) =>
              setFormData((prev) => ({
                ...prev,
                req_category: selectedOption ? selectedOption.value : "",
              }))
            }
            options={[
              { value: "maintenance", label: "Maintenance" },
              { value: "safety", label: "Safety" },
              { value: "cosmetic", label: "Cosmetic" },
              { value: "other", label: "Other" },
            ]}
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>

        <div className="mb-5 group">
          <label>Assigned to</label>
          <Select
            name="req_assigned_to"
            value={
              formData.req_assigned_to
                ? agents.find((a) => a.value === formData.req_assigned_to)
                : null
            }
            options={agents}
            onChange={(option) => {
              setSelectedAgent(option);
              setFormData((prev) => ({
                ...prev,
                req_assigned_to: option ? option.value : "",
              }));
            }}
            placeholder="Assign agent"
            isSearchable
          />
        </div>

        <div className="mb-5 group">
          <label>Due Date</label>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Select due date"
              value={
                formData.req_due_date ? new Date(formData.req_due_date) : null
              }
              onChange={(newValue) =>
                setFormData((prev) => ({
                  ...prev,
                  req_due_date: newValue
                    ? newValue.toISOString().split("T")[0]
                    : "",
                }))
              }
              slotProps={{
                textField: {
                  className:
                    "block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-600",
                },
              }}
            />
          </LocalizationProvider>
          {errors.req_due_date && <p className="text-red-600 text-sm">{errors.req_due_date}</p>}
        </div>

        <VehicleInput
          name="req_cost_estimate"
          value={formData.req_cost_estimate}
          onChange={handleChange}
          label="Cost Estimate"
        />

        <VehicleInput
          name="req_notes"
          value={formData.req_notes}
          onChange={handleChange}
          label="Notes"
        />

        {/* Submit */}
        <div className="mt-6 text-center">
          <button
            type="submit"
            className="border border-green-600 text-green-600 px-6 py-2 rounded hover:bg-green-700 hover:text-white transition"
          >
            {mode === "create" ? "Create Requirement" : "Update Requirement"}
          </button>
        </div>
      </form>
    </div>
  );
}
