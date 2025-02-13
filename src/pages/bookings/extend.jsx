import React, { useState } from "react";

import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

import { motion } from "framer-motion";

export default function Extend({ show, onClose, id, onSubmit }) {
  const [inputs, setInputs] = useState({ id: id, newDate: "" });
  // const [extendDate, setExtendDa]

  const newDateChange = (value) => {
    const day = value.getDate().toString().padStart(2, "0");
    const month = (value.getMonth() + 1).toString().padStart(2, "0");
    const year = value.getFullYear().toString();
    const formattednewDate = `${year}-${month}-${day}`;
    setInputs({
      ...inputs,
      newDate: formattednewDate,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(inputs);
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
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
            <div className="flex justify-end">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={onClose}
              >
                X
              </button>
            </div>
            <h2 className="text-2xl font-bold mb-4">Extend Booking</h2>
            <p className="mb-4">
              New Date
              <form onSubmit={handleSubmit}>
                <DatePicker
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder="Date of Birth"
                  onChange={(newValue) => newDateChange(newValue)}
                  // value={birthDate}
                />
                <button className="mt-2 border-2 border-gray-800 text-gray-800 bg-white hover:bg-gray-800 hover:text-white transition duration-200 rounded-full px-4 py-2">
                  Submit
                </button>
              </form>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </LocalizationProvider>
  );
}
