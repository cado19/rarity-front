import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { formatDate } from "date-fns";
import { fetchVehicleWorkOrder } from "../../api/fetch";
import Loading from "../../components/PageContent/Loading";

export default function VehicleWorkOrders() {
  const { id } = useParams(); // vehicle_id
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWorkOrders = async () => {
      const response = await fetchVehicleWorkOrder(id, 5);
      setWorkOrders(response.data.data);
      setLoading(false);
    };
    loadWorkOrders();
  }, [id]);

  if (loading) return <Loading />;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Work Orders for Vehicle #{id}</h2>
      <ul className="space-y-2">
        {workOrders.map((wo) => (
          <li key={wo.id} className="border-b pb-2">
            <Link
              to={`/workorders/${wo.id}`}
              className="font-semibold text-blue-600 hover:underline"
            >
              <strong>{wo.work_order_number}  {wo.title}</strong> — {wo.status}
              <div className="text-sm text-gray-600">
                Scheduled:{" "}
                {formatDate(new Date(wo.scheduled_date), "do MMMM yyyy")} 
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
