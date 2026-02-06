import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { baseURL } from "../../constants/url";
import axios from "axios";
import Loading from "../../components/PageContent/Loading";
import Newcomm from "./newcomm";
import Swal from "sweetalert2";
import BookingTbl from "../../components/agents/bookings";
import Newrate from "./newrate";
import Editpass from "./editpass";
import { Mosaic } from "react-loading-indicators";
import { EarnedCommissionsModal } from "../../components/agents/earnedCommissionModal";
import { fetchAgentBookings, fetchAgentCommissionPlans, fetchAgentDetails } from "../../api/fetch";

export default function Agent() {
  const { id } = useParams();
  console.log("id: ", id)
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

  const baseUrl = import.meta.env.VITE_BASE_URL;

  const commissionURL = baseUrl + `/api/commissions/update.php?agent_id=${id}`;
  const passwordURL = baseUrl + `/api/accounts/update_pass.php?agent_id=${id}`;
  const rateURL = baseUrl + `/api/commissions/update_rate.php?agent_id=${id}`;


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
    const response = await axios.post(commissionURL, data);
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
    const response = await axios.post(passwordURL, data);
    if (response.data.status === "Success") {
      Swal.fire({
        title: "Password Successfully Updated",
        icon: "success",
        confirmButtonText: "OK",
      });
      getAgentCommissionPlans();
    } else {
      Swal.fire({
        title: "Error updating password",
        text: response.data.message,
        icon: "error",
        confirmButtonText: "OK",
      });
      console.log(response);
    }
    getAgent();
  };

  // SUBMIT AGENT RATE TO THE BACKEND
  const handleRateSubmit = async (data) => {
    console.log(data);
    setRateModalOpen(false);
    const response = await axios.post(rateURL, data);
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
    return <Loading />
  }
  return (
    <>
      <div className="rounded overflow-hidden shadow-lg flex bg-white">
        <div className="flex items-center justify-center">
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">Agent Details</div>{" "}
            <p className="text-gray-700 text-base">
              {" "}
              <span className="font-bold"> Name:</span> {agent?.name}{" "}
            </p>{" "}
            <p className="text-gray-700 text-base">
              {" "}
              <span className="font-bold">Email:</span> {agent?.email}.{" "}
            </p>{" "}
            <p className="text-gray-700 text-base">
              {" "}
              <span className="font-bold">Tel:</span> {agent?.phone_no}.{" "}
            </p>{" "}
            <p className="text-gray-700 text-base">
              {" "}
              <span className="font-bold">Country:</span> {agent?.country}.{" "}
            </p>{" "}
            <p className="text-gray-700 text-base">
              {" "}
              <span className="font-bold">Role:</span> {agent?.role}.{" "}
            </p>{" "}
            {/* Only super user can set commission  */}
            {roleId == 0 && (
              <p className="text-gray-700 text-base">
                {" "}
                <button
                  className="border border-gray-800 text-gray-800 dark:border-gray-400 dark:text-gray-400 hover:bg-gray-800 hover:text-white dark:hover:bg-gray-400 dark:hover:text-gray-800 font-bold py-2 px-4 mt-3 rounded transition duration-300"
                  onClick={() => setIsModalOpen(true)}
                >
                  Set Commission
                </button>
              </p>
            )}
            {/* super user can set commission  */}
            {roleId == 0 && (
              <>
                <p className="text-gray-700 text-base">
                  {" "}
                  <button
                    className="border border-gray-800 text-gray-800 dark:border-gray-400 dark:text-gray-400 hover:bg-gray-800 hover:text-white dark:hover:bg-gray-400 dark:hover:text-gray-800 font-bold py-2 px-4 mt-3 rounded transition duration-300"
                    onClick={() => setRateModalOpen(true)}
                  >
                    Set Rate
                  </button>
                </p>{" "}
              </>
            )}
            <p className="text-gray-700 text-base">
              {" "}
              <button
                className="border border-gray-800 text-gray-800 dark:border-gray-400 dark:text-gray-400 hover:bg-gray-800 hover:text-white dark:hover:bg-gray-400 dark:hover:text-gray-800 font-bold py-2 px-4 mt-3 rounded transition duration-300"
                onClick={() => setPassModalOpen(true)}
              >
                Edit password
              </button>
            </p>{" "}
          </div>
          {/* Commission Plans  */}
          <div className="px-6 py-4 items-center justify-center">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Commission Type</th>
                  <th>Commission Amount</th>
                </tr>
              </thead>
              <tbody>
                {agentCommissionPlans &&
                  agentCommissionPlans.map((plan) => (
                    <tr key={plan.name}>
                      <td>{plan.name}</td>
                      <td>{plan.commission_type}</td>
                      <td>{plan.commission_amount}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div>
            <button
              className="border border-gray-800 text-gray-800 dark:border-gray-400 dark:text-gray-400 hover:bg-gray-800 hover:text-white dark:hover:bg-gray-400 dark:hover:text-gray-800 font-bold py-2 px-4 mt-3 rounded transition duration-300"
              onClick={() => setEarnedModalOpen(true)}
            >
              Generate Commission
            </button>
          </div>
        </div>
      </div>
      <div className="rounded overflow-hidden shadow-lg flex bg-white mt-3 w-full">
        <BookingTbl bookings={agentBookings} />
      </div>
      <Newcomm
        agent={agent}
        categoryOptions={categoryOptions}
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCommissionSubmit}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      />

      <Newrate
        agent={agent}
        categoryOptions={categoryOptions}
        show={rateModalOpen}
        onClose={() => setRateModalOpen(false)}
        onSubmit={handleRateSubmit}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      />

      <Editpass
        agent={agent}
        show={passModalOpen}
        onClose={() => setPassModalOpen(false)}
        onSubmit={handlePasswordSubmit}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      />

      <EarnedCommissionsModal
        show={earnedModalOpen}
        onClose={() => setEarnedModalOpen(false)}
        agentId={id}
      />
    </>
  );
}
