import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Mosaic } from "react-loading-indicators";
import { deleteCustomer } from "../../api/delete";

export default function DeleteCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const handleDelete = async () => {
    const response = await deleteCustomer(id);
    if ((response.data.status == "Success")) {
      navigate(`/customers`, { state: { message: "Customer deleted" } });
    } else {
      navigate(`/customer/${id}`, {
        state: { message: "Customer could not be deleted" },
      });
    }
  };

  useEffect(() => {
    handleDelete();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full flex items-center justify-center h-full">
      <Mosaic
        color="#32cd32"
        size="large"
        text="Deleting Customer..."
        textColor=""
      />
    </div>
  );
}
