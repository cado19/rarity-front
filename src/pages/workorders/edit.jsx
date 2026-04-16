import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import WorkOrderForm from "./form";
import { fetchWorkOrder } from "../../api/fetch";
import { update_work_order } from "../../api/post";

export default function WorkOrderEdit() {
  const navigate = useNavigate();
  const { id } = useParams(); // work_order_id from route
  const [existingOrder, setExistingOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetchWorkOrder(id);
        console.log("Response: ", res);

        if (res.data.status === "Success") {
          // Combine work_order + items into one object for the form
          setExistingOrder({
            ...res.data.work_order,
            items: res.data.items || []
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
        const res = await update_work_order(payload);
  
        if (res.data.status === "Success") {
          // redirect to list or show page
          navigate("/workorders");
        } else {
          alert("Error updating work order: " + res.data.message);
          console.error("Error updating work order:", res.data.message);
        }
      } catch (error) {
        console.error("Error updating work order:", error);
        alert("Something went wrong while updating the work order.");
      }
    };

  if (loading) return <p>Loading work order...</p>;
  if (!existingOrder) return <p>Work order not found.</p>;

  return (
    <div>
      <h1>Edit Work Order {existingOrder.work_order_number}</h1>
      <WorkOrderForm existingOrder={existingOrder} handleSubmit={handleSubmit} />
    </div>
  );
}