import React, { useEffect, useState } from "react";
import axios from "axios";
// import Timeline, {
//   TimelineHeaders,
//   SidebarHeader,
//   DateHeader,
// } from "react-calendar-timeline";
// import 'react-calendar-timeline/lib/Timeline.css';
// import "react-calendar-timeline/styles.css";
import moment from "moment";
// import { Chart } from "react-google-charts";
import Loading from "../../components/PageContent/Loading";
import { userUrl } from "../../constants/url";
import FullCalendar from "@fullcalendar/react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import dayGridPlugin from "@fullcalendar/daygrid";
// import weekGridPlugin from "@fullcalendar/weekgrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dateClick
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Mosaic } from "react-loading-indicators";
import {
  get_active_vehicles,
  get_returning_vehicles,
  get_reserved_vehicles,
  get_all_vehicles,
} from "../../api/fetch";

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [activeVehicles, setActiveVehicles] = useState();
  const [reservedVehicles, setReservedVehicles] = useState();
  const [totVehicles, setTotVehicles] = useState();
  const [returnVehicles, setReturnVehicles] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inputs, setInputs] = useState({
    id: "",
    start_date: "",
    end_date: "",
  });
  const newCustomerUrl = userUrl + "/new";

  const workplanData = [];

  const navigate = useNavigate();
  const location = useLocation();

  const baseUrl = import.meta.env.VITE_BASE_URL;

  const bookingUrl = baseUrl + "/api/bookings/workplan_bookings.php";
  const vehicleUrl = baseUrl + "/api/fleet/workplan_vehicles.php";

  const checkMessage = () => {
    location.state &&
      Swal.fire({
        title: location.state.message,
        icon: "info",
        confirmButtonText: "OK",
      });
  };

  const initActiveVehicles = async () => {
    const result = await get_active_vehicles();
    console.log(result);
    setActiveVehicles(result.data.active_count);
  };

  const initReservedVehicles = async () => {
    const result = await get_reserved_vehicles();
    console.log(result);
    setReservedVehicles(result.data.reserved_count);
  };

  const initReturningVehicles = async () => {
    const result = await get_returning_vehicles();
    console.log(result);
    setReturnVehicles(result.data.due_out_count);
  };

  const initTotalVehicles = async () => {
    const result = await get_all_vehicles();
    console.log(result);
    setTotVehicles(result.data.total_count);
  };

  const copyNewCustomerURL = () => {
    navigator.clipboard.writeText(newCustomerUrl);
    Swal.fire({
      title: "Link copied",
      text: "New Customer Link copied to clipboard",
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  const addData = (booking) => {
    workplanData.push({
      id: booking.id,
      title: booking.title,
      resourceId: booking.group,
      start: booking.start_time,
      end: booking.end_time,
      cateory: booking.category,
      color: booking.status,
      textColor: booking.textColor,
      //   itemProps: {
      //     style: {
      //       background: `${booking.status}`,
      //     },
      //   },
    });
    // console.log(workplanData);
  };

  const getBookings = async () => {
    try {
      const response = await axios.get(bookingUrl);
      // response.data.bookings.map((booking) => updateBookings(booking));
      // console.log(response.data);
      response.data.bookings.forEach((booking) => {
        addData(booking);
      });
      setBookings(workplanData);
      setLoading(false);
    } catch (error) {
      const errorMessage = "Error: " + error.message;
      setError(errorMessage);
      console.log(errorMessage);
    }
  };

  // console.log(bookings);

  const getVehicles = async () => {
    try {
      const response = await axios.get(vehicleUrl);
      setVehicles(response.data.vehicles);
    } catch (error) {
      const errorMessage = "Error: " + error.message;
      console.error("Error: ", error);
      setError(errorMessage);
    }
  };

  // helper function to post vehicle update
  const postDashVehicle = async (booking) => {
    try {
      const response = await axios.post(
        baseUrl + "/api/bookings/update_dash_vehicle_booking.php",
        booking
      );
      if (response.data.status === "Success") {
        Swal.fire({
          title: "Booking Updated",
          text: "Booking has been updated successfully",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Booking Update Failed",
          text: "Booking update failed",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error: ", error);
      Swal.fire({
        title: "An Error Occured",
        text: "Try again or contact support",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // helper function to update dates
  const updateDates = async (booking) => {
    try {
      const response = await axios.post(
        baseUrl + "/api/bookings/update_dash_booking.php",
        booking
      );
      if (response.data.status === "Success") {
        Swal.fire({
          title: "Booking Updated",
          text: "Booking has been updated successfully",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Booking Update Failed",
          text: "Booking update failed",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      const errorMessage = "Error: " + error.message;
      console.error("Error: ", error);
    }
  };

  //update booking without resource
  const updateBooking = async (args) => {
    const startDay = args.event.start.getDate().toString().padStart(2, "0");
    const startMonth = (args.event.start.getMonth() + 1)
      .toString()
      .padStart(2, "0");
    const startYear = args.event.start.getFullYear().toString();
    const formattedStartDate = `${startYear}-${startMonth}-${startDay}`;
    const endDay = args.event.end.getDate().toString().padStart(2, "0");
    const endMonth = (args.event.end.getMonth() + 1)
      .toString()
      .padStart(2, "0");
    const endYear = args.event.start.getFullYear().toString();
    const formattedEndDate = `${endYear}-${endMonth}-${endDay}`;

    const oldResourceId = args.oldResource?.id;
    const newResourceId = args.newResource?.id;

    if (oldResourceId != null) {
      // update the booking with the new vehicle
      const booking = {
        booking_id: args.event.id,
        vehicle_id: newResourceId,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
      };
      postDashVehicle(booking);
    } else {
      // update the booking with the new dates

      const booking = {
        booking_id: args.event.id,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
      };
      updateDates(booking);
    }
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (!loggedIn) {
      navigate("/login");
    }
    getVehicles();
    getBookings();
    checkMessage();
    initActiveVehicles();
    initReservedVehicles();
    initReturningVehicles();
    initTotalVehicles();
  }, [loading]);

  // console.log(vehicles);

  if (error) {
    return (
      <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md">
        <h1 className="text-red-600 text-center">{error}</h1>
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
    <div className="bg-white px-4 py-6 pb-4 rounded border-gray-200 flex-1 shadow-md h-screen">
      {/* Vehicle Booking Basic Stats  */}
      <div className="flex space-x-4 mt-3">
        <div className="flex items-center space-x-2">
          All
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded ml-2">
            {totVehicles}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          Vacant
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded ml-2">
            {totVehicles - activeVehicles - reservedVehicles - returnVehicles}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          Occupied
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded ml-2">
            {activeVehicles}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          Reserved
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded ml-2">
            {reservedVehicles}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          Due out
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded ml-2">
            {returnVehicles}
          </span>
        </div>
      </div>

      {/* KEY / LEGEND  */}
      <div className="flex space-x-4 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500"></div>
          <span>Active Booking</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-700"></div>
          <span>Upcoming Booking</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-300"></div>
          <span>Completed Booking</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500"></div>
          <span>Cancelled Booking</span>
        </div>
      </div>

      {/* CALENDAR  */}
      <div className="mt-3 bg-white">
        {/* <FullCalendar
          height="auto"
          initialView="resourceTimelineMonth"
          schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
          plugins={[resourceTimelinePlugin, dayGridPlugin, interactionPlugin]}
          events={bookings}
          resources={vehicles}
          resourceGroupField="category"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "resourceTimelineMonth",
          }}
          stickyFooterScrollbar={true}
          resourceAreaHeaderContent="Vehicles"
          resourceAreaWidth="35%"
          slotLabelFormat={{
            weekday: "short", // abbreviated day names
            month: "short", // abbreviated month names
            day: "numeric", // numeric day
          }}
          slotLabelContent={(arg) => (
            <div className="custom-slot-label">
              <p>
                <span className="day">
                  {arg.date.toLocaleDateString("en-US", { weekday: "short" })}
                </span>
              </p>
              <span className="date">
                {arg.date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
          editable={true}
          // droppable={true}
          eventClick={(arg) => {
            console.log(arg.event);
            navigate("/booking/" + arg.event.id);
          }}
          eventDrop={(arg) => {
            updateBooking(arg);
          }}
        /> */}
      </div>
    </div>
  );
}
