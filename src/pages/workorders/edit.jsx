import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import WorkOrderForm from "./form";
import { fetchWorkOrder } from "../../api/fetch";
import { update_work_order } from "../../api/post";
import Loading from "../../components/PageContent/Loading";
import { normalizeNumber } from "../../components/utility/number";

export default function WorkOrderEdit() {
  const navigate = useNavigate();
  const { id } = useParams(); // work_order_id from route
  const [existingOrder, setExistingOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetchWorkOrder(id);
        // console.log("Response: ", res);

        if (res.data.status === "Success") {
          // Combine work_order + items into one object for the form
          setExistingOrder({
            ...res.data.work_order,
            items: res.data.items || [],
          });
        }
      } catch (error) {
        console.error("Error fetching work order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleSubmit = async (e, inputs, items) => {
    e.preventDefault();
    try {
      const payload = { work_order_id: id, ...inputs, items };
      console.log("Payload: ", payload);
      const res = await update_work_order(payload);

      if (res.data.status === "Success") {
        Swal.fire({
          title: "Work Order Updated",
          text: res.data.message || "The work order was updated successfully.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          // redirect after user closes the popup
          navigate("/workorders");
        });
      } else {
        Swal.fire({
          title: "Error Updating Work Order",
          text: res.data.message || "Something went wrong.",
          icon: "error",
          confirmButtonText: "Close",
        });
        console.error("Error updating work order:", res.data.message);
      }
    } catch (error) {
      console.error("Error updating work order:", error);
      Swal.fire({
        title: "Network Error",
        text: "Something went wrong while updating the work order.",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };

  if (loading) return <Loading />;
  if (!existingOrder) return <p>Work order not found.</p>;

  return (
    <div>
      <h1>Edit Work Order {existingOrder.work_order_number}</h1>
      <WorkOrderForm
        existingOrder={existingOrder}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
