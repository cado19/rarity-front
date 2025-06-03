import React, { useState } from "react";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

import { motion } from "framer-motion";

export default function Fuel({ show, onClose, id, onSubmit }) {
  const [inputs, setInputs] = useState({ id: id, fuel: "" });
  const [errors, setErrors] = useState({});
  // const [extendDate, setExtendDa]

  const handleChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputs.fuel) {
      setErrors({ fuel: "Fuel amount is required" });
      return;
    }
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
          <h2 className="text-2xl font-bold mb-4">Fuel</h2>
          {/* <p className="mb-4"> */}
            <form onSubmit={handleSubmit}>
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="fuel"
                  id="fuel"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=""
                  required
                  value={inputs.fuel}
                  onChange={handleChange}
                />
                <label
                  for="first_name"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Fuel Amount
                </label>
                {errors.fuel && (
                  <p className="text-red-500 text-xs mt-1">{errors.fuel}</p>
                )}
              </div>

              <button className="mt-2 border-2 border-gray-800 text-gray-800 bg-white hover:bg-gray-800 hover:text-white transition duration-200 rounded-full px-4 py-2">
                Submit
              </button>
            </form>
          {/* </p> */}
        </motion.div>
      </motion.div>
    </div>
  );
}
