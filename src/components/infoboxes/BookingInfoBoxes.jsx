import React from "react";

export default function BookingInfoBoxes({ fname, lname, start, end }) {
  const start_date = new Date(start).toString();
  const end_date = new Date(end).toString();

  const duration = (new Date(end) - new Date(start)) / (1000 * 3600 * 24)
  return (
    <div className="flex gap-4 w-full mt-2 ml-1 mr-1">
      <BoxWrapper>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">Client</span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">
              {fname} {lname}
            </strong>
          </div>
        </div>
      </BoxWrapper>
      <BoxWrapper>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">Start Date</span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">
              {start_date}
            </strong>
            <span className="text-sm text-green-500 pl-2">+234</span>
          </div>
        </div>
      </BoxWrapper>
      <BoxWrapper>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">End Date</span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">
            {end_date}
            </strong>
            <span className="text-sm text-green-500 pl-2">+234</span>
          </div>
        </div>
      </BoxWrapper>
      <BoxWrapper>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">Duration</span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">
              {duration} days
            </strong>
            <span className="text-sm text-green-500 pl-2">+234</span>
          </div>
        </div>
      </BoxWrapper>
    </div>
  );
}

function BoxWrapper({ children }){
  return (
      <div className="bg-white rounded-sm p-4 flex-1 border border-gray-200 flex items-center">{ children }</div>
  )
}