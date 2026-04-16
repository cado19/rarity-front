import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWorkOrder } from "../../api/fetch";
import StyledButton from "../../components/styled/StyledButton";
import axios from "axios";

export default function WorkOrderShowPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const res = await fetchWorkOrder(id);
        if (res.data.status === "Success") {
          setOrder(res.data.work_order);
          setItems(res.data.items || []);
        }
      } catch (error) {
        console.error("Error fetching work order:", error);
      }
    };
    loadOrder();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this work order?")) return;
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/workorders/delete.php`,
        { work_order_id: id }
      );
      if (res.data.status === "Success") {
        navigate("/workorders");
      } else {
        alert("Error deleting: " + res.data.message);
      }
    } catch (error) {
      console.error("Error deleting work order:", error);
    }
  };

  if (!order) return <p>Loading...</p>;

  return (
    <div className="bg-white rounded shadow-md p-6 border border-gray-200 max-w-3xl mx-auto mt-6">
      <h1 className="text-2xl font-bold mb-4">
        Work Order {order.work_order_number}
      </h1>

      <div className="space-y-2 text-gray-700">
        <p><strong>Vehicle:</strong> {order.make} {order.model} ({order.number_plate})</p>
        <p><strong>Title:</strong> {order.title}</p>
        <p><strong>Description:</strong> {order.description}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Scheduled Date:</strong> {order.scheduled_date}</p>
        {order.completion_date && (
          <p><strong>Completed:</strong> {order.completion_date}</p>
        )}
        <p><strong>Labor Cost:</strong> {order.labor_cost}</p>
        <p><strong>Parts Cost:</strong> {order.parts_cost}</p>
        <p><strong>Total Cost:</strong> {order.total_cost}</p>
      </div>

      <h3 className="text-lg font-semibold mt-6 mb-2">Items</h3>
      {items.length > 0 ? (
        <table className="w-full border border-gray-300 rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">Item</th>
              <th className="px-3 py-2 text-left">Cost</th>
              <th className="px-3 py-2 text-left">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-3 py-2">{item.item}</td>
                <td className="px-3 py-2">{item.cost}</td>
                <td className="px-3 py-2">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No items added.</p>
      )}

      <div className="mt-6 flex gap-4">
        <StyledButton to={`/workorders/${id}/edit`} label="Edit" variant="amber" />
        <button
          onClick={handleDelete}
          className="px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-700 hover:text-white transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}