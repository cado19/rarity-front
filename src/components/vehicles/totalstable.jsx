import React from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { formatDate } from "date-fns";

export default function VehicleTotalsTable({totals}) {
  const columns = [
    {
      name: "Make",
      selector: (row) => row.make,
      sortable: true,
    },
    {
      name: "Model",
      selector: (row) => row.model,
      sortable: true,
    },
    {
      name: "Number Plate",
      selector: (row) => row.number_plate,
    },
    {
      name: "Total",
      selector: (row) => (Number(row.total)).toLocaleString(),
      sortable: true,
    },
    {
      name: "Daily Rate",
      selector: (row) => (Number(row.daily_rate)).toLocaleString(),
      sortable: true,
    },
    {
      name: "ADR",
      selector: (row) => (Number(row.adr)).toLocaleString(),
      sortable: true,
    },

  ];
  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={totals}
        pagination
        highlightOnHover
        striped
      />
    </div>
  );
}
