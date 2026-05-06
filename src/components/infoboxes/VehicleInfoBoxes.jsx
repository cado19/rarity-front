import React from "react";
import { FaCar, FaIdCard, FaTag, FaTachometerAlt, FaCalendarCheck, FaCircle } from "react-icons/fa";

const VehicleInfoBoxes = ({ make, model, number_plate, category, mileage, bookingsCount, status }) => {
  return (
    <div className="flex flex-col gap-6 mt-4">
      {/* Identity row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BoxWrapper
          icon={<FaCar className="text-blue-500 text-2xl" />}
          label="Name"
          value={`${make} ${model}`}
        />
        <BoxWrapper
          icon={<FaIdCard className="text-green-500 text-2xl" />}
          label="Registration"
          value={number_plate}
        />
        <BoxWrapper
          icon={<FaTag className="text-amber-500 text-2xl" />}
          label="Category"
          value={category}
        />
      </div>

      {/* Operational row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BoxWrapper
          icon={<FaTachometerAlt className="text-purple-500 text-2xl" />}
          label="Mileage"
          value={mileage ? `${mileage} km` : "N/A"}
        />
        <BoxWrapper
          icon={<FaCalendarCheck className="text-indigo-500 text-2xl" />}
          label="Bookings"
          value={bookingsCount ?? 0}
        />
        <BoxWrapper
          icon={<FaCircle className={
            status === "available"
              ? "text-green-500 text-2xl"
              : status === "booked"
              ? "text-red-500 text-2xl"
              : "text-yellow-500 text-2xl"
          } />}
          label="Status"
          value={status ?? "Unknown"}
        />
      </div>
    </div>
  );
};

export default VehicleInfoBoxes;

function BoxWrapper({ icon, label, value }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-start border border-gray-200 hover:shadow-lg transition">
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <span className="text-sm text-gray-500 font-medium">{label}</span>
      </div>
      <strong className="text-xl text-gray-800 font-semibold">{value}</strong>
    </div>
  );
}
