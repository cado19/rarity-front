import React from "react";

export default function VehicleAnalyticsInfoBoxes({popVehicle, profVehicle}) {

  return (
    <div className="flex gap-4 w-full mt-2 ml-1 mr-1">
      <BoxWrapper>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">Most popular vehicle</span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">
            {popVehicle?.make} {" "} {popVehicle?.model} {" "} {popVehicle?.number_plate}
            </strong>
            <span className="text-sm text-green-500 pl-2">{popVehicle?.total} bookings</span>
          </div>
        </div>
      </BoxWrapper>
      <BoxWrapper>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-light">Most profitable vehicle</span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">
            {profVehicle?.make} {" "} {profVehicle?.model} {" "} {profVehicle?.number_plate}
            </strong>
            <span className="text-sm text-green-500 pl-2">{Number(profVehicle?.total).toLocaleString()}/-</span>
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