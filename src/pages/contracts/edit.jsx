import axios from "axios";
import React, { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
import { baseURL } from "../../constants/url";

export default function EditContract() {
  const sigCanvas = useRef(null);
  const { id } = useParams();

  const navigate = useNavigate();

  const contractUrl = baseURL + `/api/contracts/update.php`;

  const clearSignature = () => {
    sigCanvas.current.clear();
  };

  const saveSignature = () => {
    const dataURL = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
    // console.log(dataURL);
    uploadSignature(dataURL);
  };

  const uploadSignature = async (dataURL) => {
    await axios.post(contractUrl, {image: dataURL, id}).then((response) => {
        if(response.data.status == "Success"){
            //navigate to success page
            navigate("/success", {state: {message: "Contract successfully signed"}});

        }
        console.log(response);
    })
  };

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
          >
            Save
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
      </div>
      {/* button options for viewing contract / booking voucher  */}
      <div>

      </div>
    </div>
  );
}
