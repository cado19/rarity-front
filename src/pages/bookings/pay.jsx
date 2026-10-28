import React, { useState } from "react";
import { motion } from "framer-motion";

export default function PaymentModal({ show, onClose, bookingId, onSubmit }) {
  const [inputs, setInputs] = useState({ booking_id: bookingId, amount: "", ref: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let errs = {};
    if (!inputs.amount) errs.amount = "Amount is required";
    if (!inputs.ref) errs.ref = "Reference is required";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    onSubmit(inputs); // calls API
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

  if (!show) return null;

  return (
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
        <h2 className="text-2xl font-bold mb-4">Record Payment</h2>
        <form onSubmit={handleSubmit}>
          {/* Amount */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="number"
              name="amount"
              id="amount"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=""
              required
              value={inputs.amount}
              onChange={handleChange}
            />
            <label
              htmlFor="amount"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Payment Amount
            </label>
            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
          </div>

          {/* Reference */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="ref"
              id="ref"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=""
              required
              value={inputs.ref}
              onChange={handleChange}
            />
            <label
              htmlFor="ref"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Reference (e.g. MPESA code)
            </label>
            {errors.ref && <p className="text-red-500 text-xs mt-1">{errors.ref}</p>}
          </div>

          <button className="mt-2 border-2 border-gray-800 text-gray-800 bg-white hover:bg-gray-800 hover:text-white transition duration-200 rounded-full px-4 py-2">
            Submit
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
