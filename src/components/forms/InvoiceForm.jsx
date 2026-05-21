import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { motion } from "framer-motion";
import { save_invoice } from "../../api/post";

export default function InvoiceForm({ bookingId, show, onClose, onCreated }) {
  const [inputs, setInputs] = useState({
    booking_id: bookingId,
    subject: "",
    due_date: "",
    terms: "",
    billed_to: "",
  });
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState(null);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Invoice inputs: ", inputs);
    setLoading(true);
    try {
      const res = await save_invoice({
        booking_id: bookingId,
        subject: inputs.subject,
        due_date: inputs.due_date,
        terms: inputs.terms,
        billed_to: inputs.billed_to,
      });
      setInvoice(res.data.invoice);
      if (onCreated) onCreated(res.data.invoice);
    } catch (err) {
      console.error("Error creating invoice:", err);
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

        <h2 className="text-2xl font-bold mb-4">Create Invoice</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block font-semibold">Subject</label>
            <input
              type="text"
              name="subject"
              value={inputs.subject}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-semibold">Due Date</label>
            <input
              type="date"
              name="due_date"
              value={inputs.due_date}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-semibold">Terms</label>
            <input
              type="text"
              name="terms"
              value={inputs.terms}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
              placeholder="e.g. Due on receipt"
            />
          </div>
          <div>
            <label className="block font-semibold">Billed To</label>
            <input
              type="text"
              name="billed_to"
              value={inputs.billed_to}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
              placeholder="Organisation or client name"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            {loading ? "Creating..." : "Generate Invoice"}
          </button>
        </form>

        {invoice && (
          <div className="mt-6 p-4 border rounded bg-gray-50">
            <h3 className="font-bold text-lg mb-2">Invoice Created</h3>
            <p><b>Invoice No:</b> {invoice.invoice_number}</p>
            <p><b>Status:</b> {invoice.status}</p>
            <p><b>Subject:</b> {invoice.subject}</p>
            <p><b>Due Date:</b> {invoice.due_date}</p>
            <p><b>Terms:</b> {invoice.terms}</p>
            <p><b>Billed To:</b> {invoice.billed_to}</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
