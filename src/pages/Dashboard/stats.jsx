import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../../api/fetch";

export default function StatsDashboard() {
  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData.id;

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats(userId);
        console.log(response);
        setStats(response); // since fetch.jsx returns response.data already
      } catch (err) {
        setError("Error fetching stats: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <p>Loading stats...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="bg-white p-6 rounded shadow-md h-screen overflow-y-auto">
      <h2 className="text-3xl font-bold text-end text-yellow-600 tracking-wide mb-4 mt-2">Dashboard </h2>
      <div className="flex space-x-4">
        <div>Active Bookings: {stats.active_bookings}</div>
        <div>Upcoming Bookings: {stats.upcoming_bookings}</div>
        <div>Total Revenue: Ksh. {Number(stats.revenue_total).toLocaleString()}</div>
      </div>

      {/* Recent Bookings Section */}
      <h3 className="text-lg font-semibold mb-2">Recent Bookings</h3>
      <ul className="space-y-2">
        {stats.recent_bookings && stats.recent_bookings.length > 0 ? (
          stats.recent_bookings.map((b) => (
            <li
              key={b.id}
              className="border rounded p-2 hover:bg-gray-50 cursor-pointer"
              onClick={() => navigate(`/booking/${b.id}`)}
            >
              <div className="font-medium">
                {b.booking_no} — {b.first_name} {b.last_name}
              </div>
              <div className="text-sm text-gray-600">Start: {b.start_date}</div>
            </li>
          ))
        ) : (
          <li>No recent bookings found.</li>
        )}
      </ul>

      {/* Top Customers */}
      <h3 className="text-lg font-semibold mb-2">Top Customers</h3>
      <ul className="space-y-1 mb-6">
        {stats.top_customers?.map((c) => (
          <li key={c.id}>
            {c.first_name} {c.last_name} — {c.booking_count} bookings
          </li>
        ))}
      </ul>

      {/* Top Vehicles */}
      <h3 className="text-lg font-semibold mb-2">Top Vehicles</h3>
      <ul className="space-y-1 mb-6">
        {stats.top_vehicles?.map((v) => (
          <li key={v.id}>
            {v.make} {v.model} ({v.number_plate}) — {v.booking_count} bookings
          </li>
        ))}
      </ul>

      {/* Revenue by Customer */}
      <h3 className="text-lg font-semibold mb-2">Revenue by Customer</h3>
      <ul className="space-y-1 mb-6">
        {stats.revenue_by_customer?.map((c) => (
          <li key={c.id}>
            {c.first_name} {c.last_name} — Ksh. {Number(c.total_spent).toLocaleString()}
          </li>
        ))}
      </ul>

      {/* Revenue by Vehicle */}
      <h3 className="text-lg font-semibold mb-2">Revenue by Vehicle</h3>
      <ul className="space-y-1 mb-6">
        {stats.revenue_by_vehicle?.map((v) => (
          <li key={v.id}>
            {v.make} {v.model} — Ksh. {Number(v.total_revenue).toLocaleString()}
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <button
          onClick={() => navigate("/calen")}
          className="text-blue-600 underline"
        >
          View Calendar →
        </button>
      </div>
    </div>
  );
}
