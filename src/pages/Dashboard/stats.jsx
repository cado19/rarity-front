// src/pages/Dashboard/stats.jsx

import React, { useEffect, useState } from "react";
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
import FilterBar from "../../components/styled/FilterBar";

export default function StatsDashboard() {
  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData.id;

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();

  // Reset month and year to current month when 'Reset to current month' is clicked
  const handleReset = () => {
    setMonth(null);
    setYear(null);
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats(userId, month, year);
        console.log(response);
        setStats(response); // fetch.jsx returns response.data already
      } catch (err) {
        setError("Error fetching stats: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [month, year]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  const base = stats.dashboard.base;
  const driver = stats.dashboard.driver;
  const sales = stats.dashboard.sales;
  const fleet = stats.dashboard.fleet_manager;

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
            <p className="text-xl font-semibold">{base.active_bookings}</p>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded shadow flex items-center">
          <FaCalendarAlt className="text-yellow-600 text-2xl mr-3" />
          <div>
            <h3 className="text-sm text-gray-500">Upcoming Bookings</h3>
            <p className="text-xl font-semibold">{base.upcoming_bookings}</p>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded shadow flex items-center">
          <FaCoins className="text-blue-600 text-2xl mr-3" />
          <div>
            <h3 className="text-sm text-gray-500">Total Revenue</h3>
            <p className="text-xl font-semibold">
              Ksh. {Number(base.revenue_total).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Top Customers */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold border-b pb-2 mb-3 flex items-center">
            <FaUsers className="text-gray-600 mr-2" /> Top Customers
          </h3>
          <ul className="space-y-1">
            {base.top_customers?.map((c) => (
              <li key={c.id}>
                {c.first_name} {c.last_name} — {c.booking_count} bookings
              </li>
            ))}
          </ul>
        </div>

        {/* Top Vehicles */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold border-b pb-2 mb-3 flex items-center">
            <FaCar className="text-gray-600 mr-2" /> Top Vehicles
          </h3>
          <ul className="space-y-1">
            {base.top_vehicles?.map((v) => (
              <li key={v.id}>
                {v.make} {v.model} ({v.number_plate}) — {v.booking_count}{" "}
                bookings
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Revenue by Customer */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2 flex items-center border-b pb-2">
            <FaUsers className="text-yellow-600 mr-2" />
            Revenue by Customer
          </h3>
          <ul className="space-y-2 mb-4">
            {base.revenue_by_customer?.map((c) => (
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

        {/* Revenue by Vehicle */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2 flex items-center border-b pb-2">
            <FaCarSide className="text-blue-600 mr-2" />
            Revenue by Vehicle
          </h3>
          <ul className="space-y-2">
            {base.revenue_by_vehicle?.map((v) => (
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

      {/* COMPANY STATS  */}
      <h1 className="text-4xl font-extrabold text-gray-800 tracking-wide uppercase border-b-4 border-yellow-500 pb-2 mb-2">
        Company Stats
      </h1>
      {/* Filter UI  */}
      <FilterBar
        month={month}
        year={year}
        setMonth={setMonth}
        setYear={setYear}
        onReset={handleReset}
      />

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Current Month Revenue by Agents */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h3 className="text-lg font-semibold border-b pb-2 mb-3 flex items-center">
            <FaCoins className="text-blue-600 mr-2" /> Current Month Revenue by
            Agents
          </h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-2 border">Agent</th>
                <th className="text-right p-2 border">Realized Revenue</th>
                <th className="text-right p-2 border">Potential Revenue</th>
              </tr>
            </thead>
            <tbody>
              {base.current_month_revenue_by_agents?.map((agent) => (
                <tr key={agent.account_id} className="hover:bg-gray-50">
                  <td className="p-2 border font-medium">
                    {agent.account_name}
                  </td>
                  <td className="p-2 border text-right text-green-700">
                    Ksh. {Number(agent.realized_revenue).toLocaleString()}
                  </td>
                  <td className="p-2 border text-right text-blue-700">
                    Ksh. {Number(agent.potential_revenue).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Booking Counts per Agent */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h3 className="text-lg font-semibold border-b pb-2 mb-3">
            Booking Counts per Agent
          </h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-2 border">Agent</th>
                <th className="text-right p-2 border">Completed</th>
                <th className="text-right p-2 border">Cancelled</th>
                <th className="text-right p-2 border">Active</th>
                <th className="text-right p-2 border">Upcoming</th>
              </tr>
            </thead>
            <tbody>
              {base.current_month_booking_count_by_agents?.map((agent) => (
                <tr key={agent.account_id} className="hover:bg-gray-50">
                  <td className="p-2 border font-medium">
                    {agent.account_name}
                  </td>
                  <td className="p-2 border text-right text-green-700">
                    {agent.completed_count}
                  </td>
                  <td className="p-2 border text-right text-red-700">
                    {agent.cancelled_count}
                  </td>
                  <td className="p-2 border text-right text-blue-700">
                    {agent.active_count}
                  </td>
                  <td className="p-2 border text-right text-yellow-700">
                    {agent.upcoming_count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Booking Completion Rate per Agent */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2 flex items-center border-b pb-2">
            <FaCarSide className="text-blue-600 mr-2" />
            Booking Completion Rate per Agent
          </h3>
          <ul className="space-y-2">
            {base.current_month_completion_rate_by_agents?.map((r) => (
              <li
                key={r.account_id}
                className="flex justify-between items-center border-b py-1"
              >
                <span className="font-medium">{r.account_name}</span>
                <span className="text-gray-700">
                  {Number(r.completion_rate)}%
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Current Month Vehicle Performance */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h3 className="text-lg font-semibold border-b pb-2 mb-3 flex items-center">
            <FaCoins className="text-blue-600 mr-2" /> Current Month Vehicle
            Performance
          </h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-2 border">Vehicle</th>
                <th className="text-right p-2 border">
                  Average Revenue / Booking
                </th>
                <th className="text-right p-2 border">Total Revenue</th>
                <th className="text-right p-2 border">Completed Bookings</th>
              </tr>
            </thead>
            <tbody>
              {base.current_month_vehicle_performance?.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="p-2 border font-medium">{vehicle.vehicle}</td>
                  <td className="p-2 border text-right text-green-700">
                    Ksh.{" "}
                    {Number(vehicle.avg_income_per_booking).toLocaleString()}
                  </td>
                  <td className="p-2 border text-right text-blue-700">
                    Ksh. {Number(vehicle.total_revenue).toLocaleString()}
                  </td>
                  <td className="p-2 border text-right text-blue-700">
                    {vehicle.completed_bookings}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role-Specific Sections */}
      {driver && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h3 className="text-lg font-semibold border-b pb-2 mb-3">
            Driver Deliveries
          </h3>
          <ul className="space-y-1">
            {driver.deliveries?.map((d) => (
              <li key={d.id}>
                Booking {d.booking_no} — Start: {d.start_date}
              </li>
            ))}
          </ul>

          <h3 className="text-lg font-semibold border-b pb-2 mb-3">
            Chauffeur Bookings
          </h3>
          <ul className="space-y-1">
            {driver.chauffeur_bookings?.map((b) => (
              <li key={b.id}>
                {b.booking_no} — {b.first_name} {b.last_name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {sales && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h3 className="text-lg font-semibold border-b pb-2 mb-3">
            Sales Bookings
          </h3>
          <ul className="space-y-1">
            {sales.sales_bookings?.map((b) => (
              <li key={b.id}>
                {b.booking_no} — {b.first_name} {b.last_name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {fleet && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h3 className="text-lg font-semibold border-b pb-2 mb-3">
            Work Orders
          </h3>
          <ul className="space-y-1">
            {fleet.work_orders?.map((w) => (
              <li key={w.id}>
                {w.work_order_no} — {w.make} {w.model} ({w.number_plate})
              </li>
            ))}
          </ul>

          <h3 className="text-lg font-semibold border-b pb-2 mb-3">
            Maintenance Vehicles
          </h3>
          <ul className="space-y-1">
            {fleet.maintenance_vehicles?.map((v) => (
              <li key={v.id}>
                {v.make} {v.model} ({v.number_plate})
              </li>
            ))}
          </ul>

          <h3 className="text-lg font-semibold border-b pb-2 mb-3">
            Service Alerts
          </h3>
          <ul className="space-y-1">
            {fleet.service_alerts?.map((v) => (
              <li key={v.id}>
                {v.make} {v.model} ({v.number_plate}) — Mileage: {v.mileage}/
                {v.service_interval}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Calendar Link */}
      <div className="mt-6 text-end">
        <StyledButton
          to="/maintenance_costs"
          label="View vehicle maintenance costs →"
          variant="primary"
        />
        <StyledButton
          to="/calen"
          label="View Calendar →"
          variant="amber" // or "yellow", "green", etc.
        />
      </div>
    </div>
  );
}
