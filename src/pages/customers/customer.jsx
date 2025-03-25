import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseURL, feUrl, userUrl } from "../../constants/url";
import { useParams } from "react-router-dom";
import Loading from "../../components/PageContent/Loading";
import Swal from "sweetalert2";
import userAvatar from "../../assets/anonymous_avatars_grey_circles.jpg";
import LicenseModal from "./license_modal";
import IDmodal from "./id_modal";

export default function Customer() {
  const { id } = useParams();
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const customerUrl = baseUrl + `/api/customers/read_single.php?id=${id}`;
  const licenseURL = userUrl + `/dl_form&id=${id}`;
  const idURL = userUrl + `/id_form&id=${id}`;
  const profileURL = userUrl + `/profile_form&id=${id}`;

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [licenseModalOpen, setLicenseModalOpen] = useState(false);
  const [idModalOpen, setIdModalOpen] = useState(false);

  const copyDlURL = () => {
    navigator.clipboard.writeText(licenseURL);
    Swal.fire({
      title: "Link copied",
      text: "License Link copied to clipboard",
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  const copyIDURL = () => {
    navigator.clipboard.writeText(idURL);
    Swal.fire({
      title: "Link copied",
      text: "ID Link copied to clipboard",
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  const copyProfileURL = () => {
    navigator.clipboard.writeText(profileURL);
    Swal.fire({
      title: "Link copied",
      text: "Profile Link copied to clipboard",
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  async function getCustomer() {
    try {
      const response = await axios.get(customerUrl);
      setCustomer(response.data);
      setLoading(false);
      console.log(response.data);
    } catch (error) {
      setError(true);
      console.error(error);
    }
  }

  useEffect(() => {
    getCustomer();
  }, [loading]);

  //format dl expiry date
  const dl_expiry_date = new Date(customer?.dl_expiry);
  const birth_date = new Date(customer?.date_of_birth);

  if (loading) {
    return (
      <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md">
        <Loading />
      </div>
    );
  }

  return (
    <div className=" rounded overflow-hidden shadow-lg flex flex-row bg-white">
      <LicenseModal
        show={licenseModalOpen}
        onClose={() => setLicenseModalOpen(false)}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        license={customer.license_image}
        avatar={userAvatar}
        baseURL={baseURL}
      />
      <IDmodal
        show={idModalOpen}
        onClose={() => setIdModalOpen(false)}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        id_front={customer.id_image}
        id_back={customer.id_back_image}
        license={customer.license_image}
        avatar={userAvatar}
        baseURL={baseURL}
      />{" "}
      <div className="flex flex-col items-center justify-center gap-2">
        {customer.profile_image ? (
          <img
            className="w-52 h-48"
            src={baseURL + `/files/customers/profile/${customer.profile_image}`}
            alt="Card image"
          />
        ) : (
          <img className="w-52 h-48" src={userAvatar} alt="Card image" />
        )}{" "}
        <button
          className="bg-transparent text-blue-500 font-semibold py-2 px-4 border border-blue-500 rounded hover:bg-blue-500 hover:text-white transition duration-300 ease-in-out"
          onClick={() => setLicenseModalOpen(true)}
        >
          View License
        </button>
        <button
          className="bg-transparent text-blue-500 font-semibold py-2 px-4 border border-blue-500 rounded hover:bg-blue-500 hover:text-white transition duration-300 ease-in-out"
          onClick={() => setIdModalOpen(true)}
        >
          View ID
        </button>
      </div>
      <div className="flex items-center justify-center">
        <div className="px-6 py-4">
          {" "}
          <div className="font-bold text-xl mb-2">Customer Details</div>{" "}
          <p className="text-gray-700 text-base">
            {" "}
            <span className="font-bold"> Name:</span> {customer.first_name}{" "}
            {customer.last_name}.{" "}
          </p>{" "}
          <p className="text-gray-700 text-base">
            {" "}
            <span className="font-bold">Email:</span> {customer.email}.{" "}
          </p>{" "}
          <p className="text-gray-700 text-base">
            {" "}
            <span className="font-bold">Tel:</span> {customer.phone_no}.{" "}
          </p>{" "}
          <p className="text-gray-700 text-base">
            {" "}
            <span className="font-bold">ID Type:</span> {customer.id_type}.{" "}
          </p>{" "}
          <p className="text-gray-700 text-base">
            {" "}
            <span className="font-bold">ID Number:</span> {customer.id_no}.{" "}
          </p>{" "}
          <p className="text-gray-700 text-base">
            {" "}
            <span className="font-bold">DL Number:</span> {customer.dl_no}.{" "}
          </p>{" "}
          <p className="text-gray-700 text-base">
            {" "}
            <span className="font-bold">DL Expiry:</span>{" "}
            {dl_expiry_date.toString()}.{" "}
          </p>{" "}
          <p className="text-gray-700 text-base">
            {" "}
            <span className="font-bold">Work Address:</span>{" "}
            {customer.work_address}.{" "}
          </p>{" "}
          <p className="text-gray-700 text-base">
            {" "}
            <span className="font-bold">Residential Address:</span>{" "}
            {customer.residential_address}.{" "}
          </p>{" "}
          <p className="text-gray-700 text-base">
            {" "}
            <span className="font-bold">Date of Birth:</span>{" "}
            {birth_date.toString()}.{" "}
          </p>{" "}
        </div>{" "}
        <div className="px-6 pt-4 pb-2">
          {" "}
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            <button
              className="border-2 border-gray-800 text-gray-800 bg-white hover:bg-gray-800 hover:text-white transition duration-200 rounded-full px-4 py-2"
              onClick={copyDlURL}
            >
              License link
            </button>
          </span>{" "}
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            <button
              className="border-2 border-gray-800 text-gray-800 bg-white hover:bg-gray-800 hover:text-white transition duration-200 rounded-full px-4 py-2"
              onClick={copyIDURL}
            >
              ID Link
            </button>
          </span>{" "}
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            <button
              className="border-2 border-gray-800 text-gray-800 bg-white hover:bg-gray-800 hover:text-white transition duration-200 rounded-full px-4 py-2"
              onClick={copyProfileURL}
            >
              Profile Link
            </button>
          </span>{" "}
        </div>{" "}
      </div>
    </div>
  );
}
