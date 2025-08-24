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

export const clientColumns = [
    {
      accessorKey: "first_name",
      header: "First Name",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "last_name",
      header: "Last Name",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "id_no",
      header: "ID",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "phone_no",
      header: "Tel",
      cell: (info) => info.getValue(),
    },
    {
      id: "details",
      header: "Details",
      cell: (info) => {
        const customer = info.row.original;
        return <Link to={`/customer/${customer.id}`}>Details</Link>;
      },
    }
  ];