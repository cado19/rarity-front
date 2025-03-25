import React, { useState } from "react";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { baseURL } from "../../constants/url";
import Logo from "../../assets/rarity_logo.png";
import { useParams } from "react-router-dom";

export default function LicenseUpload() {
  const [selectedFile, setSelectedFile] = useState(null);

  const { id } = useParams();
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const uploadURL = baseUrl + `/api/customers/license_upload.php`;

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
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
      const compressedFile = await imageCompression(selectedFile, options);

      // Prepare the form data
      const formData = new FormData();
      formData.append("file", compressedFile);
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
      <input type="file" onChange={handleFileChange} />
      <button
        className="border-2 border-gray-800 text-gray-800 bg-white hover:bg-gray-800 hover:text-white transition duration-200 rounded-full px-4 py-2"
        onClick={handleUpload}
      >
        Upload Image
      </button>
    </div>
  );
}
