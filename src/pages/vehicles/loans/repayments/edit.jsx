import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import RepaymentForm from "../../../../components/forms/RepaymentForm";
import { fetchRepaymentById } from "../../../../api/fetch";
import { updateRepayment } from "../../../../api/put";
import Loading from "../../../../components/PageContent/Loading";

export default function EditRepayment() {
  const navigate = useNavigate();
  const { vehicle_id, loan_id, repayment_id } = useParams();
  const [repayment, setRepayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRepayment = async () => {
      try {
        const res = await fetchRepaymentById(repayment_id);
        setRepayment(res.data);
      } catch (err) {
        console.error("Error fetching repayment:", err.message);
      } finally {
        setLoading(false);
      }
    };
    loadRepayment();
  }, [repayment_id]);

  const handleSubmit = async (data) => {
    try {
      const payload = { ...data, id: repayment_id, loan_id };
      const res = await updateRepayment(payload);

      if (res.status === "Success") {
        Swal.fire({
          title: "Repayment Updated",
          text: "Repayment updated successfully.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate(`/vehicle/${vehicle_id}/loan`);
        });
      } else {
        Swal.fire({
          title: "Error",
          text: res.message || "Something went wrong.",
          icon: "error",
          confirmButtonText: "Close",
        });
      }
    } catch (error) {
      console.error("Error updating repayment:", error);
      Swal.fire({
        title: "Network Error",
        text: "Something went wrong while updating the repayment.",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Repayment</h1>
      {repayment ? (
        <RepaymentForm
          onSubmit={handleSubmit}
          initialData={{
            amount: repayment.amount,
            source: repayment.source,
            booking_no: repayment.booking_id ? `B-${repayment.booking_id}` : "",
            paid_at: repayment.paid_at,
          }}
          mode="edit"
        />
      ) : (
        <p>Repayment not found.</p>
      )}
    </div>
  );
}
