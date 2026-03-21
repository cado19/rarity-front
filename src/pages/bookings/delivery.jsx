// src/pages/bookings/delivery.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchBookingDrivers } from "../../api/fetch";
import DriverSelect from "../../components/styled/DriverSelect";

export default function Delivery({ show, onClose, id, onSubmit }) {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadDrivers = async () => {
      try {
        const res = await fetchBookingDrivers();
        setDrivers(
          res.drivers.map((d) => ({
            value: d.id,
            label: `${d.first_name} ${d.last_name}`,
          })),
        );
      } catch (err) {
        console.error("Error fetching drivers:", err);
      }
    };
    if (show) loadDrivers();
  }, [show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDriver) {
      setErrors({ driver: "Driver selection is required" });
      return;
    }
    onSubmit({ booking_id: id, driver_id: selectedDriver });
  };

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <motion.div
        initial={{ y: "-100vh", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "-100vh", opacity: 0 }}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <div className="flex justify-end">
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={onClose}
          >
            X
          </button>
        </div>
        <h2 className="text-2xl font-bold mb-4">Assign Driver</h2>

        <form onSubmit={handleSubmit}>
          <DriverSelect
            drivers={drivers}
            value={selectedDriver}
            onChange={setSelectedDriver}
            error={errors.driver}
          />

          <button className="mt-2 border-2 border-gray-800 text-gray-800 bg-white hover:bg-gray-800 hover:text-white transition duration-200 rounded-full px-4 py-2">
            Submit
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
