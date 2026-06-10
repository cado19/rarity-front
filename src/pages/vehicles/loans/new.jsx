import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2';
import { createLoan } from '../../../api/post';
import LoanForm from '../../../components/forms/LoanForm';

export default function NewLoan() {
  const navigate = useNavigate();
  const { vehicle_id } = useParams();

  const handleSubmit = async (data) => {
    try {
      const payload = { ...data, vehicle_id };
      const res = await createLoan(payload);

      if (res.status === "Success") {
        Swal.fire({
          title: "Loan Created",
          text: "The loan was created successfully.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate(`/vehicle/${vehicle_id}/loans`);
        });
      } else {
        Swal.fire({
          title: "Error Creating Loan",
          text: res.message || "Something went wrong.",
          icon: "error",
          confirmButtonText: "Close",
        });
      }
    } catch (error) {
      console.error("Error creating loan:", error);
      Swal.fire({
        title: "Network Error",
        text: "Something went wrong while creating the loan.",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">New Loan</h1>
      <LoanForm onSubmit={handleSubmit} mode='create' />
    </div>
  )
}
