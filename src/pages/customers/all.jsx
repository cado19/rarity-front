// THIS COMPONENT SHOWS RECENTLY ADDED CUSTOMERS
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { baseURL } from "../../constants/url";
import { Mosaic } from "react-loading-indicators";
import Loading from "../../components/PageContent/Loading";
import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import ClientNav from "../../components/navs/clientnav";
import { esES } from "@mui/x-date-pickers/locales";
import { fetchCustomers } from "../../api/fetch";
import BasicTable from "../../components/utility/basicTable";
import { clientColumns } from "../../components/utility/tableColumns";

export default function AllCustomers() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // get customers
  const getCustomers = async () => {
    try {
      const response = await fetchCustomers();
      const customerData = response.data.data.map((customer) => ({
        id: customer.id,
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email,
        id_no: customer.id_no,
        phone_no: customer.phone_no,
      }));
      setCustomers(customerData);
    } catch (error) {
      const errorMessage = "Error: " + error.message;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (!loggedIn) {
      navigate("/login");
    }
    getCustomers();
  }, [customers, navigate]);

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
      <ClientNav />

      <h1 className="text-3xl font-bold text-end text-yellow-600 tracking-wide mb-4 mt-2">
        Customers
      </h1>
      <BasicTable
        columns={clientColumns}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        data={customers}
      />
    </div>
  );
}
