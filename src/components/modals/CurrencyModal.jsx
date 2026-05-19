import React, { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { motion } from "framer-motion";

export default function CurrencyModal({ show, onClose, onApply, days }) {
  const [amount, setAmount] = useState("");
  const [converted, setConverted] = useState("");
  const [direction, setDirection] = useState("USD_TO_KES");
  const [rate, setRate] = useState(null);

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

  // Cache USD→KES rate for 24h
  useEffect(() => {
    const cached = localStorage.getItem("usdKesRate");
    const cachedTime = localStorage.getItem("usdKesRateTime");

    if (cached && cachedTime) {
      const age = Date.now() - parseInt(cachedTime, 10);
      if (age < 24 * 60 * 60 * 1000) {
        setRate(parseFloat(cached));
        return;
      }
    }

    fetch("https://open.er-api.com/v6/latest/USD")
      .then((res) => res.json())
      .then((data) => {
        const newRate = data.rates.KES;
        setRate(newRate);
        localStorage.setItem("usdKesRate", newRate);
        localStorage.setItem("usdKesRateTime", Date.now().toString());
      })
      .catch((err) => console.error("Rate fetch error:", err));
  }, []);

  const convertCurrency = () => {
    if (!rate || !amount) return;
    let result;
    if (direction === "USD_TO_KES") {
      result = (parseFloat(amount) * rate).toFixed(2);
    } else {
      result = (parseFloat(amount) / rate).toFixed(2);
    }
    setConverted(result);
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
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        {/* Close Button */}
        <div className="flex justify-end">
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={onClose}
          >
            <AiOutlineClose size={14} />
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">Currency Converter</h2>

        {/* Direction Toggle */}
        <div className="flex gap-4 mb-4">
          <button
            className={`px-3 py-1 rounded ${
              direction === "USD_TO_KES"
                ? "bg-blue-600 text-white"
                : "border border-gray-400 text-gray-700"
            }`}
            onClick={() => setDirection("USD_TO_KES")}
          >
            USD → KES
          </button>
          <button
            className={`px-3 py-1 rounded ${
              direction === "KES_TO_USD"
                ? "bg-blue-600 text-white"
                : "border border-gray-400 text-gray-700"
            }`}
            onClick={() => setDirection("KES_TO_USD")}
          >
            KES → USD
          </button>
        </div>

        {/* Amount Input */}
        <div className="mb-4">
          <input
            type="number"
            placeholder={`Enter ${direction === "USD_TO_KES" ? "USD" : "KES"} amount`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          onClick={convertCurrency}
          className="mb-4 border-2 border-gray-800 text-gray-800 bg-white hover:bg-gray-800 hover:text-white transition duration-200 rounded-full px-4 py-2"
        >
          Convert
        </button>

        {converted && (
          <p className="mb-4 text-gray-700">
            {amount} {direction === "USD_TO_KES" ? "USD" : "KES"} ≈{" "}
            <strong>
              {converted} {direction === "USD_TO_KES" ? "KES" : "USD"}
            </strong>
          </p>
        )}

        <button
          onClick={() => {
            if (direction === "USD_TO_KES" && days > 0) {
              // derive daily rate from converted KES ÷ days
              const derivedRate = +(parseFloat(converted) / days).toFixed(2);
              onApply(derivedRate);
            }
            onClose();
          }}
          disabled={!converted}
          className="w-full border-2 border-gray-800 text-gray-800 bg-white hover:bg-gray-800 hover:text-white transition duration-200 rounded-full px-4 py-2"
        >
          Apply
        </button>
      </motion.div>
    </motion.div>
  );
}
