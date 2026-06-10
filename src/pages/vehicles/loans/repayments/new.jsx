import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import RepaymentForm from "../../../../components/forms/RepaymentForm"; // we'll scaffold this next
import { createRepayment } from "../../../../api/post";

export default function NewRepayment() {
  const navigate = useNavigate();
  const { vehicle_id, loan_id } = useParams();

  const handleSubmit = async (data) => {
    try {
      const payload = { ...data, loan_id };
      const res = await createRepayment(payload);

      if (res.status === "Success") {
        Swal.fire({
          title: "Payment Added",
          text: "Repayment logged successfully.",
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
      console.error("Error creating repayment:", error);
      Swal.fire({
        title: "Network Error",
        text: "Something went wrong while creating the repayment.",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">New Repayment</h1>
      <RepaymentForm onSubmit={handleSubmit} mode="create" />
    </div>
  );
}
