import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaFilePdf } from "react-icons/fa";
import { fetchInvoice } from "../../api/fetch";
import Loading from "../../components/PageContent/Loading";
import AddPaymentForm from "../../components/forms/AddPaymentForm";
import { formatDateTime } from "../../components/utility/useDateFormatter";

export default function Invoice() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false); // this is used to control the payment of an invoice modal

  const getInvoice = async () => {
    try {
      const res = await fetchInvoice(id);
      console.log(res);
      setInvoice(res.data.invoice);
    } catch (error) {
      console.error("Error fetching invoice:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInvoice();
  }, [id]);

  if (loading) return <Loading />;
  return (
    <div className="max-w-5xl mx-auto p-8 bg-gray-50">
      <AddPaymentForm
        invoiceId={invoice.invoice_id}
        show={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onRecorded={(updatedInvoice) => setInvoice(updatedInvoice)}
      />
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Invoice #{invoice.invoice_number}
        </h1>
        <div className="flex items-center space-x-3">
          <a
            href={`https://backend.raritycars.com/api/invoices/download.php?id=${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition duration-200 shadow-sm"
          >
            <FaFilePdf className="mr-2" />
            Download 
          </a>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              invoice.status === "paid"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {invoice.status}
          </span>
        </div>
      </div>

      {/* Invoice Info */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="space-y-2">
          <p>
            <span className="font-semibold">Subject:</span> {invoice.subject}
          </p>
          <p>
            <span className="font-semibold">Due Date:</span> {invoice.due_date}
          </p>
          <p>
            <span className="font-semibold">Terms:</span> {invoice.terms}
          </p>
          <p>
            <span className="font-semibold">Billed To:</span>{" "}
            {invoice.billed_to}
          </p>
        </div>
        <div className="space-y-2">
          <p>
            <span className="font-semibold">Booking No:</span>{" "}
            {invoice.booking_no}
          </p>
          <p>
            <span className="font-semibold">Customer:</span>{" "}
            {invoice.customer_first_name} {invoice.customer_last_name} (
            {invoice.customer_email})
          </p>
          <p>
            <span className="font-semibold">Vehicle:</span> {invoice.make}{" "}
            {invoice.model} ({invoice.number_plate})
          </p>
          <p>
            <span className="font-semibold">Duration:</span>{" "}
            {invoice.duration_days} days
          </p>
          <p>
            <span className="font-semibold">Daily Rate:</span>{" "}
            {Number(invoice.daily_rate).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Totals */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Totals</h2>
        <div className="space-y-2">
          <p>
            <span className="font-semibold">Grand Total:</span>{" "}
            {Number(
              invoice.duration_days * invoice.daily_rate,
            ).toLocaleString()}
          </p>
          <p>
            <span className="font-semibold">Total Paid:</span>{" "}
            {invoice.total_paid}
          </p>
          <p>
            <span className="font-semibold">Balance:</span>{" "}
            {Number(invoice.balance).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-lg shadow p-6">
        {/* Record Payment */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Payment History</h2>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200 shadow-sm"
            onClick={() => setPaymentModalOpen(true)}
          >
            + Record Payment
          </button>
        </div>
        {invoice.payments && invoice.payments.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Amount</th>
                <th className="border px-4 py-2">Mode</th>
                <th className="border px-4 py-2">Code</th>
                <th className="border px-4 py-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {invoice.payments.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{formatDateTime(p.payment_time)}</td>
                  <td className="border px-4 py-2">
                    {Number(p.amount).toLocaleString()}
                  </td>
                  <td className="border px-4 py-2">{p.payment_mode}</td>
                  <td className="border px-4 py-2">{p.payment_code}</td>
                  <td className="border px-4 py-2">{p.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">No payments recorded yet.</p>
        )}
      </div>
    </div>
  );
}
