import { useState, useEffect } from "react";
import Select from "react-select";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { get_booking_vehicles } from "../../api/fetch";

export default function WorkOrderForm({ existingOrder, handleSubmit }) {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [items, setItems] = useState(existingOrder?.items || []);
  const [scheduledDate, setScheduledDate] = useState(
    existingOrder?.scheduled_date || null,
  );
  const [completionDate, setCompletionDate] = useState(
    existingOrder?.completion_date || null,
  );

  const [inputs, setInputs] = useState({
    vehicle_id: existingOrder?.vehicle_id || "",
    title: existingOrder?.title || "",
    description: existingOrder?.description || "",
    mileage: existingOrder?.mileage || "",
    scheduled_date: existingOrder?.scheduled_date || "",
    completion_date: existingOrder?.completion_date || null,
    labor_cost: existingOrder?.labor_cost || "",
    parts_cost: existingOrder?.parts_cost || "",
    status: existingOrder?.status || "open",
  });

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const res = await get_booking_vehicles();
        setVehicles(
          res.vehicles.map((v) => ({
            value: v.id,
            label: `${v.make} ${v.model} ${v.number_plate}`,
          })),
        );
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };
    loadVehicles();
  }, []);

  const handleChange = (name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (setter, field, value) => {
    setter(value);
    setInputs((prev) => ({
      ...prev,
      [field]: value ? formatDate(value) : "",
    }));
  };

  const addCustomItem = () => {
    setItems([...items, { item: "", cost: 0, quantity: 1 }]);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  return (
    <div className="bg-white px-4 pb-4 pt-4 rounded border-gray-200 flex-1 shadow-md mt-2 mx-3">
      <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-4xl my-5 text-center">
        {existingOrder ? "Edit Work Order" : "New Work Order"}
      </h1>

      <form
        onSubmit={(e) => handleSubmit(e, inputs, items)}
        className="w-4/5 mx-auto"
      >
        {/* Vehicle select */}
        <div className="mb-5 group">
          <Select
            options={vehicles}
            value={selectedVehicle}
            onChange={(option) => {
              setSelectedVehicle(option);
              handleChange("vehicle_id", option.value);
            }}
            placeholder="Select Vehicle"
            isSearchable
          />
        </div>

        {/* Title */}
        <div className="mb-5 group">
          <input
            type="text"
            value={inputs.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Work Order Title"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Description */}
        <div className="mb-5 group">
          <textarea
            value={inputs.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Description"
            className="w-full border rounded px-3 py-2"
          />
        </div>
        
        {/* Mileage */}
        <div className="mb-5 group">
          <textarea
            value={inputs.mileage}
            onChange={(e) => handleChange("mileage", e.target.value)}
            placeholder="Mileage (Just number. Don't add 'Km')"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Date Pickers */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <div className="mb-5 group">
            <label>Scheduled Date</label>
            <DatePicker
              value={scheduledDate}
              onChange={(val) =>
                handleDateChange(setScheduledDate, "scheduled_date", val)
              }
              slotProps={{
                textField: {
                  className:
                    "block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-600",
                },
              }}
            />
          </div>

          {/* Completion Date */}
          <div className="mb-5 group">
            <label className="block text-sm text-gray-600 mb-1">
              Completion Date
            </label>
            <DatePicker
              value={completionDate}
              onChange={(val) =>
                handleDateChange(setCompletionDate, "completion_date", val)
              }
              slotProps={{
                textField: {
                  className:
                    "block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-600",
                },
              }}
            />

            {/* Clear button */}
            {completionDate && (
              <button
                type="button"
                onClick={() => {
                  setCompletionDate(null);
                  setInputs((prev) => ({ ...prev, completion_date: null }));
                }}
                className="mt-2 px-3 py-1 border border-red-600 text-red-600 rounded hover:bg-red-700 hover:text-white transition"
              >
                Clear Completion Date
              </button>
            )}

            {/* Mark as completed checkbox */}
            <div className="mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="markCompleted"
                checked={inputs.status === "completed"}
                onChange={(e) => {
                  if (e.target.checked) {
                    const today = new Date();
                    const formatted = formatDate(today);
                    setCompletionDate(today);
                    setInputs((prev) => ({
                      ...prev,
                      completion_date: formatted,
                      status: "completed",
                    }));
                  } else {
                    setCompletionDate(null);
                    setInputs((prev) => ({
                      ...prev,
                      completion_date: null,
                      status: "open",
                    }));
                  }
                }}
              />
              <label htmlFor="markCompleted" className="text-sm text-gray-700">
                Mark as Completed (set today’s date)
              </label>
            </div>
          </div>

          {/* Status */}
          <div className="mb-5 group">
            <label className="block text-sm text-gray-600 mb-1">Status</label>
            <select
              value={inputs.status || ""}
              onChange={(e) => handleChange("status", e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </LocalizationProvider>

        {/* Costs */}
        <div className="mb-5 group">
          <label>Labor Cost</label>
          <input
            type="number"
            value={inputs.labor_cost}
            onChange={(e) => handleChange("labor_cost", e.target.value)}
            placeholder="Labor Cost"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="mb-5 group">
          <label>Parts Cost</label>
          <input
            type="number"
            value={inputs.parts_cost}
            onChange={(e) => handleChange("parts_cost", e.target.value)}
            placeholder="Parts Cost"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Items Section */}
        <h3 className="text-lg font-semibold mb-2">Work Order Items</h3>
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              value={item.item}
              onChange={(e) => updateItem(i, "item", e.target.value)}
              placeholder="Item name"
              className="flex-1 border rounded px-2 py-1"
            />
            {/* Cost */}
            <div className="w-28">
              <label className="block text-sm text-gray-600 mb-1">Cost</label>
              <input
                type="number"
                value={item.cost}
                onChange={(e) => updateItem(i, "cost", e.target.value)}
                placeholder="Price"
                className="w-full border rounded px-2 py-1"
              />
            </div>

            {/* Quantity */}
            <div className="w-20">
              <label className="block text-sm text-gray-600 mb-1">Qty</label>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateItem(i, "quantity", e.target.value)}
                placeholder="Quantity"
                className="w-full border rounded px-2 py-1"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addCustomItem}
          className="border border-blue-600 text-blue-600 px-3 py-1 rounded hover:bg-blue-700 hover:text-white transition"
        >
          + Add Item
        </button>

        {/* Submit */}
        <div className="mt-6 text-center">
          <button
            type="submit"
            className="border border-green-600 text-green-600 px-6 py-2 rounded hover:bg-green-700 hover:text-white transition"
          >
            {existingOrder ? "Update Work Order" : "Create Work Order"}
          </button>
        </div>
      </form>
    </div>
  );
}

// Utility functions for formatting
function formatDate(date) {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0]; // YYYY-MM-DD
}
