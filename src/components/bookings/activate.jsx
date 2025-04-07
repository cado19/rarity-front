// THIS COMPONENT HANDLES THE BOOKING ACTIVATION PROCESS 
import axios from 'axios';
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { baseURL } from '../../constants/url';

export default function ActivateBooking() {
    const { id } = useParams();
    const navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const activateURL = baseUrl + `/api/bookings/activate.php?id=${id}`;
    axios.post(activateURL).then((response) => {
        if(response.data.message = "Successfully activated booking"){
            navigate(`/booking/${id}`, { state: { message: "Booking activated" } });
        } else {
            navigate(`/booking/${id}`, { state: { message: "Booking could not be activated" } });
        }
    });
}
