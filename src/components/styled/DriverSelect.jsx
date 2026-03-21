import React from "react";

export default function DriverSelect({ drivers, value, onChange, error }) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Driver
      </label>
      <select
        name="driver"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full border border-gray-300 rounded-md p-2"
      >
        <option value="">-- Choose Driver --</option>
        {drivers.map((d) => (
          <option key={d.value} value={d.value}>
            {d.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}