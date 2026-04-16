import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import WorkOrderDetail from "./WorkOrderDetail";
import { fetchWorkOrders } from "../../api/fetch";
import StyledButton from "../../components/styled/StyledButton"; // adjust path if needed

export default function WorkflowDashboard() {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetchWorkOrders();
        setOrders(res.data.work_orders || []);
      } catch (error) {
        console.error("Error fetching work orders:", error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="flex gap-6">
      {/* Left side: list of work orders in a card */}
      <div className="w-1/2 bg-white rounded shadow-md p-4 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Work Orders</h2>
          <StyledButton
            to="/workorders/create"
            label="＋ New"
            variant="emerald"
          />
        </div>

        <table className="w-full border">
          <thead>
            <tr>
              <th>Number</th>
              <th>Vehicle</th>
              <th>Title</th>
              <th>Status</th>
              <th>Total Cost</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className={`cursor-pointer ${selectedOrderId === order.id ? "bg-gray-200" : ""}`}
                onClick={() => setSelectedOrderId(order.id)}
              >
                <td>{order.work_order_number}</td>
                <td>
                  {order.make} {order.model} ({order.number_plate})
                </td>
                <td>{order.title}</td>
                <td>{order.status}</td>
                <td>{order.total_cost}</td>
                <td>
                  {/* More details link */}
                  <Link
                    to={`/workorders/${order.id}`}
                    className="px-3 py-1 border border-blue-600 text-blue-600 rounded hover:bg-blue-700 hover:text-white transition"
                  >
                    More
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Right side: detail sidebar */}
      <div className="w-1/2">
        {selectedOrderId ? (
          <div className="bg-white rounded shadow-md p-4 relative border border-gray-200">
            {/* Close button */}
            <button
              onClick={() => setSelectedOrderId(null)}
              className="absolute top-4 right-4 px-3 py-1 border border-red-600 text-red-600 rounded hover:bg-red-700 hover:text-white transition"
            >
              Close
            </button>

            <WorkOrderDetail workOrderId={selectedOrderId} />
          </div>
        ) : (
          <p className="text-gray-500">Select a work order to view details</p>
        )}
      </div>
    </div>
  );
}
