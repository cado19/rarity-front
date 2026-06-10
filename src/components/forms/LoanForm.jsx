import { useState } from "react";
import Select from "react-select";

export default function LoanForm({ onSubmit, initialData = {}, mode = "create" }) {
  const [formData, setFormData] = useState({
    principal: initialData.principal || "",
    interest_rate: initialData.interest_rate || "",
    start_date: initialData.start_date || "",
    end_date: initialData.end_date || "",
    repayment_method: initialData.repayment_method || "manual",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.principal) newErrors.principal = "Principal is required";
    if (formData.interest_rate && isNaN(formData.interest_rate)) {
      newErrors.interest_rate = "Interest rate must be numeric";
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
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="w-4/5 mx-auto space-y-5">
      {/* Principal */}
      <div>
        <label className="block font-medium">Principal</label>
        <input
          type="number"
          name="principal"
          value={formData.principal}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        {errors.principal && <p className="text-red-600 text-sm">{errors.principal}</p>}
      </div>

      {/* Interest Rate */}
      <div>
        <label className="block font-medium">Interest Rate (%)</label>
        <input
          type="number"
          name="interest_rate"
          value={formData.interest_rate}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          step="0.01"
        />
        {errors.interest_rate && <p className="text-red-600 text-sm">{errors.interest_rate}</p>}
      </div>

      {/* Start Date */}
      <div>
        <label className="block font-medium">Start Date</label>
        <input
          type="date"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* End Date */}
      <div>
        <label className="block font-medium">End Date</label>
        <input
          type="date"
          name="end_date"
          value={formData.end_date}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Repayment Method */}
      <div>
        <label className="block font-medium">Repayment Method</label>
        <Select
          name="repayment_method"
          value={
            formData.repayment_method
              ? { value: formData.repayment_method, label: formData.repayment_method }
              : null
          }
          onChange={(selectedOption) =>
            setFormData((prev) => ({
              ...prev,
              repayment_method: selectedOption ? selectedOption.value : "manual",
            }))
          }
          options={[
            { value: "manual", label: "Manual" },
            { value: "revenue", label: "Revenue-based" },
            { value: "hybrid", label: "Hybrid" },
          ]}
          className="react-select-container"
          classNamePrefix="react-select"
        />
      </div>

      {/* Submit */}
      <div className="text-center">
        <button
          type="submit"
          className="border border-green-600 text-green-600 px-6 py-2 rounded hover:bg-green-700 hover:text-white transition"
        >
          {mode === "create" ? "Create Loan" : "Update Loan"}
        </button>
      </div>
    </form>
  );
}
