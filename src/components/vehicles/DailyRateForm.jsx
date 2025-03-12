import React, { useState } from "react";

export default function DailyRateForm({ vehicle_id }) {
  const [rate, setRate] = useState('');

  const handleSubmit = (e) => {
    const validationErrors = validate(rate);
  }

  const validate = (rate) => {
    const errors = {};
    if(!rate){
      errors.rate = "Rate is required";
    }
    return errors;
  }

  return (
    <div>
      <form>
        <input type="hidden" name="vehicle_id" value={vehicle_id} />
        <div className="flex items-center border-b border-teal-500 py-2">
          <input
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder="8000"
            aria-label="Full name"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
          <button
            className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
            type="button"
          >
            Update
          </button>
        </div>
        <label></label>
      </form>
    </div>
  );
}
