import React, { useEffect, useState } from "react";
import { update_vehicle_pricing } from "../../api/put";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { get_vehicle_base, get_vehicle_pricing } from "../../api/fetch";
import VehicleInput from "../../components/styled/VehicleInput";

export default function EditPricing() {
  const { id } = useParams();
  const navigate = useNavigate();

  // state
  const [formData, setFormData] = useState({
    vehicle_id: id,
    daily_rate: "",
    vehicle_excess: "",
    refundable_security_deposit: "",
    cdw_rate: "",
    monthly_target: "",
    cdw_vehicle_excess: "",
  });

  const [vehicle, setVehicle] = useState({
    make: "",
    model: "",
    number_plate: "",
  });
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState();
  const [success, setSuccess] = useState();

  // handle change function
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // fetch vehicle pricing function
  const fetchBaseAndPricing = async () => {
    try {
      // const response = await get_vehicle_pricing(id);
      const [vbRes, vpRes] = await Promise.all([
        get_vehicle_base(id),
        get_vehicle_pricing(id),
      ]);
      // get the data part of the response. That's where values are
      const baseData = vbRes.data.base;
      const priceData = vpRes.data.pricing;
      console.log("Price data: ", priceData);

      // set vehicle base info
      setVehicle({
        make: baseData.make,
        model: baseData.model,
        number_plate: baseData.number_plate,
      });

      // set pricing info
      setFormData((prev) => ({
        ...prev,
        daily_rate: priceData.daily_rate || "",
        vehicle_excess: priceData.vehicle_excess || "",
        refundable_security_deposit:
          priceData.refundable_security_deposit || "",
        cdw_rate: priceData.cdw_rate || "",
        monthly_target: priceData.monthly_target || "",
        cdw_vehicle_excess: priceData.cdw_vehicle_excess || "",
      }));
    } catch (error) {
      console.log("Error: ", error.message);
      setError("Failed to fetch vehicle details: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBaseAndPricing();
  }, []);

  // handle submit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await update_vehicle_pricing(formData);

      const data = response.data;
      console.log("Response data: ", data);

      if (data.status === "Success") {
        setSuccess(data.message);
        setTimeout(() => {
          navigate(`/vehicle/${id}`);
        }, 1500);
      } else {
        setError(data.message || "Failed to update pricing");
      }
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md mt-2 mx-3">
      <h1>Edit Pricing</h1>

      {/* Vehicle base info */}
      <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-4xl my-5 text-center ">
        {vehicle.make} {vehicle.model} {vehicle.number_plate} Pricing
      </h1>

      {/* Back Button  */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 transition"
      >
        <FaArrowLeft className="text-[#9ACD32]" /> {/* YellowGreen tone */}
        <span className="text-[#9ACD32] font-medium">Go Back</span>
      </button>

      {/* Pricing form */}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-3">
        {/* Daily Rate */}
        <VehicleInput
          label="Daily Rate"
          name="daily_rate"
          value={formData.daily_rate}
          onChange={handleChange}
          // error={errors.make}
        />

        {/* Vehicle Excess */}
        <VehicleInput
          label="Vehicle Excess"
          name="vehicle_excess"
          value={formData.vehicle_excess}
          onChange={handleChange}
          // error={errors.make}
        />


        {/* Refundable Security Deposit */}
        <VehicleInput
          label="Refundable Security Deposit"
          name="refundable_security_deposit"
          value={formData.refundable_security_deposit}
          onChange={handleChange}
          // error={errors.make}
        />

        {/* CDW Rate */}
        <VehicleInput
          label="CDW Rate"
          name="cdw_rate"
          value={formData.cdw_rate}
          onChange={handleChange}
          // error={errors.make}
        />

        {/* CDW Vehicle Excess */}
        <VehicleInput
          label="CDW Vehicle Excess"
          name="cdw_vehicle_excess"
          value={formData.cdw_vehicle_excess}
          onChange={handleChange}
          // error={errors.make}
        />

        {/* Monthly Target */}
        <VehicleInput
          label="Monthly Target"
          name="monthly_target"
          value={formData.monthly_target}
          onChange={handleChange}
          // error={errors.make}
        />

       <button
          type="submit"
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          disabled={pending}
        >
          {pending ? "Saving..." : "Save Changes"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
}
