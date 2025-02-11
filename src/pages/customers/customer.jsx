import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseURL, feUrl } from "../../constants/url";
import { useParams } from "react-router-dom";
import Loading from "../../components/PageContent/Loading";
import Swal from "sweetalert2";

export default function Customer() {
  const { id } = useParams();
  const customerUrl = baseURL + `/api/customers/read_single.php?id=${id}`;
  const licenseURL = feUrl + `/upload_license/${id}`;

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const copyDlURL = () => {
    navigator.clipboard.writeText(licenseURL);
    Swal.fire({
      title: "Link copied",
      text: "License Link copied to clipboard",
      icon: "success",
      confirmButtonText: "OK",
    })
  }

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
  }, []);

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
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
      {" "}
      <img
        className="w-full"
        src="https://via.placeholder.com/400x200"
        alt="Card image"
      />{" "}
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
            // onClick={handleUpload}
          >
            ID Link
          </button>
        </span>{" "}
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          <button
            className="border-2 border-gray-800 text-gray-800 bg-white hover:bg-gray-800 hover:text-white transition duration-200 rounded-full px-4 py-2"
            // onClick={handleUpload}
          >
            Profile Link
          </button>
        </span>{" "}
      </div>{" "}
    </div>
  );
}
