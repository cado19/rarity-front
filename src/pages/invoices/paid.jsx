import React, { useState, useEffect } from "react";
import { fetchPaidInvoices, fetchUnpaidInvoices, fetchCancelledInvoices } from "../../api/fetch";

export default function PaidInvoices() {
  const [activeTab, setActiveTab] = useState("unpaid");
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    async function loadInvoices() {
      try {
        let data;
        if (activeTab === "paid") {
          data = await fetchPaidInvoices();
        } else if (activeTab === "unpaid") {
          data = await fetchUnpaidInvoices();
        } else {
          data = await fetchCancelledInvoices();
        }
        setInvoices(data);
      } catch (err) {
        console.error("Error fetching invoices:", err);
      }
    }
    loadInvoices();
  }, [activeTab]);

  return (
    <div className="max-w-6xl mx-auto p-6">
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
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow p-6">
        {invoices.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border px-4 py-2">Invoice #</th>
                <th className="border px-4 py-2">Subject</th>
                <th className="border px-4 py-2">Customer</th>
                <th className="border px-4 py-2">Vehicle</th>
                <th className="border px-4 py-2">Due Date</th>
                <th className="border px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.invoice_id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{inv.invoice_number}</td>
                  <td className="border px-4 py-2">{inv.subject}</td>
                  <td className="border px-4 py-2">
                    {inv.customer_first_name} {inv.customer_last_name}
                  </td>
                  <td className="border px-4 py-2">
                    {inv.make} {inv.model} ({inv.number_plate})
                  </td>
                  <td className="border px-4 py-2">{inv.due_date}</td>
                  <td className="border px-4 py-2 capitalize">{inv.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">No {activeTab} invoices found.</p>
        )}
      </div>
    </div>
  );
}
