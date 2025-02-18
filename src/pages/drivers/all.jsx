// THIS COMPONENT SHOWS ALL AGENTS
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { baseURL } from "../../constants/url";
import Loading from "../../components/PageContent/Loading";
import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import { esES } from "@mui/x-date-pickers/locales";
import DriverNav from "../../components/navs/drivernav";

export default function AllDrivers() {
  const navigate = useNavigate();
  const columns = [
    {
      name: "First Name",
      selector: (row) => row.first_name,
      sortable: true,
    },
    {
      name: "Last Name",
      selector: (row) => row.last_name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "ID Number",
      selector: (row) => row.id_no,
      sortable: true,
    },
    {
      name: "Phone Number",
      selector: (row) => row.phone_no,
      sortable: true,
    },
    {
      name: "Options",
      cell: (row) => <Link to={`/driver/${row.id}`}>Details</Link>,
    },
  ];

  const driverData = [];

  const addDriverData = (driver) => {
    driverData.push({
      id: driver.id,
      first_name: driver.first_name,
      last_name: driver.last_name,
      email: driver.email,
      id_no: driver.id_no,
      phone_no: driver.phone_no,
    });
  };

  const [drivers, setDrivers] = useState(driverData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const driverURL = baseURL + "/api/drivers/all.php";

  const handleSearch = (e) => {
    let searchValue;
    let firstNameValue;
    let lastNameValue;
    let emailValue;
    let idNoValue;
    let phoneNoValue;
    // let eyeColorValue;

    const newRows = driverData.filter((row) => {
      firstNameValue = row.first_name
        .toString()
        .toLowerCase()
        .includes(e.target.value.toLowerCase());

      lastNameValue = row.last_name
        .toLowerCase()
        .includes(e.target.value.toLowerCase());

      emailValue = row.email
        .toLowerCase()
        .includes(e.target.value.toLowerCase());

      idNoValue = row.id_no
        .toLowerCase()
        .includes(e.target.value.toLowerCase());

      phoneNoValue = row.phone_no
        .toLowerCase()
        .includes(e.target.value.toLowerCase());

      if (firstNameValue) {
        searchValue = firstNameValue;
      } else if (lastNameValue) {
        searchValue = lastNameValue;
      } else if (emailValue) {
        searchValue = emailValue;
      } else if (idNoValue) {
        searchValue = idNoValue;
      } else {
        searchValue = phoneNoValue;
      }

      return searchValue;
    });

    setDrivers(newRows);

    // let query = e.target.value;
    // const newRecords = driverData.filter((item) =>
    //   item.first_name.toLocaleLowerCase().includes(query.toLocaleLowerCase()) 
    // );
    // setDrivers(newRecords);
  };

  const getDrivers = async () => {
    try {
      await axios.get(driverURL).then((response) => {
        console.log(response);
        response.data.drivers.forEach((driver) => addDriverData(driver));
        // setDrivers(response.data.data);
        console.log(driverData);
        setLoading(false);
      });
    } catch (error) {
      const errorMessage = "Error: " + error.message;
      setError(errorMessage);
    }
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (!loggedIn){
      navigate("/login");
    }
    getDrivers();
  }, [drivers, navigate]);

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
            placeholder="Search Drivers..."
            onChange={handleSearch}
          />
        </div>
      </div>
      <DriverNav />
      {/* <h1 className="text-bold text-center">Vehicles </h1> */}
      <DataTable
        columns={columns}
        data={drivers}
        pagination
        title="Drivers"
        highlightOnHover
        progressPending={loading}
        persistTableHead
      />
    </div>
  );
}
