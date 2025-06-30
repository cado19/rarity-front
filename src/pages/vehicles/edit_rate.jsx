import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Swal from "sweetalert2";

export default function EditRate() {
  const [rate, setRate] = useState("");
  const [category, setCategory] = useState(""); // category state as displayed in the select dropdown
  const [selectedCategory, setSelectedCategory] = useState(""); // category state as displayed in the select dropdown
  const [disabled, setDisabled] = useState(false);
  const categoryOptions = [
    { value: "1", label: "SUV" },
    { value: "2", label: "Mid Size SUV" },
    { value: "3", label: "Medium Car" },
    { value: "4", label: "Small Car" },
    { value: "5", label: "Safari" },
    { value: "6", label: "Luxury" },
    { value: "7", label: "Commercial" },
    { value: "8", label: "Truck" },
  ]; 

  const rateUrl =
    import.meta.env.VITE_BASE_URL + "/api/fleet/update_category_rate.php";
  const navigate = useNavigate();

  const categoryChange = (value) => {
    setCategory(value);
    setSelectedCategory(value.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);
    setRate(rate.trim());
    const rateData = {
      category_id: selectedCategory,
      rate_amount: rate,
    };
    // console.log("Rate Data Submitted:", rateData);
    const response = await axios.post(rateUrl, rateData);
    console.log("Response from API:", response.data);
    if (response.data.status === "Success") {
      navigate("/", {
        state: { message: `Successfully changed rate for ${category.label}` },
      });
    } else {
      Swal.fire({
        title: "Error",
        text: response.data.message || "Failed to update rate",
        icon: "error",
        confirmButtonText: "OK",
      });
      setDisabled(false);
    }
  };
  return (
    <div className="bg-white px-4 py-4 rounded border-gray-200 flex-1 shadow-md mt-2 mx-3 ">
      <h2 className="text-2xl font-bold mb-4">Edit Category Rate</h2>
      <p className="text-md italic text-gray-600 mb-4">
        This will set the rate for all vehicles within the selected category
      </p>
      <form onSubmit={handleSubmit}>
        <div className="mb-5 group mt-5">
          <Select
            value={category}
            onChange={categoryChange}
            options={categoryOptions}
            displayEmpty
            // inputProps={{ "aria-label": "Without label" }}
            placeholder="Select Category"
            className="w-full"
          />
        </div>
        <div className="mb-5 group mt-5">
          <input
            type="text"
            name="rate_amount"
            placeholder="Rate Amount"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          className="mt-2 border-2 border-gray-800 text-gray-800 bg-white hover:bg-gray-800 hover:text-white transition duration-200 rounded-full px-4 py-2"
          disabled={disabled}
        >
          Save
        </button>
      </form>
    </div>
  );
}
