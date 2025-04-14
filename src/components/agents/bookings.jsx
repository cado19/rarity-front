// THIS FILE IS FOR RENDERING DATA TABLE FOR AGENT BOOKINGS AND ANY OTHER PLACE THAT HAS A BOOKINGS TABLE
import React from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { format, formatDate } from 'date-fns';


export default function BookingTbl({ bookings }) {
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
      selector: (row) => formatDate(new Date(row.start_date), 'do MMMM yyyy'),
      sortable: true,
    },
    {
      name: "End Date",
      selector: (row) => formatDate(new Date(row.end_date), 'do MMMM yyyy') ,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
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
