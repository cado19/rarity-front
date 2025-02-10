// THIS COMPONENT HANDLES THE BOOKING CANCELLATION PROCESS 
import axios from 'axios';
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { baseURL } from '../../constants/url';

export default function CancelBooking() {
    const { id } = useParams();
    const navigate = useNavigate();
    const cancelURL = baseURL + `/api/bookings/cancel.php?id=${id}`;
    axios.post(cancelURL).then((response) => {
        if(response.data.message = "Successfully cancelled booking"){
            navigate(`/booking/${id}`, { state: { message: "Booking cancelled" } });
        } else {
            navigate(`/booking/${id}`, { state: { message: "Booking could not be cancelled" } });
        }
    });
}
