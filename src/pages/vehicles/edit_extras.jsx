import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { get_vehicle_extras, get_vehicle_base } from "../../api/fetch";
import { Mosaic } from "react-loading-indicators";
import { FaArrowLeft } from "react-icons/fa";
import { update_vehicle_extras } from "../../api/post";
import Swal from "sweetalert2";

export default function EditExtras() {
  const { id } = useParams();
  const navigate = useNavigate();
  // console.log("vehicle id: ", id);
  //state
  const [extras, setExtras] = useState({
    id,
    bluetooth: "No",
    audio_input: "No",
    keyless_entry: "No",
    reverse_cam: "No",
    gps: "No",
    android_auto: "No",
    apple_carplay: "No",
    sunroof: "No",
  });
  const [vehicle, setVehicle] = useState({
    make: "",
    model: "",
    number_plate: "",
  });
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState();

  // get the vehicle's extras from the backend
  const getExtras = async () => {
    try {
      const response = await get_vehicle_extras(id);
      setExtras(response.data.extras);
      console.log(response);
    } catch (error) {
      const errorMessage = "Error: " + error.message;
      setError(errorMessage);
    }
  };

  // get the vehicle's make, model, number plate from the backend
  const getBase = async () => {
    try {
      const response = await get_vehicle_base(id);
      setVehicle(response.data.vehicle);
      console.log(response);
    } catch (error) {
      const errorMessage = "Error: " + error.message;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => {
    setExtras((prev) => ({
      ...prev,
      [field]: prev[field] === "Yes" ? "No" : "Yes",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPending(true);

    // add the id to the data being sent to the backend
    const payload = {
      vehicle_id: id,
      ...extras,
    };

    // console.log(payload);
    const response = await update_vehicle_extras(payload);
    console.log(response);
    if (response.data.status == "Success") {
      navigate(`/vehicle/${id}`, {
        state: { message: "Vehicle updated successfully" },
      });
    } else {
      Swal.fire({
        title: "An error occured while updating.",
        text: "Please try again",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
    setPending(false);
  };

  useEffect(() => {
    getExtras();
    getBase();
  }, []);

  if (error) {
    return (
      <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md">
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md w-full flex items-center justify-center h-full">
        <Mosaic color="#32cd32" size="large" text="Loading..." textColor="" />
      </div>
    );
  }

  return (
    <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md mt-2 mx-3">
      <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-4xl my-5 text-center ">
        {vehicle.make} {vehicle.model} {vehicle.number_plate} extras
      </h1>
      {/* Back Button  */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 transition"
      >
        <FaArrowLeft className="text-[#9ACD32]" /> {/* YellowGreen tone */}
        <span className="text-[#9ACD32] font-medium">Go Back</span>
      </button>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-4 bg-white rounded shadow-md"
      >
        {Object.keys(extras).map((key) => (
          <div key={key} className="flex items-center justify-between">
            <label className="capitalize">{key.replace("_", " ")}</label>
            <button
              type="button"
              onClick={() => handleChange(key)}
              className={`px-3 py-1 rounded text-white ${
                extras[key] === "Yes" ? "bg-green-600" : "bg-gray-400"
              }`}
            >
              {extras[key]}
            </button>
          </div>
        ))}
        <button
          disabled={pending}
          type="submit"
          className="mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded"
        >
          {pending ? <>Saving...</> : <>Save Changes</>}
        </button>
      </form>
    </div>
  );
}
