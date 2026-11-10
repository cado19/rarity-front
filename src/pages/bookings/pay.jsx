import React, { useState } from "react";
import { motion } from "framer-motion";
import PaymentForm from "../../components/forms/BookingPaymentForm";

export default function PaymentModal({ show, onClose, initialValues, bookingId, onSubmit, title, submitLabel }) {
  // const [inputs, setInputs] = useState({ booking_id: bookingId, amount: "", ref: "" });
  const [errors, setErrors] = useState({});

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
        <PaymentForm 
          initialValues={initialValues}
          errors={errors}
          setErrors={setErrors}
          onSubmit={onSubmit}
          submitLabel={submitLabel}
        />
      </motion.div>
    </motion.div>
  );
}
