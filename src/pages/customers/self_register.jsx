// THIS FORM WILL BE FOR CLIENT SELF REGISTRATION
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
import Logo from "../../assets/rarity_logo.png";
import Swal from "sweetalert2";

export default function SelfRegister() {
  // state
  const [inputs, setInputs] = useState({
    f_name: "",
    l_name: "",
    email: "",
    phone_number: "",
    date_of_birth: "",
    id_type: "",
    id_number: "",
    dl_number: "",
    dl_expiry: "",
    residential_address: "",
    work_address: "",
  });
  const [birthDate, setBirthDate] = useState(new Date());
  const [dlExpiry, setDlExpiry] = useState(new Date());
  const [selectedOption, setSelectedOption] = useState(null);
  const [phone, setPhone] = useState("");
  const [disabled, setDisabled] = useState(false);

  const [errors, setErrors] = useState({});

  const options = [
    { value: "National ID", label: "National ID" },
    { value: "Passport", label: "Passport" },
    { value: "Military ID", label: "Military ID" },
  ];

  const navigate = useNavigate();
  const customerUrl = baseURL + "/api/customers/create.php";

  // handle change function
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
    // console.log(inputs);
  };

  const birthDateChange = (value) => {
    setBirthDate(value);
    const day = value.getDate().toString().padStart(2, "0");
    const month = (value.getMonth() + 1).toString().padStart(2, "0");
    const year = value.getFullYear().toString();
    const formattedBirthDate = `${year}-${month}-${day}`;
    setInputs({
      ...inputs,
      date_of_birth: formattedBirthDate,
    });

    // console.log(inputs);
  };

  const dlDateChange = (value) => {
    setDlExpiry(value);
    const day = value.getDate().toString().padStart(2, "0");
    const month = (value.getMonth() + 1).toString().padStart(2, "0");
    const year = value.getFullYear().toString();
    const formattedDlExpiry = `${year}-${month}-${day}`;
    setInputs({
      ...inputs,
      dl_expiry: formattedDlExpiry,
    });

    // console.log(inputs);
  };

  const idTypeChange = (value) => {
    setSelectedOption(value);
    // const idTypeValue = selectedOption.value;
    setInputs({
      ...inputs,
      id_type: value.value,
    });
    // console.log(value.value);
  };

  const phoneChange = (value) => {
    setPhone(value);
    setInputs({
      ...inputs,
      phone_number: value,
    });
    // console.log(value);
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
      axios.post(customerUrl, inputs).then((response) => {
          // redirect if response is "Customer Created"
          setDisabled(false);
          console.log(response);
          if (response.data.message === "Customer Created") {
            navigate("/success", { state: { message: "Customer Created" } });
          } else {
            Swal.fire({
                icon: "error",
                title: response.data.message,
                showConfirmButton: true,
                showClass: {
                    popup: `
                      animate__animated
                      animate__fadeInUp
                      animate__faster
                    `
                  },
                  hideClass: {
                    popup: `
                      animate__animated
                      animate__fadeOutDown
                      animate__faster
                    `
                  }
            });
          }
    
          console.log(inputs);
          // console.log("Form submitted");
      });
    }
  };

  // validation functions
  const validate = (data) => {
    const errors = {};

    // validate first name
    if (!data.f_name) {
      errors.first_name = "First name is required";
    }

    // validate last name
    if (!data.l_name) {
      errors.last_name = "Last name is required";
    }

    // validate email
    if (!data.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Email is invalid";
    }

    // validate date of birth
    if (!data.date_of_birth) {
      errors.date_of_birth = "Date of birth is required";
    }

    // validate id type
    if (!data.id_type) {
      errors.id_type = "Id type is required";
    }

    // validate id type
    if (!data.phone_number) {
      errors.phone_number = "Tel is required";
    }

    // validate id number
    if (!data.id_number) {
      errors.id_number = "Id number is required";
    }

    // validate dl number
    if (!data.dl_number) {
      errors.dl_number = "DL number is required";
    }

    // validate dl expiry
    if (!data.dl_expiry) {
      errors.dl_expiry = "DL expiry is required";
    }

    // validate residential address
    if (!data.residential_address) {
      errors.residential_address = "Residential address is required";
    }

    // validate work address
    if (!data.work_address) {
      errors.work_address = "Work address is required";
    }

    return errors;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md mt-2 mx-3">
        <div>
          <img src={Logo} alt="Rarity Logo" className="mx-auto" />
        </div>
        <form className="max-w-md mx-auto p-3" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="text"
                name="f_name"
                id="first_name"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                value={inputs.f_name}
                onChange={handleChange}
              />
              <label
                for="first_name"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                First name
              </label>
              {errors.first_name && (
                <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>
              )}
            </div>

            <div className="relative z-0 w-full mb-5 group">
              <input
                type="text"
                name="l_name"
                id="last_name"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                value={inputs.l_name}
                onChange={handleChange}
              />
              <label
                for="last_name"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Last name
              </label>
              {errors.last_name && (
                <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>
              )}
            </div>
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

          <PhoneInput
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            name="phone_number"
            defaultCountry="KE"
            value={phone}
            onChange={(phone) => phoneChange(phone)}
          />
          {errors.phone_number && (
            <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>
          )}

          {/* date of birth  */}
          <div className="relative z-0 w-full mb-5 group mt-5">
            <label className="font-md text-gray-500 text-sm peer-focus:font-sm">
              Date of Birth
            </label>
            <DatePicker
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder="Date of Birth"
              onChange={(newValue) => birthDateChange(newValue)}
              value={birthDate}
            />
            {errors.date_of_birth && (
              <p className="text-red-500 text-xs mt-1">
                {errors.date_of_birth}
              </p>
            )}
          </div>

          <div>
            <Select
              options={options}
              defaultValue={options[0]}
              value={selectedOption}
              onChange={idTypeChange}
              placeholder="Select ID Document Type"
            />
            {errors.id_type && (
              <p className="text-red-500 text-xs mt-1">{errors.id_type}</p>
            )}
          </div>

          {/* id number  */}
          <div className="relative z-0 w-full mb-5 group mt-5">
            <input
              type="text"
              name="id_number"
              id="id_number"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              value={inputs.id_number}
              onChange={handleChange}
            />
            <label
              for="id_number"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              ID Number
            </label>
            {errors.id_number && (
              <p className="text-red-500 text-xs mt-1">{errors.id_number}</p>
            )}
          </div>

          {/* dl number  */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="dl_number"
              id="dl_number"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              value={inputs.dl_number}
              onChange={handleChange}
            />
            <label
              for="dl_number"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              DL Number
            </label>
            {errors.dl_number && (
              <p className="text-red-500 text-xs mt-1">{errors.dl_number}</p>
            )}
          </div>

          {/* dl expiry  */}
          <div className="relative z-0 w-full mb-5 group">
            <label className="font-md text-gray-500 text-sm">DL Expiry</label>
            <DatePicker
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              value={dlExpiry}
              onChange={(newValue) => dlDateChange(newValue)}
            />
            {errors.dl_expiry && (
              <p className="text-red-500 text-xs mt-1">{errors.dl_expiry}</p>
            )}
          </div>

          {/* residential address  */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="residential_address"
              id="floating_email"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              value={inputs.residential_address}
              onChange={handleChange}
            />
            <label
              for="residential_address"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Residential Address
            </label>
            {errors.residential_address && (
              <p className="text-red-500 text-xs mt-1">
                {errors.residential_address}
              </p>
            )}
          </div>

          {/* work address  */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="work_address"
              id="work_address"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              value={inputs.work_address}
              onChange={handleChange}
            />
            <label
              for="work_address"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Work Address
            </label>
            {errors.work_address && (
              <p className="text-red-500 text-xs mt-1">{errors.work_address}</p>
            )}
          </div>

          <button
            disabled={disabled}
            className="border-2 border-gray-800 text-gray-800 bg-white hover:bg-gray-800 hover:text-white transition duration-200 rounded-full px-4 py-2"
          >
            Submit
          </button>
        </form>
      </div>
    </LocalizationProvider>
  );
}
