import axios from 'axios'
import React, { useEffect } from 'react'
import { baseURL } from '../../constants/url';

export default function AllVehicles() {
  const vehicleUrl = baseURL + '/api/fleet/all.php';
  console.log(vehicleUrl);
  useEffect(()=>{
    getVehicles();
  },[]);

  function getVehicles(){
    axios.get(vehicleUrl).then(function(response){
      console.log(response.data);
    })
  }
  return (
    <div className='bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md'>
      <h1>All Vehicles will be displayed here</h1>
      
    </div>
  )
}
