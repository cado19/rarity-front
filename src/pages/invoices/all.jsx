import React, { useEffect, useState } from "react";
import { fetchInvoices, fetchPaidInvoices, fetchUnpaidInvoices, fetchCancelledInvoices } from "../../api/fetch";
import Loading from "../../components/PageContent/Loading";
import BasicTable from "../../components/utility/basicTable";
import { invoiceColumns } from "../../components/utility/tableColumns";

export default function AllInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [activeTab, setActiveTab] = useState("unpaid");
  const [columnFilters, setColumnFilters] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      let data;
      if (activeTab === "paid") {
        data = await fetchPaidInvoices();
      } else if (activeTab === "unpaid") {
        data = await fetchUnpaidInvoices();
        console.log(data);
      } else {
        data = await fetchCancelledInvoices();
      }
      setInvoices(data);
    } catch (err) {
      console.error("Error fetching invoices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, [activeTab]);
  

  if (loading) return <Loading />;

  return (
    <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md mt-2 mx-3">
      <h1 className="text-3xl font-bold text-end text-yellow-600 tracking-wide mb-4 mt-2">
        Invoices
      </h1>

       {/* Tabs */}
      <div className="flex space-x-4 border-b mb-6">
        {["unpaid", "paid", "cancelled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-semibold capitalize ${
              activeTab === tab
                ? "border-b-2 border-green-600 text-green-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <h1>{tab}</h1>
          </button>
        ))}
      </div>

      <BasicTable
        data={invoices}
        columns={invoiceColumns}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
    </div>
  );
}
