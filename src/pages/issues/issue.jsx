import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Mosaic } from "react-loading-indicators";
import Swal from "sweetalert2";
import { FaArrowLeft } from "react-icons/fa";
import { get_issue } from "../../api/fetch";

export default function Issue() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [issue, setIssue] = useState();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-KE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const checkMessage = () => {
    location.state &&
      Swal.fire({
        title: location.state.message,
        icon: "success",
        confirmButtonText: "OK",
      });
  };

  

  const getIssue = async () => {
    try {
      const response = await get_issue(id);
      setIssue(response.data.issue);
      console.log(response);
    } catch (error) {
      const errorMessage = "Error: " + error.message;
      setError(errorMessage);
      console.log(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getIssue();
    checkMessage();
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
    <div className="bg-white p-4 rounded shadow space-y-4">
      {/* Back Button  */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 transition"
      >
        <FaArrowLeft className="text-[#9ACD32]" /> {/* YellowGreen tone */}
        <span className="text-[#9ACD32] font-medium">Go Back</span>
      </button>
      <div className="text-lg font-semibold text-yellow-700 mb-1">
        {issue.issue_title}
      </div>
      <div className="text-sm text-gray-600 mb-2">
        {formatDate(issue.date)} • KES {issue.cost.toLocaleString()}
      </div>
      <p className="text-gray-800 mb-2">{issue.issue_description}</p>
      <div className="text-sm text-gray-500">
        Vehicle: {issue.make} {issue.model} ({issue.number_plate})
      </div>
    </div>
  );
}
