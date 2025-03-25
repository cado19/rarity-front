import React, { useCallback, useRef } from "react";
import Webcam from "react-webcam";
import Logo from "../../assets/rarity_logo.png";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../../constants/url";
import Swal from "sweetalert2";

export default function ProfileUpload() {
  const webcamRef = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();
  
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const uploadURL = baseUrl + `/api/customers/profile_upload.php`;

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    uploadImage(imageSrc);
  }

  const uploadImage = async (imageSrc) => {
    try {
      await axios.post(uploadURL, {image: imageSrc, id}).then((response) => {
        console.log(response);
        if (response.data.status == "Success") {
          navigate("/success", {state: {message: "Profile photo uploaded successfully"}});
        } else {
          Swal.fire({
            title: "Error",
            text: "An error occurred while uploading your photo",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      });
    } catch (error) {
      
    }
  }

  // const capture = useCallback(() => {
  //   const imageSrc = webcamRef.current.getScreenshot();
  //   try {
  //     const formData = new FormData();
  //     formData.append("image", imageSrc);
  //     formData.append("id", id);
  //     axios.post(uploadURL, formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     }).then((response) => {
  //       console.log(response);
  //     });
  //   } catch (error) {
      
  //   }
  //   // console.log(imageSrc);
  // }, [webcamRef]);

  return (
    <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md mt-2 mx-3">
      <div>
        <img src={Logo} alt="Rarity Logo" className="mx-auto" />
      </div>
      <div className="max-w-sm flex flex-col justify-center mx-auto">

        <h1 className="font-bold text-2xl">Take a photo of yourself</h1>
        <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
        <button
          className="mt-3 border-2 border-gray-800 text-gray-800 bg-white hover:bg-gray-800 hover:text-white transition duration-200 rounded-full px-4 py-2"
          onClick={capture}
        >
          Capture photo
        </button>
      </div>
    </div>
  );
}
