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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = import.meta.env.VITE_BASE_URL;

  const agentURL = baseUrl + "/api/agents/all.php";

  const handleSearch = (e) => {
    let searchValue;
    let nameValue;
    let emailValue;
    let countryValue;
    let phoneNoValue;
    // let eyeColorValue;

    const newRows = agentData.filter((row) => {
      nameValue = row.name
        .toString()
        .toLowerCase()
        .includes(e.target.value.toLowerCase());

      emailValue = row.email
        .toLowerCase()
        .includes(e.target.value.toLowerCase());

      countryValue = row.country
        .toLowerCase()
        .includes(e.target.value.toLowerCase());

      phoneNoValue = row.phone_no
        .toLowerCase()
        .includes(e.target.value.toLowerCase());

      if (nameValue) {
        searchValue = nameValue;
      } else if (emailValue) {
        searchValue = emailValue;
      } else if (countryValue) {
        searchValue = countryValue;
      } else {
        searchValue = phoneNoValue;
      }

      return searchValue;
    });

    setAgents(newRows);

    // let query = e.target.value;
    // const newRecords = agentData.filter((item) =>
    //   item.first_name.toLocaleLowerCase().includes(query.toLocaleLowerCase())
    // );
    // setAgents(newRecords);
  };

  const getAgents = async () => {
    try {
      await axios.get(agentURL).then((response) => {
        console.log(response);
        if (response.data.data.length === 0) {
          setError("No agents found");
        } else {
          response.data.data.forEach((agent) => addAgentData(agent));
          // setAgents(response.data.data);
          console.log(agentData);
          setLoading(false);
        }
      });
    } catch (error) {
      const errorMessage = "Error: " + error.message;
      setError(errorMessage);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    const role = user.role_id;
    const loggedIn = localStorage.getItem("loggedIn");
    if (!loggedIn) {
      navigate("/login");
    }
    if(role != "0" || role != "1"){
      navigate("/", {state: {message: "You are not authorized to view this page."}});
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
    return (
      <div className="bg-white p-4 rounded-lg shadow-md w-full flex items-center justify-center h-full">
        <Mosaic color="#32cd32" size="large" text="Loading..." textColor="" />
      </div>
    );
  }

  return (
    <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md mt-2 mx-3">
      <div className="flex justify-end">
        {/* <input
        type="text"
        placeholder="Search"
        className="appearance-none bg-transparent border-none text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
        onChange={handleSearch}
      />
      <label
        for="default-search"
        class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >
        Search
      </label> */}
        <div class="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search Agents..."
            onChange={handleSearch}
          />
        </div>
      </div>
      <AgentNav />
      {/* <h1 className="text-bold text-center">Vehicles </h1> */}
      <DataTable
        columns={columns}
        data={agents}
        pagination
        title="Agents"
        highlightOnHover
        progressPending={loading}
        persistTableHead
      />
    </div>
  );
}
