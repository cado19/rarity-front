// THIS COMPONENT HANDLES THE BOOKING COMPLETION PROCESS 
import axios from 'axios';
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { baseURL } from '../../constants/url';

export default function CompleteBooking() {
    const { id } = useParams();
    const navigate = useNavigate();
    const cancelURL = baseURL + `/api/bookings/complete.php?id=${id}`;
    axios.post(cancelURL).then((response) => {
        if(response.data.message = "Successfully completed booking"){
            navigate(`/booking/${id}`, { state: { message: "Booking completed" } });
        } else {
            navigate(`/booking/${id}`, { state: { message: "Booking could not be completed" } });
        }
    });
}
