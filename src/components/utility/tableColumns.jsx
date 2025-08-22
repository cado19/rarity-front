import { Link } from "react-router-dom";


export const bookingColumns = [
    {
      accessorKey: "booking_no",
      header: "No",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "client",
      header: "Client",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "vehicle",
      header: "Vehicle",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "number_plate",
      header: "Number Plate",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "start_date",
      header: "Start Date",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "end_date",
      header: "End Date",
      cell: (info) => info.getValue(),
    },
    {
      id: "details",
      header: "Details",
      cell: (info) => {
        const booking = info.row.original;
        return <Link to={`/booking/${booking.id}`}>Details</Link>;
      },
    }
  ];