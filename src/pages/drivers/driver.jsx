import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { baseURL } from "../../constants/url";
import axios from "axios";
import Loading from "../../components/PageContent/Loading";

export default function Driver() {
  const { id } = useParams();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const driverURL = baseURL + `/api/drivers/read_single.php?id=${id}`;

  const getDriver = async () => {
    try {
      await axios.get(driverURL).then((response) => {
        console.log(response);
        setDriver(response.data.driver);
        setLoading(false);
      });
    } catch (error) {
      const errorMessage = error.message;
      setError(errorMessage);
    }
  };

  useEffect(() => {
    getDriver();
  }, []);
  
 //format dl expiry date
 const dl_expiry_date = new Date(driver?.dl_expiry);
 const birth_date = new Date(driver?.date_of_birth);
  if (error) {
    return (
      <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md">
        {error}
      </div>
    );
  }
  if (loading) {
    return (
      <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md">
        <Loading />
      </div>
    );
  }

  return (
  <div className=" rounded overflow-hidden shadow-lg flex flex-row bg-white">
    <div className="flex items-center justify-center">
        <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">Driver Details</div>{" "}
            <p className="text-gray-700 text-base">
            {" "}
            <span className="font-bold"> Name:</span> {driver.first_name}{" "}
            {driver.last_name}.{" "}
          </p>{" "}
          <p className="text-gray-700 text-base">
            {" "}
            <span className="font-bold">Email:</span> {driver.email}.{" "}
          </p>{" "}
          <p className="text-gray-700 text-base">
            {" "}
            <span className="font-bold">Tel:</span> {driver.phone_no}.{" "}
          </p>{" "}
        
          <p className="text-gray-700 text-base">
            {" "}
            <span className="font-bold">ID Number:</span> {driver.id_no}.{" "}
          </p>{" "}
          <p className="text-gray-700 text-base">
            {" "}
            <span className="font-bold">DL Number:</span> {driver.dl_no}.{" "}
          </p>{" "}
          <p className="text-gray-700 text-base">
            {" "}
            <span className="font-bold">DL Expiry:</span>{" "}
            {dl_expiry_date.toString()}.{" "}
          </p>{" "}
         
          <p className="text-gray-700 text-base">
            {" "}
            <span className="font-bold">Date of Birth:</span>{" "}
            {birth_date.toString()}.{" "}
          </p>{" "}
        </div>
    </div>
  </div>
);
}
