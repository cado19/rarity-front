// src/components/forms/AgentForm.jsx
import React from "react";
import PhoneInput from "react-phone-number-input";

export default function AgentForm({
  inputs,
  setInputs,
  errors,
  phone,
  setPhone,
  roles,
  disabled,
  handleChange,
  handleSubmit,
}) {
  const phoneChange = (value) => {
    setPhone(value);
    setInputs({
      ...inputs,
      phone_number: value,
    });
  };

  const toggleRole = (roleId) => {
    setInputs((prev) => {
      const alreadySelected = prev.role_ids.includes(roleId);
      return {
        ...prev,
        role_ids: alreadySelected
          ? prev.role_ids.filter((id) => id !== roleId)
          : [...prev.role_ids, roleId],
      };
    });
  };

  return (
    <form className="max-w-md mx-auto p-3" onSubmit={handleSubmit}>
      {/* Name */}
      <div className="relative z-0 w-full mb-5 group">
        <input
          type="text"
          name="name"
          value={inputs.name}
          onChange={handleChange}
          placeholder="Name"
          required
          className="block py-2.5 px-0 w-full text-sm border-b-2 border-gray-300 focus:border-blue-600"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      {/* Country */}
      <div className="relative z-0 w-full mb-5 group">
        <input
          type="text"
          name="country"
          value={inputs.country}
          onChange={handleChange}
          placeholder="Country"
          required
          className="block py-2.5 px-0 w-full text-sm border-b-2 border-gray-300 focus:border-blue-600"
        />
        {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
      </div>

      {/* Email */}
      <div className="relative z-0 w-full mb-5 group">
        <input
          type="email"
          name="email"
          value={inputs.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="block py-2.5 px-0 w-full text-sm border-b-2 border-gray-300 focus:border-blue-600"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      {/* Phone */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">Telephone</label>
        <PhoneInput
          name="phone_number"
          defaultCountry="KE"
          value={phone}
          onChange={phoneChange}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 
                     focus:border-blue-500 focus:ring-blue-500 focus:outline-none shadow-sm"
          inputClass="w-full border-none focus:ring-0 focus:outline-none"
        />
        {errors.phone_number && (
          <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>
        )}
      </div>

      {/* Roles */}
      <div className="mb-5">
        <p className="font-medium mb-2">Assign Roles:</p>
        <div className="grid grid-cols-3 gap-4">
          {roles.map((role) => (
            <label
              key={role.id}
              className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-blue-600"
                checked={inputs.role_ids.includes(role.id)}
                onChange={() => toggleRole(role.id)}
              />
              <span className="text-gray-700">{role.name}</span>
            </label>
          ))}
        </div>
        {errors.role_ids && (
          <p className="text-red-500 text-xs mt-1">{errors.role_ids}</p>
        )}
      </div>

      {/* Submit */}
      <button
        disabled={disabled}
        className="border-2 border-gray-800 text-gray-800 bg-white hover:bg-gray-800 hover:text-white transition duration-200 rounded-full px-4 py-2"
      >
        Submit
      </button>
    </form>
  );
}
