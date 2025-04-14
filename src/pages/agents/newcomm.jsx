//THIS FILE WILL DISPLAY A FORM FOR SETTING AGENT COMMISSION WITH SETTING AGENT COMPONENTS
import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

import { motion } from "framer-motion";
import Select from "react-select";

export default function Newcomm({
  agent,
  categoryOptions,
  show,
  onClose,
  onSubmit,
}) {
  // inputs needed agent_id, category_id, commission_amount, commission_type
  const [inputs, setInputs] = useState({
    agent_id: agent?.id,
    category_id: "",
    commission_amount: "",
    commission_type: "",
  });

  // const [categories, setCategories] = useState(categoryOptions);

  const commisionTypes = [
    { value: "percentage", label: "Percentage" },
    { value: "fixed", label: "Fixed" },
  ];

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCommissionType, setSelectedCommissionType] = useState("");

  const categoryChange = (value) => {
    setSelectedCategory(value);
    setInputs({
      ...inputs,
      category_id: value.value,
    });
  };

  const setCommissionType = (value) => {
    setSelectedCommissionType(value);
    setInputs({
      ...inputs,
      commission_type: value.value,
    });
  };

  const handleChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
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
          <h2 className="text-2xl font-bold mb-4">Agent Commission</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-5 group mt-5">
              <Select
                value={selectedCategory}
                onChange={categoryChange}
                options={categoryOptions} 
                displayEmpty
                // inputProps={{ "aria-label": "Without label" }}
                placeholder="Select Category"
                className="w-full"
              />
            </div>
            <div className="mb-5 group mt-5">
              <Select
                value={selectedCommissionType}
                onChange={setCommissionType}
                options={commisionTypes}
                displayEmpty
                // inputProps={{ "aria-label": "Without label" }}
                placeholder="Select Commission Type"
                className="w-full"
              />
            </div>
            <div className="mb-5 group mt-5">
              <input
                type="text"
                name="commission_amount"
                placeholder="Commission Amount"
                value={inputs.commission_amount}
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
