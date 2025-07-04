import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

import { motion } from "framer-motion";
import Select from "react-select";

export default function NewRate({
  show,
  onClose,
  onSubmit,
  driverId,
  locationOptions,
}) {
  const [inputs, setInputs] = useState({
    driver_id: driverId,
    location: "",
    rate_amount: "",
  });

  const [selectedLocation, setSelectedLocation] = useState("");

  const locationChange = (value) => {
    setSelectedLocation(value);
    setInputs({
      ...inputs,
      location: value.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(inputs);
  };

  const handleChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    transition: { duration: 0.2, delay: 0.3 },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: "-100vh" },
    visible: { opacity: 1, y: "0" },
    transition: { duration: 0.2, delay: 0.3 },
  };

  if (!show) {
    return null;
  }
  return (
    <div>
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
        >
          {/* Modal Close Button  */}
          <div className="flex justify-end">
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={onClose}
            >
              <AiOutlineClose size={10} />
            </button>
          </div>
          <h2 className="text-2xl font-bold mb-4">Driver Rate</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-5 group mt-5">
              <Select
                value={selectedLocation}
                onChange={locationChange}
                options={locationOptions}
                displayEmpty
                // inputProps={{ "aria-label": "Without label" }}
                placeholder="Select Location"
                className="w-full"
              />
            </div>
            <div className="mb-5 group mt-5">
              <input
                type="text"
                name="rate_amount"
                placeholder="Rate Amount"
                value={inputs.rate_amount}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <button className="mt-2 border-2 border-gray-800 text-gray-800 bg-white hover:bg-gray-800 hover:text-white transition duration-200 rounded-full px-4 py-2">Save</button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
