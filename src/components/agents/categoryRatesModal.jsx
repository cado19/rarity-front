// View Category Rates of an Agent

import React from "react";
import { AiOutlineClose } from "react-icons/ai";

import { motion } from "framer-motion";

export default function CategoryRatesModal({ show, onClose, rates }) {
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
          <h2 className="text-2xl font-bold mb-4">Agent Category Rates</h2>

          <table className="w-full">
            <thead>
              <tr>
                <th>Category</th>
                <th>Min. Rate</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {rates.map((rate) => (
                <tr key={rate.id}>
                  <td>{rate.category}</td>
                  <td>{Number(rate.rate).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </motion.div>
    </div>
  );
}
