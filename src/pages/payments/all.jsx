// THIS COMPONENT SHOWS ALL PAYMENTS
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { baseURL } from "../../constants/url";
import Loading from "../../components/PageContent/Loading";
import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import { esES } from "@mui/x-date-pickers/locales";
import DriverNav from "../../components/navs/drivernav";
import AgentNav from "../../components/navs/agentnav";
import { Mosaic } from "react-loading-indicators";
import { formatDate } from "date-fns";
import Swal from "sweetalert2";

export default function AllPayments() {
  const navigate = useNavigate();
  const columns = [
    {
      name: "Booking No",
      selector: (row) => row.booking_no,
      sortable: true,
    },
    {
      name: "Currency",
      selector: (row) => row.currency,
    },
    {
      name: "Payment Method",
      selector: (row) => row.payment_method,
      sortable: true,
    },
    {
      name: "Payment Date",
      selector: (row) => row.payment_date,
      sortable: true,
    },

    {
      name: "Payment Time",
      selector: (row) => row.payment_time,
      sortable: true,
    },

    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },

    {
      name: "Options",
      cell: (row) => (
        <button
          className="border border-gray-800 text-gray-800 dark:border-gray-400 dark:text-gray-400 hover:bg-gray-800 hover:text-white dark:hover:bg-gray-400 dark:hover:text-gray-800 font-bold mt-2 py-2 px-4 rounded transition duration-300"
          onClick={() => copySignatureLink(row.order_tracking_id)}
        >
          Receipt
        </button>
      ),
    },
  ];

  const paymentData = [];

  const addPaymentData = (payment) => {
    paymentData.push({
      id: payment.id,
      booking_no: payment.booking_no,
      currency: payment.currency,
      payment_method: payment.payment_method,
      payment_date: formatDate(new Date(payment.payment_time), "do MMMM yyyy"),
      status: payment.status,
      payment_time: formatDate(new Date(payment.payment_time), "hh:mm a"),
      order_tracking_id: payment.order_tracking_id,
      
    });
  };

  const [payments, setPayments] = useState(paymentData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = import.meta.env.VITE_BASE_URL;

  const paymentURL = baseUrl + "/api/payments/all.php";
  const receiptUrl =
    "https://client.raritycars.com/index.php?page=payment/receipt&id=";

  //   copy reciept url
  const copySignatureLink = (order_tracking_id) => {
    const SignUrl = receiptUrl + order_tracking_id;
    navigator.clipboard.writeText(SignUrl);
    Swal.fire({
      title: "Link copied",
      text: "Receipt link has been copied to your clipboard",
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  const handleSearch = (e) => {
    let searchValue;
    let nameValue;
    let emailValue;
    let countryValue;
    let phoneNoValue;
    // let eyeColorValue;

    const newRows = paymentData.filter((row) => {
      nameValue = row.name
        .toString()
        .toLowerCase()
        .includes(e.target.value.toLowerCase());

      emailValue = row.email
        .toLowerCase()
        .includes(e.target.value.toLowerCase());

      countryValue = row.country
        .toLowerCase()
        .includes(e.target.value.toLowerCase());

      phoneNoValue = row.phone_no
        .toLowerCase()
        .includes(e.target.value.toLowerCase());

      if (nameValue) {
        searchValue = nameValue;
      } else if (emailValue) {
        searchValue = emailValue;
      } else if (countryValue) {
        searchValue = countryValue;
      } else {
        searchValue = phoneNoValue;
      }

      return searchValue;
    });

    setPayments(newRows);

    // let query = e.target.value;
    // const newRecords = agentData.filter((item) =>
    //   item.first_name.toLocaleLowerCase().includes(query.toLocaleLowerCase())
    // );
    // setPayments(newRecords);
  };

  const getPayments = async () => {
    try {
      await axios.get(paymentURL).then((response) => {
        console.log(response);
        if (response.data.status === "Error") {
          setError(response.data.message);
          setLoading(false);
        } else {
          response.data.data.forEach((payment) => addPaymentData(payment));
          console.log(paymentData);
          setLoading(false);
        }
      });
    } catch (error) {
      const errorMessage = "Error: " + error.message;
      setError(errorMessage);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user.role_id;
    console.log(role);
    const loggedIn = localStorage.getItem("loggedIn");
    if (!loggedIn) {
      navigate("/login");
    }
    if (role == "2") {
      navigate("/", {
        state: { message: "You are not authorized to view this page." },
      });
    }
    getPayments();
  }, [payments, navigate, loading]);

  //   RENDERS BEGIN
  if (error) {
    return (
      <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md">
        {error}
      </div>
    );
  }
  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md w-full flex items-center justify-center h-full">
        <Mosaic color="#32cd32" size="large" text="Loading..." textColor="" />
      </div>
    );
  }

  return (
    <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md mt-2 mx-3">
      {/* <h1 className="text-bold text-center">Vehicles </h1> */}
      <DataTable
        columns={columns}
        data={payments}
        pagination
        title="Payments"
        highlightOnHover
        progressPending={loading}
        persistTableHead
      />
    </div>
  );
}
