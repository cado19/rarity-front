import React, { useEffect, useState } from "react";
import axios from "axios";
import Timeline, {TimelineHeaders, SidebarHeader, DateHeader} from "react-calendar-timeline";
// import 'react-calendar-timeline/lib/Timeline.css';
import "react-calendar-timeline/styles.css";
import moment from "moment";
// import { Chart } from "react-google-charts";
import Loading from "../../components/PageContent/Loading";
import { baseURL } from "../../constants/url";

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const workplanData = [];

  const bookingUrl = baseURL + "/api/bookings/workplan_bookings.php";
  const vehicleUrl = baseURL + "/api/fleet/workplan_vehicles.php";

  const addData = (booking) => {
    workplanData.push({
      id: booking.id,
      title: booking.title,
      group: booking.group,
      start_time: moment(booking.start_time),
      end_time: moment(booking.end_time),
      itemProps: {
        style: {
          background: `${booking.status}`
          
        }
      }
    });
    // console.log(workplanData);
  };


  const updateBookings = (booking) => {
    const bookingData = {
      id: booking.id,
      booking_no: booking.booking_no,
      group: booking.group,
      start_time: booking.start_date,
      end_time: booking.end_date,
    };
    const newBookings = [];
    newBookings.push(bookingData);
    return newBookings;
    // setBookings(newBookings);
  };

  const getBookings = async () => {
    try {
      const response = await axios.get(bookingUrl);
      // response.data.bookings.map((booking) => updateBookings(booking));
      // console.log(response.data);
      response.data.bookings.forEach((booking) => {addData(booking)});
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
    getVehicles();
    getBookings();
  }, [loading]);

  console.log(vehicles);

  if(error) {
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
    <div className=" bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md mt-2 mx-3">
      {/* <Chart width={"100%"} height={"500px"} chartType="Timeline" data={workplanData} loader={<div>Loading Chart</div>} />  */}
      <Timeline
        groups={vehicles}
        items={bookings}
        defaultTimeStart={moment().add(-2, "month")}
        defaultTimeEnd={moment()}
        // height={"500px"}
        sidebarWidth={350}
        sidebarContent={"Vehicles"}
      >
        {/* <TimelineHeaders className="sticky">
          <SidebarHeader>
            {({ getRootProps }) => {
              return <div {...getRootProps()}>Left</div>;
            }}
          </SidebarHeader>
          <DateHeader unit="primaryHeader" />
          <DateHeader  />
        </TimelineHeaders> */}
      </Timeline>
    </div>
  );
}
