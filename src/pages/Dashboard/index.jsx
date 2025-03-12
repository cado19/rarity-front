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
import { baseURL } from "../../constants/url";
import FullCalendar from "@fullcalendar/react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import dayGridPlugin from "@fullcalendar/daygrid";
// import weekGridPlugin from "@fullcalendar/weekgrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dateClick
import { useNavigate } from "react-router-dom";

export default function Calen() {
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const workplanData = [];

  const navigate = useNavigate();

  const bookingUrl = baseURL + "/api/bookings/workplan_bookings.php";
  const vehicleUrl = baseURL + "/api/fleet/workplan_vehicles.php";

  const addData = (booking) => {
    workplanData.push({
      id: booking.id,
      title: booking.title,
      resourceId: booking.group,
      start: booking.start_time,
      end: booking.end_time,
      cateory: booking.category,
      color: booking.status,
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

  console.log(bookings);

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

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (!loggedIn) {
      navigate("/login");
    }
    getVehicles();
    getBookings();
  }, [loading]);

  console.log(vehicles);

  if (error) {
    return (
      <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md">
        <h1 className="text-red-600 text-center">{error}</h1>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md">
        <Loading />
      </div>
    );
  }
  return (
    <div className="bg-white px-4 py-6 pb-4 rounded border-gray-200 flex-1 shadow-md h-screen">
      <div className="mt-3">
        <FullCalendar
          initialView="resourceTimeline"
          schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
          plugins={[resourceTimelinePlugin, dayGridPlugin, interactionPlugin]}
          events={bookings}
          resources={vehicles}
          resourceGroupField="category"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right:
              "resourceTimelineMonth",
          }}
          stickyFooterScrollbar={true}
          resourceAreaHeaderContent="Vehicles"
          resourceAreaWidth="20%"
          slotLabelFormat={{
            weekday: 'short', // abbreviated day names
            month: 'short', // abbreviated month names
            day: 'numeric' // numeric day
          }}
          slotLabelContent={(arg) => (
            <div className="custom-slot-label">
              <p><span className="day">{arg.date.toLocaleDateString('en-US', { weekday: 'short' })}</span></p>
              <span className="date">{arg.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
          )}
        //   weekends={calendarState.weekendsVisible}
        //   calendarWeekends={true}
        />
      </div>
    </div>
  );
}
