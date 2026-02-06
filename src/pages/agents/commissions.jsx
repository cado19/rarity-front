import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { get_agent_commissions } from "../../api/post";
import Loading from "../../components/PageContent/Loading";
import { format } from "date-fns";
import BasicTable from "../../components/utility/basicTable";
import { earningsColumns } from "../../components/utility/tableColumns";
import { fetchAgentDetails } from "../../api/fetch";

export default function Commissions() {
  const location = useLocation();
  const { agentId, from, to } = location.state || {};

  const [bookings, setBookings] = useState([]);
  const [agent, setAgent] = useState(null);
  const [columnFilters, setColumnFilters] = useState([]);
  const [totEarning, setTotEarning] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCommissions = async () => {
    try {
      const response = await get_agent_commissions({
        agent_id: agentId,
        from,
        to,
      });

      if (response.data.status !== "Success") {
        setError(response.data.message);
        return;
      }

      setTotEarning(response.data.total_commission);

      const earnings = response.data.bookings.map((booking) => ({
        id: booking.id,
        booking_no: booking.booking_no,
        total: Number(booking.total).toLocaleString(),
        commission: Number(booking.commission).toLocaleString(),
        start_date: format(new Date(booking.start_date), "do MMMM yyyy"),
        end_date: format(new Date(booking.end_date), "do MMMM yyyy"),
      }));

      setBookings(earnings);
    } catch (err) {
      setError("Error fetching commissions: " + err.message);
    }
  };

  const getAgent = async () => {
    try {
      const response = await fetchAgentDetails(agentId);
      setAgent(response.agent);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (agentId && from && to) {
        await Promise.all([fetchCommissions(), getAgent()]);
      }
      setLoading(false);
    };
    loadData();
  }, [agentId, from, to]);

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold text-end text-yellow-600 tracking-wide mb-4 mt-2">
        Commissions Report: {agent?.name}
      </h1>
      <p className="mb-4">Total Commission: {Number(totEarning).toLocaleString()}/-</p>

      <BasicTable
        data={bookings}
        columns={earningsColumns}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
    </div>
  );
}