import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaCalendarAlt,
  FaCoins,
  FaCar,
  FaUsers,
  FaCarSide,
} from "react-icons/fa";

import { getDashboardStats } from "../../api/fetch";
import Loading from "../../components/PageContent/Loading";
import StyledButton from "../../components/styled/StyledButton";

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
    return <Loading />;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Header */}
      <h2 className="text-3xl font-bold text-end text-yellow-600 tracking-wide mb-6">
        Dashboard
      </h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-green-50 p-4 rounded shadow flex items-center">
          <FaCheckCircle className="text-green-600 text-2xl mr-3" />
          <div>
            <h3 className="text-sm text-gray-500">Active Bookings</h3>
            <p className="text-xl font-semibold">{stats.active_bookings}</p>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded shadow flex items-center">
          <FaCalendarAlt className="text-yellow-600 text-2xl mr-3" />
          <div>
            <h3 className="text-sm text-gray-500">Upcoming Bookings</h3>
            <p className="text-xl font-semibold">{stats.upcoming_bookings}</p>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded shadow flex items-center">
          <FaCoins className="text-blue-600 text-2xl mr-3" />
          <div>
            <h3 className="text-sm text-gray-500">Total Revenue</h3>
            <p className="text-xl font-semibold">
              Ksh. {Number(stats.revenue_total).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Recent Bookings */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold border-b pb-2 mb-3 flex items-center">
            <FaUsers className="text-gray-600 mr-2" /> Top Customers
          </h3>
          <ul className="space-y-1">
            {stats.top_customers?.map((c) => (
              <li key={c.id}>
                {c.first_name} {c.last_name} — {c.booking_count} bookings
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold border-b pb-2 mb-3 flex items-center">
            <FaCar className="text-gray-600 mr-2" /> Top Vehicles
          </h3>
          <ul className="space-y-1">
            {stats.top_vehicles?.map((v) => (
              <li key={v.id}>
                {v.make} {v.model} ({v.number_plate}) — {v.booking_count}{" "}
                bookings
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Revenue */}
        <div className="bg-white p-4 rounded shadow">
          {/* Revenue by Customer */}
          <h3 className="text-lg font-semibold mb-2 flex items-center border-b pb-2">
            <FaUsers className="text-yellow-600 mr-2" />
            Revenue by Customer
          </h3>
          <ul className="space-y-2 mb-4">
            {stats.revenue_by_customer?.map((c) => (
              <li
                key={c.id}
                className="flex justify-between items-center border-b py-1"
              >
                <span className="font-medium">
                  {c.first_name} {c.last_name}
                </span>
                <span className="text-gray-700">
                  Ksh. {Number(c.total_spent).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-4 rounded shadow">
          {/* Revenue by Vehicle */}
          <h3 className="text-lg font-semibold mb-2 flex items-center border-b pb-2">
            <FaCarSide className="text-blue-600 mr-2" />
            Revenue by Vehicle
          </h3>
          <ul className="space-y-2">
            {stats.revenue_by_vehicle?.map((v) => (
              <li
                key={v.id}
                className="flex justify-between items-center border-b py-1"
              >
                <span className="font-medium">
                  {v.make} {v.model}
                </span>
                <span className="text-gray-700">
                  Ksh. {Number(v.total_revenue).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Calendar Link */}
      <div className="mt-6 text-end">
        <StyledButton
          to="/calen"
          label="View Calendar →"
          variant="amber" // or "yellow", "green", etc.
        />
      </div>
    </div>
  );
}
