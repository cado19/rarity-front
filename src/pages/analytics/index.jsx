import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
// import { Chart } from "react-google-charts";
import Loading from "../../components/PageContent/Loading";
import axios from "axios";
import LandingAnalyticsInfoBoxes from "../../components/infoboxes/LandingAnalyticsInfoBoxes";
import Chart from "react-google-charts";
import { Mosaic } from "react-loading-indicators";

export default function Analytics() {
  const [popCategories, setPopCategories] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [bookingCount, setBookingCount] = useState();
  const [loading, setLoading] = useState(true);

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const categoryUrl = baseUrl + "/api/analytics/landing/popular_categories.php";
  const earningsUrl = baseUrl + "/api/analytics/landing/earnings.php";
  const bCountUrl = baseUrl + "/api/analytics/landing/booking_count.php";
  const revenueUrl = baseUrl + "/api/analytics/landing/ninety_revenue.php";

  const getCategories = async () => {
    try {
      const response = await axios.get(categoryUrl);
      console.log(response);
      setPopCategories(response.data.data);
    } catch (error) {
      console.log("getCategories error: ", error);
      setLoading(false);
    }
  };

  const getEarnings = async () => {
    try {
      const response = await axios.get(earningsUrl);
      console.log(response);
      setEarnings(response.data.data);
    } catch (error) {
      console.log("getEarnings error: ", error);
      setLoading(false);
    }
  };

  const getBCount = async () => {
    try {
      const response = await axios.get(bCountUrl);
      console.log(response);
      setBookingCount(response.data.data);
    } catch (error) {
      console.log("getBCount error: ", error);
      setLoading(false);
    }
  };

  const get90Revenue = async () => {
    try {
      const response = await axios.get(revenueUrl);
      console.log(response);
      setRevenue(response.data.data);
      setLoading(false);
    } catch (error) {
      console.log("getRevenue error: ", error);
      setLoading(false);
    }
  };

  //format revenue data for google react chart
  const revenueChartData = revenue && [
    ["Month", "Revenue"], //column headerss
    ...revenue.map(item => [item.month, Number(item.total)])
  ]

  const categoryChartData = popCategories && [
    ["Category", "Value"],
    ...popCategories.map(item => [item.category, Number(item.total)])
  ]

  const categoryChartOptions = {
    title: "Most Popular Categories",
    pieHole: 0.4,
    is3D: true
  }


  const revenueChartOptions = {
    title: "Monthly Revenue"
  }

  useEffect(() => {
    getCategories();
    getEarnings();
    getBCount();
    get90Revenue();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md w-full flex items-center justify-center h-full">
        <Mosaic color="#32cd32" size="large" text="Loading..." textColor="" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl ml-4 mt-4">Analytics</h2>
      <LandingAnalyticsInfoBoxes />

      <div className="flex flex-row gap-4 mt-2 ml-2 mr-1 overflow-hidden">
        <div className="w-[50rem] h-[25rem] bg-white p-4 rounded-sm border border-gray flex flex-col">
          <Chart chartType="ColumnChart" data={revenueChartData} options={revenueChartOptions} width="100%" height="350px" />
        </div>
        <div className="h-[25rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col flex-1">
        <Chart chartType="PieChart" data={categoryChartData} options={categoryChartOptions} width="100%" height="350px" />
        </div>
      </div>
    </div>
  );
}
