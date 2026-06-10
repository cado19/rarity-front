import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../../components/PageContent/Loading";
import {
  fetchLoanByVehicleId,
  fetchRepaymentsByLoan,
} from "../../../api/fetch";
import StyledButton from "../../../components/styled/StyledButton";

export default function LoanDetails() {
  const { vehicle_id } = useParams();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [repayments, setRepayments] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // First fetch loan by vehicle_id
        const loanRes = await fetchLoanByVehicleId(vehicle_id);
        console.log("Loan Response: ", loanRes);
        setLoan(loanRes.data);

        if (loanRes.data?.id) {
          const repaymentRes = await fetchRepaymentsByLoan(loanRes.data.id);
          setRepayments(repaymentRes.data || []);
        }
      } catch (err) {
        console.error("Error loading loan details:", err.message);
      } finally {
        setLoading(false); // ✅ always set loading false
      }
    };
    loadData();
  }, [vehicle_id]);

  if (loading) return <Loading />;

  const outstandingBalance = loan
    ? loan.principal -
      repayments.reduce((sum, r) => sum + parseFloat(r.amount), 0)
    : 0;

  return (
    <div className="p-6">
      {loan ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Loan Details</h1>
          <div className="mb-6 space-y-1">
            <p>
              <strong>Vehicle ID:</strong> {vehicle_id}
            </p>
            <p>
              <strong>Principal:</strong> KES {loan.principal}
            </p>
            <p>
              <strong>Interest Rate:</strong> {loan.interest_rate}%
            </p>
            <p>
              <strong>Start Date:</strong> {loan.start_date}
            </p>
            <p>
              <strong>End Date:</strong> {loan.end_date}
            </p>
            <p>
              <strong>Repayment Method:</strong> {loan.repayment_method}
            </p>
            <p>
              <strong>Outstanding Balance:</strong> KES {outstandingBalance}
            </p>
          </div>

          {/* Add Payment Button */}
          <div className="mb-4">
            <StyledButton
              to={`/vehicle/${vehicle_id}/loans/${loan.id}/repayments/new`}
              label="+ Add Payment"
              variant="green"
              rounded
            /> 
          </div>

          <h2 className="text-xl font-semibold mb-2">Repayment History</h2>
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-3 py-2">Date</th>
                <th className="border px-3 py-2">Amount</th>
                <th className="border px-3 py-2">Source</th>
                <th className="border px-3 py-2">Booking Ref</th>
              </tr>
            </thead>
            <tbody>
              {repayments.length > 0 ? (
                repayments.map((r) => (
                  <tr key={r.id}>
                    <td className="border px-3 py-2">{r.paid_at}</td>
                    <td className="border px-3 py-2">KES {r.amount}</td>
                    <td className="border px-3 py-2">{r.source}</td>
                    <td className="border px-3 py-2">{r.booking_id || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No repayments recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      ) : (
        <p>No loan found for this vehicle.</p>
      )}
    </div>
  );
}
