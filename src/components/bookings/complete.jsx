// THIS COMPONENT HANDLES THE BOOKING COMPLETION PROCESS 
import axios from 'axios';
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { baseURL } from '../../constants/url';

export default function CompleteBooking() {
    const { id } = useParams();
    const navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const completeURL = baseUrl + `/api/bookings/complete.php?id=${id}`;
    axios.post(completeURL).then((response) => {
        if(response.data.message == "Successfully completed booking"){
            navigate(`/booking/${id}`, { state: { message: "Booking completed" } });
        } else {
            navigate(`/booking/${id}`, { state: { message: "Booking could not be completed" } });
        }
    });
}
