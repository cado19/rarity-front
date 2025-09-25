import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import PhoneInput from "react-phone-number-input";
import Select from "react-select";
import Swal from "sweetalert2";
import { Mosaic } from "react-loading-indicators";
import { fetchCustomer } from "../../api/fetch";
import { update_customer_details } from "../../api/put";
import FloatingDatePicker from "../../components/styled/FloatingDatePicker";

export default function EditCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const fetchUrl = `${baseUrl}/api/customers/read_single.php?id=${id}`;
  const updateUrl = `${baseUrl}/api/customers/update.php`;

  const [inputs, setInputs] = useState({
    f_name: "",
    l_name: "",
    email: "",
    phone_number: "",
    date_of_birth: "1970-01-01",
    id_type: "",
    id_number: "",
    dl_number: "",
    dl_expiry: "1970-01-01",
    residential_address: "",
    work_address: "",
  });

  const [birthDate, setBirthDate] = useState(new Date());
  const [dlExpiry, setDlExpiry] = useState(new Date());
  const [selectedOption, setSelectedOption] = useState(null);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState();
  const [disabled, setDisabled] = useState(false);

  const options = [
    { value: "National ID", label: "National ID" },
    { value: "Passport", label: "Passport" },
    { value: "Military ID", label: "Military ID" },
  ];

  const getCustomer = async () => {
    try {
      const response = await fetchCustomer(id);
      const data = response.data.customer;
      setInputs({
        f_name: data.first_name,
        l_name: data.last_name,
        email: data.email,
        phone_number: data.phone_no,
        id_type: data.id_type,
        id_number: data.id_no,
        dl_number: data.dl_no,
        dl_expiry: data.dl_expiry,
        date_of_birth: data.date_of_birth,
        residential_address: data.residential_address,
        work_address: data.work_address,
      });

      setPhone(data.phone_no);
      setBirthDate(new Date(data.date_of_birth));
      setDlExpiry(new Date(data.dl_expiry));
      setSelectedOption({ value: data.id_type, label: data.id_type });
    } catch (error) {
      setError(true);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCustomer();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const birthDateChange = (value) => {
    setBirthDate(value);
    setInputs((prev) => ({
      ...prev,
      date_of_birth: formatDate(value),
    }));
  };

  const dlDateChange = (value) => {
    setDlExpiry(value);
    setInputs((prev) => ({
      ...prev,
      dl_expiry: formatDate(value),
    }));
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${year}-${month}-${day}`;
  };

  const idTypeChange = (value) => {
    setSelectedOption(value);
    setInputs((prev) => ({ ...prev, id_type: value.value }));
  };

  const phoneChange = (value) => {
    setPhone(value);
    setInputs((prev) => ({ ...prev, phone_number: value }));
  };

  const validate = (data) => {
    const errors = {};
    if (!data.f_name) errors.first_name = "First name is required";
    if (!data.l_name) errors.last_name = "Last name is required";
    if (!data.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(data.email))
      errors.email = "Email is invalid";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);
    const validationErrors = validate(inputs);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setDisabled(false);
      return;
    }

    try {
      const payload = {
        id,
        ...inputs,
      };
      const response = await update_customer_details(payload);
      // console.log(payload);
      if (response.data.status === "Success") {
        navigate(`/customer/${id}`, { state: { message: "Customer Updated" } });
      } else {
        Swal.fire({
          title: "Error Occurred",
          text: response.data.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDisabled(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md w-full flex items-center justify-center h-full">
        <Mosaic color="#32cd32" size="large" text="Loading..." textColor="" />
      </div>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md mt-2 mx-3">
        <h3 className="xl mt-2">Add Client</h3>
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

          <div className="relative z-0 w-full group mb-5">
            <PhoneInput
              name="phone_number"
              defaultCountry="KE"
              value={phone}
              onChange={(phone) => phoneChange(phone)}
              className="peer block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 dark:text-white dark:border-gray-600 dark:focus:border-blue-500"
              placeholder=" "
            />
            <label
              htmlFor="phone_number"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
            >
              Phone Number
            </label>
            {errors.phone_number && (
              <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>
            )}
          </div>

          {/* date of birth  */}
          <FloatingDatePicker
            label="Date of Birth"
            value={birthDate}
            onChange={birthDateChange}
            name="date_of_birth"
            error={errors.date_of_birth}
          />
          {/* <div className="relative z-0 w-full mb-5 group mt-5">
            <DatePicker
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder="Date of Birth"
              onChange={(newValue) => birthDateChange(newValue)}
              value={birthDate}
            />
          </div> */}

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
              value={inputs.id_number}
              onChange={handleChange}
            />
            <label
              for="id_number"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              ID Number
            </label>
          </div>

          {/* dl number  */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="dl_number"
              id="dl_number"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
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
          <FloatingDatePicker
            label="DL Expiry"
            value={dlExpiry}
            onChange={dlDateChange}
            name="dl_expiry"
            error={errors.dl_expiry}
          />
          {/* <div className="relative z-0 w-full mb-5 group">
            <DatePicker
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              value={dlExpiry}
              onChange={(newValue) => dlDateChange(newValue)}
            />
          </div> */}

          {/* residential address  */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="residential_address"
              id="floating_email"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
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
