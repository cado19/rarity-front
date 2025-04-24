import React from "react";
import { useLocation } from "react-router-dom";
import Chart from "react-google-charts";

export default function MonthStats() {
  const location = useLocation();

  const { stats } = location.state || {};
  const { month, year } = location.state || {};
  const { data } = stats;

  console.log("stats: ", stats);
  console.log("month: ", month);
  console.log("year: ", year);

  //format revenue data for google react chart
  const revenueChartData = data && [
    ["Vehicle", "Revenue"], //column headerss
    ...data.map((item) => [item.vehicle, Number(item.total)]),
  ];

  const revenueChartOptions = {
    title: "Monthly Revenue"
  }

  const getMonthName = (monthNumber) => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[monthNumber - 1]; // Adjust for zero-based index
  };
  
  // console.log(getMonthName(4));  Outputs: April
  const monthName = getMonthName(month);
  const CapMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1); // Capitalize the first letter


  return <div>
    <h1 className="text-4xl font-bold text-center mt-8">Stats for {monthName} {year}</h1>
    <div className="chart-container">
      <div className="chart">
        <Chart
          chartType="ColumnChart"
          width="100%"
          height="400px"
          data={revenueChartData}
          options={revenueChartOptions}
        />
      </div>
    </div>
  </div>;
}
