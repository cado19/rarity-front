import { useEffect, useState } from "react";
import { fetchWorkOrder } from "../../api/fetch";

export default function WorkOrderDetail({ workOrderId }) {

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetchWorkOrder(workOrderId);

        if (res.data.status === "Success") {
          setOrder(res.data.work_order);
          setItems(res.data.items || []);
        }
      } catch (error) {
        console.error("Error fetching work order:", error);
      }
    };

    fetchOrder();
  }, [workOrderId]);

  if (!order) return <p>Loading work order...</p>;

  return (
    <div>
      <h2 className="font-bold">Work Order {order.work_order_number}</h2>
      <p><strong>Vehicle:</strong> {order.make} {order.model} ({order.number_plate})</p>
      <p><strong>Title:</strong> {order.title}</p>
      {order.mileage && (
        <p><strong>Mileage:</strong> {Number(order.mileage).toLocaleString()}Km</p>
      )}
      <p><strong>Description:</strong> {order.description}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Scheduled Date:</strong> {order.scheduled_date}</p>
      {order.completion_date && <p><strong>Completed:</strong> {order.completion_date}</p>}
      <p><strong>Labor Cost:</strong> {Number(order.labor_cost).toLocaleString()}.00</p>
      <p><strong>Parts Cost:</strong> {Number(order.parts_cost).toLocaleString()}.00</p>
      <p><strong>Total Cost:</strong> {Number(order.total_cost).toLocaleString()}.00</p>

      <h3>Items</h3>
      {items.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Cost</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.item}</td>
                <td>{item.cost}</td>
                <td>{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No items added yet.</p>
      )}
    </div>
  );
}