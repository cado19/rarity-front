import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import WorkOrderForm from "./form";
import { save_work_order } from "../../api/post";
import { normalizeNumber } from "../../components/utility/number";

export default function WorkOrderCreatePage() {
  const navigate = useNavigate();

  const handleSubmit = async (e, inputs, items) => {
    e.preventDefault();
    try {
      const normalizedItems = items.map((it) => ({
        ...it, 
        cost: normalizeNumber(it.cost),
        quantity: normalizeNumber(it.quantity),
        item: it.item?.trim() || "",
      }));

      const payload = { ...inputs, items: normalizedItems };
      const res = await save_work_order(payload);

      if (res.data.status === "Success") {
        Swal.fire({
          title: "Work Order Created",
          text: res.data.message || "The work order was created successfully.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          // redirect after user closes the popup
          navigate("/workorders");
        });
      } else {
        Swal.fire({
          title: "Error Creating Work Order",
          text: res.data.message || "Something went wrong.",
          icon: "error",
          confirmButtonText: "Close",
        });
        console.error("Error creating work order: " + res.data.message);
      }
    } catch (error) {
      console.error("Error creating work order:", error);
      Swal.fire({
        title: "Network Error",
        text: "Something went wrong while creating the work order.",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };

  return (
    <div className="bg-white px-4 pb-4 pt-4 rounded border-gray-200 flex-1 shadow-md mt-2 mx-3">
      <WorkOrderForm handleSubmit={handleSubmit} />
    </div>
  );
}
