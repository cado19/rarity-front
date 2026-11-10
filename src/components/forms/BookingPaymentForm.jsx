import React, { useState, useEffect } from "react";

export default function PaymentForm({
  initialValues,
  errors,
  setErrors,
  onSubmit,
  submitLabel = "Submit",
}) {
  const [inputs, setInputs] = useState(initialValues);

  useEffect(() => {
    setInputs(initialValues);
  }, [initialValues]);

  const handleChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errs = {};

    if (!inputs.amount) {
      errs.amount = "Amount is required";
    }

    if (!inputs.ref) {
      errs.ref = "Reference is required";
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    onSubmit(inputs);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Amount */}
      <div className="relative z-0 w-full mb-5 group">
        <input
          type="number"
          name="amount"
          value={inputs.amount}
          onChange={handleChange}
          className="block py-2.5 px-0 w-full text-sm border-b-2 border-gray-300 focus:border-blue-600"
        />

        <label>Payment Amount</label>

        {errors.amount && (
          <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
        )}
      </div>

      {/* Ref */}
      <div className="relative z-0 w-full mb-5 group">
        <input
          type="text"
          name="ref"
          value={inputs.ref}
          onChange={handleChange}
          className="block py-2.5 px-0 w-full text-sm border-b-2 border-gray-300 focus:border-blue-600"
        />

        <label>Reference</label>

        {errors.ref && (
          <p className="text-red-500 text-xs mt-1">{errors.ref}</p>
        )}
      </div>

      <button className="mt-2 border-2 border-gray-800 text-gray-800 bg-white hover:bg-gray-800 hover:text-white transition duration-200 rounded-full px-4 py-2">
        {submitLabel}
      </button>
    </form>
  );
}