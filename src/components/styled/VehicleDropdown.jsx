import React from 'react'
import Select from 'react-select'

export default function VehicleDropdown({ label, options, value, onChange }) {
  const selected = options.find((opt) => opt.value === value);
  return (
    <div className="mb-5 group mt-5">
      <label className="block text-sm text-gray-500 mb-1">{label}</label>
      <Select options={options} value={selected} onChange={onChange} placeholder={`Select ${label}`} /> 
    </div>
  );

}
