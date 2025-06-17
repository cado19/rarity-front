import axios from "axios";
import React, { useState } from "react";
import Swal from "sweetalert2";

export default function DailyRateForm({ vehicle_id, onSubmit, errors, disabled }) {
  const [rate, setRate] = useState("");

  // const [disabled, setDisabled] = useState(false);
  // const [errors, setErrors] = useState({});

  const [inputs, setInputs] = useState({
    vehicle_id: vehicle_id,
    rate: ""
  })

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const rateUrl = baseUrl + "/api/FLEET/update_rate.php";

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Submitting form with inputs:", inputs);
    onSubmit(inputs);
    // setDisabled(true);
    // const validationErrors = validate(rate);
    // if (Object.keys(validationErrors).length > 0) {
    //   console.log("Form could not be submitted");
    //   console.log(validationErrors);
    //   setDisabled(false);
    // } else {
    //   const response = await axios.post(rateUrl, {
    //     vehicle_id: vehicle_id,
    //     rate: rate,
    //   });
    //   Swal.fire({
    //     title: response.data.status ,
    //     text: response.data.message,
    //     icon: response.data.status === "Success" ? "success" : "error",
    //     confirmButtonText: "OK",
    //   });
    //   setDisabled(false);
    // }

  };



  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="vehicle_id" value={vehicle_id} />
        <div className="flex items-center border-b border-teal-500 py-2">
          <input
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            // placeholder="8000"
            aria-label="Full name"
            value={inputs.rate}
            onChange={(e) => setInputs({
              ...inputs,
              rate: e.target.value
            })}
          />
          <p className="text-red-500">{errors.rate}</p>
          <button
            className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
            disabled={disabled}
          >
            Update
          </button>
        </div>
        <label></label>
      </form>
    </div>
  );
}
