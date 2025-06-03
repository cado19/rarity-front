import React, { useEffect, useState } from "react";
import axios from "axios";
import Timeline, {
  TimelineHeaders,
  SidebarHeader,
  DateHeader,
} from "react-calendar-timeline";
// import 'react-calendar-timeline/lib/Timeline.css';
import "react-calendar-timeline/styles.css";
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

const WorkPlan = () => {
  const [bookings, setBookings] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const baseUrl = import.meta.env.VITE_BASE_URL;

  const bookingUrl = baseUrl + "/api/bookings/driver_workplan_bookings.php";
  const driverUrl = baseUrl + "/api/drivers/workplan_drivers.php";

  const checkMessage = () => {
    location.state &&
      Swal.fire({
        title: location.state.message,
        icon: "info",
        confirmButtonText: "OK",
      });
  };

  const getBookings = async () => {
    try {
      const response = await axios.get(bookingUrl);
      // response.data.bookings.map((booking) => updateBookings(booking));
      // console.log(response.data);
      setBookings(response.data.bookings);
      setLoading(false);
    } catch (error) {
      const errorMessage = "Error: " + error.message;
      setError(errorMessage);
      console.log(errorMessage);
    }
  };

  // console.log(bookings);

  const getDrivers = async () => {
    try {
      const response = await axios.get(driverUrl);
      console.log(response);
      setDrivers(response.data.drivers);
    } catch (error) {
      const errorMessage = "Error: " + error.message;
      console.error("Error: ", error);
      setError(errorMessage);
    }
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (!loggedIn) {
      navigate("/login");
    }
    getDrivers();
    getBookings();
    checkMessage();
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
      {/* HEY / LEGEND  */}
      <div class="flex space-x-4 mt-4">
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-blue-500"></div>
          <span>Active Booking</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-green-700"></div>
          <span>Upcoming Booking</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-yellow-300"></div>
          <span>Completed Booking</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-red-500"></div>
          <span>Cancelled Booking</span>
        </div>
      </div>

      {/* CALENDAR  */}
      <div className="mt-3">
        <FullCalendar
          initialView="resourceTimelineMonth"
          schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
          plugins={[resourceTimelinePlugin, dayGridPlugin, interactionPlugin]}
          events={bookings}
          resources={drivers}
          resourceGroupField="category"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "resourceTimelineMonth",
          }}
          stickyFooterScrollbar={true}
          resourceAreaHeaderContent="Drivers"
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
          //   eventDrop={(arg) => {
          //     updateBooking(arg);
          //   }}
        />
      </div>
    </div>
  );
};

export default WorkPlan;
