import React from "react";

export default function LandingAnalyticsInfoBoxes() {

  return (
    <div className="flex gap-4 w-full mt-2 ml-1 mr-1">
      <BoxWrapper>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">More Booking Stats</span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">
            More Info
            </strong>
          </div>
        </div>
      </BoxWrapper>
      <BoxWrapper>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">More Client Stats</span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">
              More Info
            </strong>
            <span className="text-sm text-green-500 pl-2">+234</span>
          </div>
        </div>
      </BoxWrapper>
      <BoxWrapper>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">More Vehicle Stats</span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">
            More Info
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