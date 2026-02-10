import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
import { baseURL } from "../../constants/url";
import { get_vehicle_pricing } from "../../api/fetch";
import Loading from "../../components/PageContent/Loading";
import { upload_signature } from "../../api/put";

export default function EditContract() {
  const sigCanvas = useRef(null);
  const { id, vehicle_id } = useParams();

  const navigate = useNavigate();

  const contractUrl = baseURL + `/api/contracts/update.php`;

  // state for cdw checkbox
  const [pricing, setPricing] = useState(); // a vehicle's pricing
  const [cdw, setCdw] = useState(false); // cdw for the form
  const [cdwTotal, setCdwTotal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);

  const fetchVehicleCDW = async () => {
    try {
      const response = await get_vehicle_pricing(vehicle_id);
      setPricing(response.data.pricing);
      console.log(response);
    } catch (error) {
      console.error("Error fetching pricing: ", error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchVehicleCDW();
  }, []);

  const clearSignature = () => {
    sigCanvas.current.clear();
  };

  const saveSignature = () => {
    const dataURL = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
    // console.log(dataURL);
    handleUpload(dataURL);
  };

  const handleUpload = async (dataURL) => {
    setPending(true);
    const response = await upload_signature({
      id,
      image: dataURL,
      cdw, // boolean from checkbox state
    });
    console.log("Contract response: ", response.data);
    if (response.data.status === "Success") {
      if (response.data.cdw_total) {
        setCdwTotal(response.data.cdw_total);
      }
      setTimeout(() => {
        navigate(`/booking/${id}`, {
          state: { message: "Contract successfully signed" },
        });
      }, 1500);
    } else {
      alert(response.data.message || "Failed to sign contract");
    }
    setPending(false);
  };

  if (loading) return <Loading />;

  return (
    <div className="p-8">
      <div className="">
        <h1 className="text-3xl font-bold mb-4">
          Sign contract for booking B-053
        </h1>
        <SignatureCanvas
          ref={sigCanvas}
          penColor="black"
          canvasProps={{
            className:
              "signatureCanvas border-2 border-gray-300 rounded-lg w-full h-64",
          }}
        />
        {/* CDW checkbox */}
        {pricing.cdw_rate > 0 && (
          <div className="mt-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={cdw}
                onChange={(e) => setCdw(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <span className="text-gray-700">
                Apply CDW (Collision Damage Waiver)
              </span>
            </label>
          </div>
        )}

        <div className="mt-4">
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
            onClick={clearSignature}
          >
            Clear
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={saveSignature}
            disabled={pending}
          >
            {pending ? "Saving..." : "Save"}
          </button>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            // onClick={saveSignature}
          >
            View Contract
          </button>

          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            // onClick={saveSignature}
          >
            View Voucher
          </button>
        </div>
        {/* Show CDW total if available */}
        {cdwTotal !== null && (
          <div className="mt-4 p-4 bg-blue-100 border border-blue-300 rounded">
            <p className="text-lg font-semibold text-blue-800">
              CDW Total Applied: {cdwTotal}
            </p>
          </div>
        )}
      </div>
      {/* button options for viewing contract / booking voucher  */}
      <div></div>
    </div>
  );
}
