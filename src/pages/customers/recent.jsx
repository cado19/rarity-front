// THIS COMPONENT SHOWS RECENTLY ADDED CUSTOMERS
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ClientNav from "../../components/navs/clientnav";
import { fetchRecentCustomers } from "../../api/fetch";
import Loading from "../../components/PageContent/Loading";
import BasicTable from "../../components/utility/basicTable";
import { clientColumns } from "../../components/utility/tableColumns";

export default function RecentCustomers() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const roles = user?.roles?.map((r) => r.name) || []; // roles array from localStorage


  const [customers, setCustomers] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  // get customers
  const getCustomers = async () => {
    try {
      const response = await fetchRecentCustomers();
      let customerData = response.data.data.map((customer) => ({
        id: customer.id,
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email,
        id_no: customer.id_no,
        phone_no: customer.phone_no,
        account_id: customer.account_id, // make sure backend returns this
      }));

      // 🔑 Filter if salesperson
      if (roles.includes("salesperson")) {
        customerData = customerData.filter((c) => c.account_id === userId);
      }

      setCustomers(customerData);
    } catch (error) {
      setError("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md mt-2 mx-3">
      <ClientNav />
      <h1 className="text-3xl font-bold text-end text-yellow-600 tracking-wide mb-4 mt-2">
        Recent Clients
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
