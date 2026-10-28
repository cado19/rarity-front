import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getVehicleWorkOrderStats } from "../../api/fetch";

export default function MaintenanceCosts() {
  const [stats, setStats] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await getVehicleWorkOrderStats(page, 10);
      setStats(res.data);
      setTotalPages(res.pagination.totalPages);
    };
    fetchStats();
  }, [page]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-3xl font-bold text-end text-yellow-600 tracking-wide mb-4 mt-2">Vehicle Work Order Stats</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Vehicle</th>
            <th className="p-2 border">Total Cost</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {stats.map((v) => (
            <tr key={v.vehicle_id} className="hover:bg-gray-50">
              <td className="p-2 border">
                {v.make} {v.model} ({v.number_plate})
              </td>
              <td className="p-2 border text-right">
                Ksh. {Number(v.total_cost).toLocaleString()}
              </td>
              <td>
                {/* More details link */}
                <Link
                  to={`/vehicle/${v.vehicle_id}/work_orders`}
                  className="px-3 py-1 border border-blue-600 text-blue-600 rounded hover:bg-blue-700 hover:text-white transition"
                >
                  More →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
        >
          Next
        </button>
      </div>
    </div>
  );
}
