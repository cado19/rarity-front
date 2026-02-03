import React from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { formatDate } from "date-fns";

export default function BookingTable({ bookings }) {
  const columns = [
    {
      name: "No",
      selector: (row) => row.booking_no,
      sortable: true,
    },
    {
      name: "Client",
      selector: (row) => row.client,
      sortable: true,
    },
    {
      name: "Vehicle",
      selector: (row) => row.vehicle,
    },
    {
      name: "Number Plate",
      selector: (row) => row.number_plate,
      sortable: true,
    },
    {
      name: "Start Date",
      selector: (row) => row.start_date,
      sortable: true,
    },
    {
      name: "End Date",
      selector: (row) => row.end_date,
      sortable: true,
    },
    {
      name: "Options",
      cell: (row) => <Link to={`/booking/${row.id}`}>Details</Link>,
    },
  ];
  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={bookings}
        pagination
        highlightOnHover
        striped
      />
    </div>
  );
}
