import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import Select from "react-select";
import React, { useEffect, useState } from "react";
import { baseURL } from "../../constants/url";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AgentNav from "../../components/navs/agentnav";
import Swal from "sweetalert2";
import { fetchAccountRoles } from "../../api/fetch";
import Loading from "../../components/PageContent/Loading";
import { createAgent } from "../../api/post";

export default function NewAgent() {
  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData.id;

  // state
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    phone_number: "",
    role_id: "",
    country: "",
    role_ids: [],
  });

  const [roles, setRoles] = useState([]); // fetched from backend
  const [selectedOption, setSelectedOption] = useState(null);
  const [phone, setPhone] = useState("");
  const [disabled, setDisabled] = useState(false);

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const options = [
    { value: "0", label: "Super user" },
    { value: "1", label: "Super agent" },
    { value: "2", label: "Agent" },
  ];

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const agentURL = baseUrl + "/api/agents/create.php";

  const navigate = useNavigate();

  // get the roles
  const fetchRoles = async () => {
    try {
      const res = await fetchAccountRoles();
      if (res.status === "Success") {
        setRoles(res.roles);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Could not fetch roles from the server.",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Unable to reach the backend. Please try again later.",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

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
  };

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
    if (!data.role_ids || data.role_ids.length === 0) {
      errors.role_ids = "At least one role is required";
    }

    // validate id number
    if (!data.country) {
      errors.country = "Country is required";
    }
    setErrors(errors);
    return errors;
  };

  // submit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);
    const validationErrors = validate(inputs);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // console.log("Form could not be submitted");
      // console.log(validationErrors);
      setDisabled(false);
    } else {
      // submit the form
      try {
        const response = await createAgent(inputs);
        console.log("Response: ", response);
        if (response.status === "Success") {
          const agent_id = response.account_id;
          navigate(`/agent/${agent_id}`, {
            state: { message: "Agent Created" },
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: response.message,
          });
        }
      } catch (err) {
        Swal.fire({ icon: "error", title: "Network Error", text: err.message });
      } finally {
        setDisabled(false);
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md mt-2 mx-3">
      {/* Nav  */}
      <AgentNav />

      {/* Title / Header  */}
      <h1 className="text-3xl font-bold text-end text-yellow-600 tracking-wide mb-4 mt-2">
        Add Agent
      </h1>

      {/* Form  */}
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

        {/* phone input  */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telephone
          </label>
          <PhoneInput
            name="phone_number"
            defaultCountry="KE"
            value={phone}
            onChange={phoneChange}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 
               focus:border-blue-500 focus:ring-blue-500 focus:outline-none shadow-sm"
            inputClass="w-full border-none focus:ring-0 focus:outline-none"
          />
          {errors.phone_number && (
            <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>
          )}
        </div>

        {/* Roles checkboxes */}
        <div className="mb-5">
          <p className="font-medium mb-2">Assign Roles:</p>
          <div className="grid grid-cols-3 gap-4">
            {roles.map((role) => (
              <label
                key={role.id}
                className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600"
                  checked={inputs.role_ids.includes(role.id)}
                  onChange={() => {
                    setInputs((prev) => {
                      const alreadySelected = prev.role_ids.includes(role.id);
                      return {
                        ...prev,
                        role_ids: alreadySelected
                          ? prev.role_ids.filter((id) => id !== role.id)
                          : [...prev.role_ids, role.id],
                      };
                    });
                  }}
                />
                <span className="text-gray-700">{role.name}</span>
              </label>
            ))}
          </div>
          {errors.role_ids && (
            <p className="text-red-500 text-xs mt-1">{errors.role_ids}</p>
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
