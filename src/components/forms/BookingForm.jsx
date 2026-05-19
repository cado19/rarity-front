import React, { useEffect, useState } from "react";
import Select from "react-select";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { AiFillCaretRight, AiFillCaretDown } from "react-icons/ai";
import CurrencyModal from "../modals/CurrencyModal";

export default function BookingForm({
  title, // NEW: passed from parent
  inputs,
  setInputs,
  clients,
  drivers,
  vehicles,
  selectedClient,
  setSelectedClient,
  selectedDriver,
  setSelectedDriver,
  selectedVehicle,
  setSelectedVehicle,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  errors,
  disabled,
  onSubmit,
  oneday,
  setOneDay,
  show,
  setShow,
  customerName,
}) {
  const [days, setDays] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [vatAmount, setVatAmount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false); // currency modal display

  //pre populate time
  useEffect(() => {
    if (!inputs.start_time) {
      const now = new Date();
      setInputs((prev) => ({
        ...prev,
        start_time: now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));
      setStartTime(now);
    }
    if (!inputs.end_time) {
      const now = new Date();
      setInputs((prev) => ({
        ...prev,
        end_time: now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));
      setEndTime(now);
    }
  }, []);

  // Totals preview calculation
  useEffect(() => {
    if (!selectedVehicle) {
      setDays(0);
      setSubtotal(0);
      setVatAmount(0);
      setGrandTotal(0);
      return;
    }

    const startDateStr = inputs.start_date || null;
    const endDateStr = inputs.end_date || null;
    const startTimeStr = inputs.start_time || "00:00:00";
    const endTimeStr = inputs.end_time || "00:00:00";

    if (!startDateStr || !endDateStr) {
      setDays(0);
      setSubtotal(0);
      setVatAmount(0);
      setGrandTotal(0);
      return;
    }

    const start = new Date(`${startDateStr} ${startTimeStr}`);
    const end = new Date(`${endDateStr} ${endTimeStr}`);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setDays(0);
      setSubtotal(0);
      setVatAmount(0);
      setGrandTotal(0);
      return;
    }

    // Calculate difference in hours
    const hoursDiff = (end - start) / (1000 * 60 * 60);
    const wholeDays = Math.floor(hoursDiff / 24);
    const leftoverHours = Math.round(hoursDiff % 24);

    let calcDays = Math.max(1, wholeDays);

    if (!inputs.override) {
      if (leftoverHours > 2) {
        calcDays += 1;
      }
    }

    // 🔄 Reverse calculation logic
    let effectiveRate;
    if (inputs.budgetMode && inputs.custom_total) {
      const customTotal = parseFloat(inputs.custom_total);
      if (!isNaN(customTotal) && calcDays > 0) {
        effectiveRate = +(customTotal / calcDays).toFixed(2);
        // ✅ populate custom_rate so backend gets it
        setInputs((prev) => ({ ...prev, custom_rate: effectiveRate }));
      } else {
        effectiveRate =
          inputs.custom_rate && parseFloat(inputs.custom_rate) > 0
            ? parseFloat(inputs.custom_rate)
            : selectedVehicle?.daily_rate || 0;
      }
    } else {
      effectiveRate =
        inputs.custom_rate && parseFloat(inputs.custom_rate) > 0
          ? parseFloat(inputs.custom_rate)
          : selectedVehicle?.daily_rate || 0;
    }

    const baseSubtotal = effectiveRate * calcDays;
    const vatCalc = inputs.vat ? +(baseSubtotal * 0.16).toFixed(2) : 0;
    const totalCalc = baseSubtotal + vatCalc;

    setDays(calcDays);
    setSubtotal(baseSubtotal);
    setVatAmount(vatCalc);
    setGrandTotal(totalCalc);
  }, [
    inputs.custom_rate,
    inputs.custom_total,
    inputs.budgetMode,
    inputs.vat,
    inputs.start_date,
    inputs.end_date,
    inputs.start_time,
    inputs.end_time,
    inputs.override,
    selectedVehicle,
  ]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <CurrencyModal
        show={showCurrencyModal}
        onClose={() => setShowCurrencyModal(false)}
        onApply={(kesValue) => {
          // feed into reverse calculation
          setInputs((prev) => ({ ...prev, custom_total: kesValue }));
        }}
      />

      <div className="bg-white px-4 pb-4 pt-4 rounded border-gray-200 flex-1 shadow-md mt-2 mx-3">
        <h1 className="text-3xl font-bold text-end text-yellow-600 tracking-wide mb-4 mt-2">
          {title}
        </h1>

        <div className="w-4/5 mx-auto">
          <button
            type="button"
            onClick={() => setShowCurrencyModal(true)}
            className="border-2  bg-white hover:bg-blue-600 hover:text-white transition duration-200 rounded-full px-4 py-2"
          >
            Convert Currency
          </button>
        </div>

        <form onSubmit={onSubmit} className="w-4/5 mx-auto">
          {/* One Day Booking toggle */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={inputs.oneday}
              onChange={() => {
                setOneDay(!oneday);
                setInputs((prev) => ({ ...prev, oneday: !prev.oneday }));
              }}
              className="form-checkbox h-5 w-5 text-blue-600 m-3"
            />
            <span className="text-gray-500 dark:text-gray-400">
              {oneday
                ? "One Day Booking Turned On"
                : "One Day Booking Turned Off"}
            </span>
          </label>

          {/* Customer select */}
          <div className="mb-5 group">
            {customerName ? (
              <input
                type="text"
                value={customerName}
                disabled
                className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-700"
              />
            ) : (
              <Select
                options={clients}
                value={selectedClient}
                onChange={(option) => {
                  setSelectedClient(option);
                  setInputs((prev) => ({ ...prev, customer_id: option.value }));
                }}
                placeholder="Select Client"
                isSearchable
              />
            )}
            {errors.customer_id && (
              <p className="text-red-500 text-xs mt-1">{errors.customer_id}</p>
            )}
          </div>

          {/* Vehicle select */}
          <div className="mb-5 group">
            <Select
              options={vehicles}
              value={selectedVehicle}
              onChange={(option) => {
                setSelectedVehicle(option);
                setInputs((prev) => ({ ...prev, vehicle_id: option.value }));
              }}
              placeholder="Select Vehicle"
              isSearchable
            />
            {errors.vehicle_id && (
              <p className="text-red-500 text-xs mt-1">{errors.vehicle_id}</p>
            )}
          </div>

          {/* Driver select */}
          <div className="mb-5 group">
            <Select
              options={drivers}
              value={selectedDriver}
              onChange={(option) => {
                setSelectedDriver(option);
                setInputs((prev) => ({ ...prev, driver_id: option.value }));
              }}
              placeholder="Select Driver"
              isSearchable
            />
            {errors.driver_id && (
              <p className="text-red-500 text-xs mt-1">{errors.driver_id}</p>
            )}
          </div>

          {/* Dates */}
          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="mb-5">
              <label>Start Date</label>
              <DatePicker
                className="block py-2.5 px-0 w-full text-sm text-gray-900
              bg-transparent border-0 border-b-2 border-gray-300 appearance-none
              dark:text-white dark:border-gray-600 dark:focus:border-blue-500
              focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                value={startDate}
                onChange={(val) => {
                  setStartDate(val);
                  setInputs((prev) => ({
                    ...prev,
                    start_date: val.toISOString().split("T")[0],
                  }));
                }}
              />
            </div>
            {!oneday && (
              <div className="mb-5">
                <label>End Date</label>
                <DatePicker
                  className="block py-2.5 px-0 w-full text-sm text-gray-900
              bg-transparent border-0 border-b-2 border-gray-300 appearance-none
              dark:text-white dark:border-gray-600 dark:focus:border-blue-500
              focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  value={endDate}
                  onChange={(val) => {
                    setEndDate(val);
                    setInputs((prev) => ({
                      ...prev,
                      end_date: val.toISOString().split("T")[0],
                    }));
                  }}
                />
              </div>
            )}
          </div>

          {/* Times */}
          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="mb-5">
              <label>Start Time</label>
              <TimePicker
                className="block py-2.5 px-0 w-full text-sm text-gray-900
              bg-transparent border-0 border-b-2 border-gray-300 appearance-none
              dark:text-white dark:border-gray-600 dark:focus:border-blue-500
              focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                value={startTime}
                onChange={(val) => {
                  setStartTime(val);
                  setInputs((prev) => ({
                    ...prev,
                    start_time: val.toLocaleTimeString(),
                  }));
                }}
              />
            </div>
            <div className="mb-5">
              <label>End Time</label>
              <TimePicker
                className="block py-2.5 px-0 w-full text-sm text-gray-900
              bg-transparent border-0 border-b-2 border-gray-300 appearance-none
              dark:text-white dark:border-gray-600 dark:focus:border-blue-500
              focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                value={endTime}
                onChange={(val) => {
                  setEndTime(val);
                  setInputs((prev) => ({
                    ...prev,
                    end_time: val.toLocaleTimeString(),
                  }));
                }}
              />

              {/* Override extra day */}
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="override"
                  checked={inputs.override}
                  onChange={() =>
                    setInputs((prev) => ({ ...prev, override: !prev.override }))
                  }
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <label htmlFor="override" className="text-sm text-gray-700">
                  Override extra day
                </label>
              </div>
            </div>
          </div>

          {/* Custom Rate */}
          <label className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              checked={inputs.budgetMode || false}
              onChange={() =>
                setInputs((prev) => ({ ...prev, budgetMode: !prev.budgetMode }))
              }
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="text-gray-500">
              {inputs.budgetMode
                ? "Budget Mode (enter total)"
                : "Rate Mode (enter daily rate)"}
            </span>
          </label>

          {inputs.budgetMode ? (
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="text"
                name="custom_total"
                id="custom_total"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                value={inputs.custom_total || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setInputs((prev) => ({ ...prev, custom_total: val }));
                  // 🔄 derive rate immediately if days known
                  if (days > 0 && val) {
                    const derivedRate = +(parseFloat(val) / days).toFixed(2);
                    setInputs((prev) => ({
                      ...prev,
                      custom_rate: derivedRate,
                    }));
                  }
                }}
              />
              <label
                htmlFor="custom_total"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0]"
              >
                Budget Total
              </label>
              {inputs.custom_rate && (
                <p className="text-xs text-gray-600 mt-1">
                  Derived Rate: {inputs.custom_rate} per day
                </p>
              )}
            </div>
          ) : (
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="text"
                name="custom_rate"
                id="custom_rate"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                value={inputs.custom_rate || ""}
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    custom_rate: e.target.value,
                  }))
                }
              />
              <label
                htmlFor="custom_rate"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0]"
              >
                Custom Rate
              </label>
            </div>
          )}

          {/* VAT toggle */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={inputs.vat}
              onChange={() =>
                setInputs((prev) => ({ ...prev, vat: !prev.vat }))
              }
              className="form-checkbox h-5 w-5 text-blue-600 m-3"
            />
            <span className="text-gray-500">
              {inputs.vat ? "VAT Applied (16%)" : "No VAT"}
            </span>
          </label>

          {/* Totals Preview */}
          <div className="mt-4 p-3 border rounded bg-gray-50">
            <p>Days: {days.toLocaleString() || 0}</p>
            <p>Subtotal: {subtotal.toLocaleString() || 0} /-</p>
            <p>VAT: {vatAmount.toLocaleString() || 0} /-</p>
            <p className="font-semibold">
              Grand Total: {grandTotal.toLocaleString() || 0} /-
            </p>
          </div>

          {/* Submit */}
          <button
            disabled={disabled}
            className="w-full border-2 border-gray-800 text-gray-800 bg-white hover:bg-gray-800 hover:text-white transition duration-200 rounded-full px-4 py-2 mt-4"
          >
            Save
          </button>
        </form>
      </div>
    </LocalizationProvider>
  );
}
