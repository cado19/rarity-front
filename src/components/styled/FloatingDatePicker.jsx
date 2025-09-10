// this is a styled component for a datepicker input. It includes a floating label
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

export default function FloatingDatePicker({
  label,
  value,
  onChange,
  name,
  id,
  error,
}) {
  const inputId = id || name || label.toLowerCase().replace(/\s+/g, "_");

  return (
    <div className="relative z-0 w-full mb-5 group mt-5">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          value={value}
          onChange={onChange}
          renderInput={({ inputRef, inputProps }) => (
            <>
              <input
                ref={inputRef}
                {...inputProps}
                id={inputId}
                name={name}
                placeholder=" "
                className="peer block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 dark:text-white dark:border-gray-600 dark:focus:border-blue-500"
              />
              <label
                htmlFor={inputId}
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
              >
                {label}
              </label>
            </>
          )}
        />
      </LocalizationProvider>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}