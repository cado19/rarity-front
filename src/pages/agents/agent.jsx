import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { baseURL } from "../../constants/url";
import {
  FaCog,
  FaDollarSign,
  FaKey,
  FaEdit,
  FaChartBar,
  FaTag,
  FaBalanceScale,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaUserShield,
} from "react-icons/fa";
import Loading from "../../components/PageContent/Loading";
import Newcomm from "./newcomm";
import Swal from "sweetalert2";
import BookingTbl from "../../components/agents/bookings";
import Newrate from "./newrate";
import Editpass from "./editpass";
import { Mosaic } from "react-loading-indicators";
import { EarnedCommissionsModal } from "../../components/agents/earnedCommissionModal";
import {
  fetchAgentBookings,
  fetchAgentCommissionPlans,
  fetchAgentDetails,
} from "../../api/fetch";
import {
  submit_agent_password,
  submit_agent_rate,
  submit_agent_commission,
} from "../../api/post";

export default function Agent() {
  const { id } = useParams();
  console.log("id: ", id);
  const [agent, setAgent] = useState();
  const [roleId, setRoleId] = useState(null);
  const [agentBookings, setAgentBookings] = useState([]);
  const [agentCommissionPlans, setAgentCommissionPlans] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // commission modal open close state
  const [rateModalOpen, setRateModalOpen] = useState(false); // rate modal open close state
  const [passModalOpen, setPassModalOpen] = useState(false); // password modal open close state
  const [earnedModalOpen, setEarnedModalOpen] = useState(false); // earning form modal

  const navigate = useNavigate();

  const getRoleId = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setRoleId(user.role_id);
    }
  };

  const getAgent = async () => {
    try {
      const response = await fetchAgentDetails(id);
      console.log("Get agent response: ", response);

      setAgent(response.agent);
      // setLoading(false);
    } catch (error) {
      const errorMessage = error.message;
      setError(errorMessage);
    }
  };

  const getAgentBookings = async () => {
    try {
      const response = await fetchAgentBookings(id);
      // console.log("Get agent bookings response: ", response);
      if (response.message == "Agent has no bookings") {
        return;
      }
      const bookings = response.bookings;
      // formatBookings(bookings);

      // console.log(response);
      // setAgentBookings(response.data.bookings);
      // setLoading(false);
    } catch (error) {
      const errorMessage = error.message;
      console.log("agent booking error", errorMessage);
      setError(errorMessage);
      // setLoading(false);
    }
  };

  const getAgentCommissionPlans = async () => {
    try {
      const response = await fetchAgentCommissionPlans();
      const commissions = response.data;
      setAgentCommissionPlans(commissions);
      console.log(response);
      // setLoading(false);
    } catch (error) {
      console.log("agent commission error: ", error.message);
    }
  };

  // function to alter the data format a bit
  function formatBookings(bookings) {
    const alteredData = bookings.map((booking) => {
      return {
        ...booking,
        id: booking.id,
        no: booking.booking_no,
        client: booking.c_fname + " " + booking.c_lname,
        vehicle: booking.make + " " + booking.model,
        number_plate: booking.number_plate,
        start_date: booking.start_date,
        end_date: booking.end_date,
      };
    });
    setAgentBookings(alteredData);
  }

  // SUBMIT AGENT COMMISSION TO THE BACKEND
  const handleCommissionSubmit = async (data) => {
    console.log(data);
    setIsModalOpen(false);
    const response = await submit_agent_commission(data);
    if (response.data.status === "Success") {
      Swal.fire({
        title: "Rate Set Successfully",
        icon: "success",
        confirmButtonText: "OK",
      });
      getAgentCommissionPlans();
    } else {
      Swal.fire({
        title: "Error Setting Rate",
        text: response.data.message,
        icon: "error",
        confirmButtonText: "OK",
      });
      console.log(response);
    }
    getAgent();
  };

  // SUBMIT AGENT PASSWORD TO THE BACKEND
  const handlePasswordSubmit = async (data) => {
    console.log(data);
    setIsModalOpen(false);
    const response = await submit_agent_password(id, data);
    if (responsestatus === "Success") {
      Swal.fire({
        title: "Password Successfully Updated",
        icon: "success",
        confirmButtonText: "OK",
      });
      getAgentCommissionPlans();
    } else {
      Swal.fire({
        title: "Error updating password",
        text: response.message,
        icon: "error",
        confirmButtonText: "OK",
      });
      // console.log(response);
    }
    getAgent();
  };

  // SUBMIT AGENT RATE TO THE BACKEND
  const handleRateSubmit = async (data) => {
    console.log(data);
    setRateModalOpen(false);
    const response = await submit_agent_rate(id, data);
    if (response.status === "Success") {
      Swal.fire({
        title: "Rate Set Successfully",
        icon: "success",
        confirmButtonText: "OK",
      });
      getAgentCommissionPlans();
    } else {
      Swal.fire({
        title: "Error Setting Rate",
        text: response.message,
        icon: "error",
        confirmButtonText: "OK",
      });
      console.log(response);
    }
    getAgent();
  };

  // get category data on load
  const categoryOptions = [
    { value: "1", label: "SUV" },
    { value: "2", label: "Mid Size SUV" },
    { value: "3", label: "Medium Car" },
    { value: "4", label: "Small Car" },
    { value: "5", label: "Safari" },
    { value: "6", label: "Luxury" },
    { value: "7", label: "Commercial" },
    { value: "8", label: "Truck" },
  ];

  // useEffect(() => {
  //   getRoleId();
  //   getAgent();
  //   getAgentBookings();
  //   getAgentCommissionPlans();
  //   setLoading(false);
  // }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        getRoleId(); // synchronous

        // run all async calls in parallel
        const [agentRes, bookingsRes, commissionsRes] = await Promise.all([
          fetchAgentDetails(id),
          fetchAgentBookings(id),
          fetchAgentCommissionPlans(id),
        ]);

        // set state from results
        setAgent(agentRes.agent);
        console.log("Agent res: ", agentRes);

        if (bookingsRes.message !== "Agent has no bookings") {
          formatBookings(bookingsRes.bookings);
        }

        setAgentCommissionPlans(commissionsRes.data);
      } catch (err) {
        setError(err.message || "Failed to load agent data");
      } finally {
        setLoading(false); // only after all calls finish
      }
    };

    loadData();
  }, [id]);

  console.log("role id", roleId);

  if (error) {
    return (
      <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md">
        {error}
      </div>
    );
  }
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      {/* Agent Details Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h1 className="text-2xl font-bold text-yellow-600">Agent Details</h1>
          <span className="text-sm text-gray-500">ID: {agent?.id}</span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="flex items-center gap-2 text-gray-600">
              <FaUser className="text-blue-500" />
              <span className="font-semibold">Name:</span> {agent?.name}
            </p>
            <p className="flex items-center gap-2 text-gray-600">
              <FaEnvelope className="text-yellow-500" />
              <span className="font-semibold">Email:</span> {agent?.email}
            </p>
            <p className="flex items-center gap-2 text-gray-600">
              <FaPhone className="text-green-500" />
              <span className="font-semibold">Tel:</span> {agent?.phone_no}
            </p>
          </div>
          <div>
            <p className="flex items-center gap-2 text-gray-600">
              <FaGlobe className="text-purple-500" />
              <span className="font-semibold">Country:</span> {agent?.country}
            </p>
            <p className="flex items-center gap-2 text-gray-600">
              <FaUserShield className="text-red-500" />
              <span className="font-semibold">Role:</span>{" "}
              {agent?.roles?.map((r) => r.name).join(", ")}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-6">
          {roleId == 0 && (
            <>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-md border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition"
                onClick={() => setIsModalOpen(true)}
              >
                <FaCog className="text-lg" />
                Set Commission
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-md border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white transition"
                onClick={() => setRateModalOpen(true)}
              >
                <FaDollarSign className="text-lg" />
                Set Rate
              </button>
            </>
          )}

          <button
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition"
            onClick={() => setPassModalOpen(true)}
          >
            <FaKey className="text-lg" />
            Edit Password
          </button>

          <button
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition"
            onClick={() => navigate(`/agent/${id}/edit`)}
          >
            <FaEdit className="text-lg" />
            Edit Agent Details
          </button>

          <button
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition"
            onClick={() => setEarnedModalOpen(true)}
          >
            <FaChartBar className="text-lg" />
            Generate Commission
          </button>
        </div>
      </div>

      {/* Commission Plans Table */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Commission Plans
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  <span className="flex items-center gap-2">
                    <FaTag className="text-gray-500" />
                    Category
                  </span>
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  <span className="flex items-center gap-2">
                    <FaBalanceScale className="text-gray-500" />
                    Type
                  </span>
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  <span className="flex items-center gap-2">
                    <FaDollarSign className="text-gray-500" />
                    Amount
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {agentCommissionPlans?.map((plan, index) => (
                <tr
                  key={plan.name}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } border-t hover:bg-indigo-50 transition-colors`}
                >
                  <td className="px-4 py-2">{plan.name}</td>
                  <td className="px-4 py-2 capitalize">
                    {plan.commission_type}
                    {plan.commission_type === "percentage" && (
                      <span className="ml-2 inline-block px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                        %
                      </span>
                    )}
                    {plan.commission_type === "fixed" && (
                      <span className="ml-2 inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                        KES
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {plan.commission_amount}
                    {plan.commission_type === "percentage" && (
                      <span className="ml-2 text-green-600 font-bold">%</span>
                    )}
                    {plan.commission_type === "fixed" && (
                      <span className="ml-2 text-blue-600 font-bold">KES</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Bookings</h3>
        <BookingTbl bookings={agentBookings} />
      </div>

      {/* Modals */}
      <Newcomm
        agent={agent}
        categoryOptions={categoryOptions}
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCommissionSubmit}
      />
      <Newrate
        agent={agent}
        categoryOptions={categoryOptions}
        show={rateModalOpen}
        onClose={() => setRateModalOpen(false)}
        onSubmit={handleRateSubmit}
      />
      <Editpass
        agent={agent}
        show={passModalOpen}
        onClose={() => setPassModalOpen(false)}
        onSubmit={handlePasswordSubmit}
      />
      <EarnedCommissionsModal
        show={earnedModalOpen}
        onClose={() => setEarnedModalOpen(false)}
        agentId={id}
      />
    </>
  );
}
