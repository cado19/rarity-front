import React, { useState } from "react";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { baseURL } from "../../constants/url";
import Logo from "../../assets/rarity_logo.png";
import { useParams } from "react-router-dom";

export default function IDUpload() {
  const [idFront, setidFront] = useState(null);
  const [idBack, setidBack] = useState(null);

  const { id } = useParams();

  const uploadURL = baseURL + `/api/customers/id_upload.php`;

  const handleidFrontChange = (e) => {
    setidFront(e.target.files[0]);
  };
  const handleidBackChange = (e) => {
    setidBack(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!idFront) {
      alert("Please select an image of front side of ID!");
      return;
    } else if(!idBack){
        alert("Please select an image of back side of ID!");
        return;
    }

    try {
      // Options for image compression
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };

      // Compress the image
      const compressedFront = await imageCompression(idFront, options);
      const compressedBack = await imageCompression(idBack, options);

      // Prepare the form data
      const formData = new FormData();
      formData.append("idFront", compressedFront);
      formData.append("idBack", compressedBack);
      formData.append("id", id);

      // Upload the compressed image
      const response = await axios.post(uploadURL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);

      alert("File uploaded successfully!");
    } catch (error) {
      alert("An error occurred while uploading the file.");
    }
  };
  return (
    <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md mt-2 mx-3">
      <div>
        <img src={Logo} alt="Rarity Logo" className="mx-auto" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2">
            <label htmlFor="idFront" className="font-bold">Front Side of Id</label>
            <input type="file" onChange={handleidFrontChange} />
        </div>
        <div className="flex flex-row gap-2">
            <label htmlFor="idFront" className="font-bold">Back Side of Id</label>
            <input type="file" onChange={handleidBackChange} />
        </div>
      </div>
      <button
        className="mt-3 border-2 border-gray-800 text-gray-800 bg-white hover:bg-gray-800 hover:text-white transition duration-200 rounded-full px-4 py-2"
        onClick={handleUpload}
      >
        Upload Image
      </button>
    </div>
  );
}
