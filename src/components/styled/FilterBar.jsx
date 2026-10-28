import React from "react";
import StyledButton from "./StyledButton";

export default function FilterBar({ month, year, setMonth, setYear, onReset }) {
  return (
    <div className="flex gap-4 mb-6 items-end">
      {/* Month Select */}
      <div className="w-full">
        <label className="block text-sm text-gray-500 mb-1">Month</label>
        <select
          value={month ?? new Date().getMonth() + 1}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="block py-2.5 px-0 w-full text-sm border-b-2 border-gray-300 focus:border-blue-600 bg-transparent"
        >
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
      </div>

      {/* Year Select */}
      <div className="w-full">
        <label className="block text-sm text-gray-500 mb-1">Year</label>
        <select
          value={year ?? new Date().getFullYear()}
          onChange={(e) => setYear(Number(e.target.value))}
          className="block py-2.5 px-0 w-full text-sm border-b-2 border-gray-300 focus:border-blue-600 bg-transparent"
        >
          {[2024, 2025, 2026].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Reset Button */}
      <StyledButton
        to="#"
        label="Reset to Current Month"
        variant="blue"
        rounded
        onClick={onReset}
      />
    </div>
  );
}
