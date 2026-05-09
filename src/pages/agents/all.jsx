// THIS COMPONENT SHOWS RECENTLY ADDED CUSTOMERS
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { baseURL } from "../../constants/url";
import Loading from "../../components/PageContent/Loading";
import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import { esES } from "@mui/x-date-pickers/locales";
import DriverNav from "../../components/navs/drivernav";
import AgentNav from "../../components/navs/agentnav";
import { Mosaic } from "react-loading-indicators";
import { fetchAgents } from "../../api/fetch";
import BasicTable from "../../components/utility/basicTable";
import { agentColumns } from "../../components/utility/tableColumns";

export default function AllAgents() {
  const navigate = useNavigate();

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Phone Number",
      selector: (row) => row.phone_no,
      sortable: true,
    },
    {
      name: "Country",
      selector: (row) => row.country,
      sortable: true,
    },
    {
      name: "Options",
      cell: (row) => <Link to={`/agent/${row.id}`}>Details</Link>,
    },
  ];

  const agentData = [];

  const addAgentData = (agent) => {
    agentData.push({
      id: agent.id,
      name: agent.name,
      email: agent.email,
      phone_no: agent.phone_no,
      country: agent.country,
    });
  };

  const [agents, setAgents] = useState(agentData);
  const [columnFilters, setColumnFilters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = import.meta.env.VITE_BASE_URL;

  const agentURL = baseUrl + "/api/agents/all.php";

  const getAgents = async () => {
    try {
      const res = await fetchAgents();
      console.log(res);
      if (res.data.length === 0) {
        setError("No agents found");
      } else {
        res.data.forEach((agent) => addAgentData(agent));
        setAgents(res.data);
        // console.log(agentData);
        setLoading(false);
      }
    } catch (error) {
      const errorMessage = "Error: " + error.message;
      setError(errorMessage);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user.role_id;
    const loggedIn = localStorage.getItem("loggedIn");
    if (!loggedIn) {
      navigate("/login");
    }
    if (role == "2") {
      navigate("/", {
        state: { message: "You are not authorized to view this page." },
      });
    }
    getAgents();
  }, [agents, navigate, loading]);

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
    <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md mt-2 mx-3">
      <AgentNav />
      {/* <h1 className="text-bold text-center">Vehicles </h1> */}
      <BasicTable
        data={agents}
        columns={agentColumns}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
    </div>
  );
}
