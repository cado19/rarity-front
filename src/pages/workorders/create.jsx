import WorkOrderForm from "./form";
import { useNavigate } from "react-router-dom";
import { save_work_order } from "../../api/post";

export default function WorkOrderCreatePage() {
  const navigate = useNavigate();

  const handleSubmit = async (e, inputs, items) => {
    e.preventDefault();
    try {
      const payload = { ...inputs, items };
      const res = await save_work_order(payload);

      if (res.data.status === "Success") {
        // redirect to list or show page
        navigate("/workorders");
      } else {
        alert("Error creating work order: " + res.data.message);
      }
    } catch (error) {
      console.error("Error creating work order:", error);
      alert("Something went wrong while creating the work order.");
    }
  };

  return (
    <div className="bg-white px-4 pb-4 pt-4 rounded border-gray-200 flex-1 shadow-md mt-2 mx-3">
      <WorkOrderForm handleSubmit={handleSubmit} />
    </div>
  );
}