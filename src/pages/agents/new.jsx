import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import Select from "react-select";
import React, { useState } from "react";
import { baseURL } from "../../constants/url";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AgentNav from "../../components/navs/agentnav";

export default function NewAgent() {
  // state
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    phone_number: "",
    role_id: "",
    country: "",
  });

  const [selectedOption, setSelectedOption] = useState(null);
  const [phone, setPhone] = useState("");
  const [disabled, setDisabled] = useState(false);

  const [errors, setErrors] = useState({});

  const options = [
    { value: "0", label: "Super user" },
    { value: "1", label: "Super agent" },
    { value: "2", label: "Agent" },
  ];

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const agentURL = baseUrl + "/api/agents/create.php";

  const navigate = useNavigate();

  // handle change function
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
    // console.log(inputs);
  };

  const phoneChange = (value) => {
    setPhone(value);
    setInputs({
      ...inputs,
      phone_number: value,
    });
    // console.log(value);
  };

  const roleChange = (value) => {
    setSelectedOption(value);
    setInputs({
      ...inputs,
      role_id: value.value,
    });
    // console.log(value);  
  }

  // validation functions
  const validate = (data) => {
    const errors = {};

    // validate first name
    if (!data.name) {
      errors.name = "Name is required";
    }

    // validate email
    if (!data.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Email is invalid";
    }

    // validate role_id
    if (!data.role_id) {
      errors.role_id = "Role is required";
    }

    // validate id number
    if (!data.country) {
      errors.country = "Country is required";
    }

    return errors;
  };

  // submit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);
    const validationErrors = validate(inputs);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      console.log("Form could not be submitted");
      console.log(validationErrors);
      setDisabled(false);
    } else {
      // submit the form
      // const response = axios.post(driverUrl, inputs);
      // redirect if response is "Driver Created"
      // if (response.data.message === "Driver Created") {
      //   const driver_id = response.data.driver_id;
      //   navigate(`/driver/${driver_id}`, {
      //     state: { message: "Driver Created" },
      //   });
      // }
      // console.log(response);
      setDisabled(false);

      console.log(inputs);
      // console.log("Form submitted");
    }
  };

  return (
    <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md mt-2 mx-3">
      <AgentNav />
      <h3 className="xl mt-2">Add Agent</h3>
      <form className="max-w-md mx-auto p-3" onSubmit={handleSubmit}>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="name"
            id="name"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            value={inputs.name}
            onChange={handleChange}
          />
          <label
            for="name"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Name
          </label>
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="country"
            id="country"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            value={inputs.country}
            onChange={handleChange}
          />
          <label
            for="country"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Country
          </label>
          {errors.country && (
            <p className="text-red-500 text-xs mt-1">{errors.country}</p>
          )}
        </div>

        {/* email input  */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="email"
            name="email"
            id="email"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            value={inputs.email}
            onChange={handleChange}
          />
          <label
            for="email"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Email address
          </label>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>
        <div>
        <p className="font-medium">Tel:</p>
        <PhoneInput
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          name="phone_number"
          defaultCountry="KE"
          value={phone}
          onChange={(phone) => phoneChange(phone)}
        />
        </div>

        {/* role select  */}
        <div className="relative z-0 w-full mb-5 mt-5 group">
          <Select
            options={options}
            defaultValue={options[0]}
            value={selectedOption}
            onChange={roleChange}
            placeholder="Select Role"
          />
          {errors.id_type && (
            <p className="text-red-500 text-xs mt-1">{errors.id_type}</p>
          )}
        </div>

        {/* submit button  */}
        <button
          disabled={disabled}
          className="border-2 border-gray-800 text-gray-800 bg-white hover:bg-gray-800 hover:text-white transition duration-200 rounded-full px-4 py-2"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
