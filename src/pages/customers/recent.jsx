// THIS COMPONENT SHOWS RECENTLY ADDED CUSTOMERS
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { baseURL } from "../../constants/url";
import Loading from "../../components/PageContent/Loading";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import ClientNav from "../../components/navs/clientnav";

export default function RecentCustomers() {
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
      cell: (row) => <Link to={`/customer/${row.id}`}>Details</Link>,
    },
  ];
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = import.meta.env.VITE_BASE_URL;

  const customerURL = baseUrl + "/api/customers/recent.php";

  const getCustomers = async () => {
    try {
      await axios.get(customerURL).then((response) => {
        console.log(response);
        setCustomers(response.data.data);
        setLoading(false);
      });
    } catch (error) {
      const errorMessage = "Error: " + error.message;
      setError(errorMessage);
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);

  if (loading) {
    return (
      <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md">
        <Loading />
      </div>
    );
  }

  return (
    <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md mt-2 mx-3">
      <ClientNav />
      {/* <h1 className="text-bold text-center">Vehicles </h1> */}
      <DataTable columns={columns} data={customers} title="Recent Clients" />
    </div>
  );
}
