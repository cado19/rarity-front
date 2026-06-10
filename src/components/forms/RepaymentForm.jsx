import { useState } from "react";
import Select from "react-select";

export default function RepaymentForm({ onSubmit, initialData = {}, mode = "create" }) {
  const [formData, setFormData] = useState({
    amount: initialData.amount || "",
    source: initialData.source || "manual",
    booking_id: initialData.booking_id || "",
    paid_at: initialData.paid_at || "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.amount) newErrors.amount = "Amount is required";
    if (!formData.paid_at) newErrors.paid_at = "Payment date is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="w-4/5 mx-auto space-y-5">
      {/* Amount */}
      <div>
        <label className="block font-medium">Amount (KES)</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        {errors.amount && <p className="text-red-600 text-sm">{errors.amount}</p>}
      </div>

      {/* Source */}
      <div>
        <label className="block font-medium">Source</label>
        <Select
          name="source"
          value={{ value: formData.source, label: formData.source }}
          onChange={(selectedOption) =>
            setFormData((prev) => ({
              ...prev,
              source: selectedOption ? selectedOption.value : "manual",
            }))
          }
          options={[
            { value: "manual", label: "Manual" },
            { value: "booking", label: "Booking" },
          ]}
          className="react-select-container"
          classNamePrefix="react-select"
        />
      </div>

      {/* Booking ID (optional) */}
      {formData.source === "booking" && (
        <div>
          <label className="block font-medium">Booking ID</label>
          <input
            type="text"
            name="booking_id"
            value={formData.booking_id}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      )}

      {/* Paid At */}
      <div>
        <label className="block font-medium">Payment Date</label>
        <input
          type="date"
          name="paid_at"
          value={formData.paid_at}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        {errors.paid_at && <p className="text-red-600 text-sm">{errors.paid_at}</p>}
      </div>

      {/* Submit */}
      <div className="text-center">
        <button
          type="submit"
          className="border border-green-600 text-green-600 px-6 py-2 rounded hover:bg-green-700 hover:text-white transition"
        >
          {mode === "create" ? "Add Payment" : "Update Payment"}
        </button>
      </div>
    </form>
  );
}
