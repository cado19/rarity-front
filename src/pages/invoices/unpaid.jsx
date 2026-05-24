import React, { useEffect, useState } from "react";
import { fetchInvoices } from "../../api/fetch";
import Loading from "../../components/PageContent/Loading";
import BasicTable from "../../components/utility/basicTable";
import { invoiceColumns } from "../../components/utility/tableColumns";

export default function UnpaidInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [loading, setLoading] = useState(true);

  const getInvoices = async () => {
    try {
      const res = await fetchInvoices();
      setInvoices(res.data.invoices);
      console.log(res);
    } catch (error) {
      console.error("Error fetching invoices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInvoices();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md mt-2 mx-3">
      <h1 className="text-3xl font-bold text-end text-yellow-600 tracking-wide mb-4 mt-2">
        All Invoices
      </h1>

      <BasicTable
        data={invoices}
        columns={invoiceColumns}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
    </div>
  );
}
