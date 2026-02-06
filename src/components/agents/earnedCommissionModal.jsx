import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { useNavigate } from "react-router-dom";

export function EarnedCommissionsModal({ show, onClose, agentId }) {
  const navigate = useNavigate();
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Generate Commission</h2>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">From</label>
            <DatePicker
              value={fromDate}
              onChange={(newValue) => setFromDate(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: "standard",
                  className:
                    "block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer",
                },
              }}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-semibold">To</label>
            <DatePicker
              value={toDate}
              onChange={(newValue) => setToDate(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: "standard",
                  className:
                    "block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer",
                },
              }}
            />
          </div>
        </LocalizationProvider>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => {
              const from = fromDate
                ? fromDate.toISOString().split("T")[0]
                : null;
              const to = toDate ? toDate.toISOString().split("T")[0] : null;
              navigate("/agent/commissions", {
                state: { agentId, from, to },
              });

              onClose();
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
