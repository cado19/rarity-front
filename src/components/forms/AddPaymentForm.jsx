import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { motion } from "framer-motion";
import { add_payment } from "../../api/post";

export default function AddPaymentForm({ invoiceId, show, onClose, onRecorded }) {
  const [inputs, setInputs] = useState({
    amount: "",
    payment_mode: "mpesa",
    payment_code: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await add_payment({
        invoice_id: invoiceId,
        amount: inputs.amount,
        payment_mode: inputs.payment_mode,
        payment_code: inputs.payment_code,
        notes: inputs.notes,
      });
      if (onRecorded) onRecorded(res.data.invoice); // pass updated invoice back
      onClose(); // close modal after save
    } catch (err) {
      console.error("Error recording payment:", err);
    } finally {
      setLoading(false);
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    transition: { duration: 0.2 },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: "-100vh" },
    visible: { opacity: 1, y: "0" },
    transition: { duration: 0.2 },
  };

  if (!show) return null;

  return (
    <motion.div
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        {/* Close button */}
        <div className="flex justify-end">
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={onClose}
          >
            <AiOutlineClose size={14} />
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-4">Record Payment</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block font-semibold">Amount</label>
            <input
              type="number"
              name="amount"
              value={inputs.amount}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-semibold">Payment Mode</label>
            <select
              name="payment_mode"
              value={inputs.payment_mode}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            >
              <option value="mpesa">Mpesa</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="cheque">Cheque</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold">Payment Code</label>
            <input
              type="text"
              name="payment_code"
              value={inputs.payment_code}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
              placeholder="Transaction reference"
            />
          </div>
          <div>
            <label className="block font-semibold">Notes</label>
            <input
              type="text"
              name="notes"
              value={inputs.notes}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
              placeholder="Optional remarks"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {loading ? "Saving..." : "Add Payment"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
