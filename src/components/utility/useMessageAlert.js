import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { useLocation } from 'react-router-dom';

const messageMap = {
  // bookings messages
  "Booking cancelled": {
    title: "Booking Cancelled",
    text: "The booking has been cancelled",
    icon: "success",
  },
  "Booking could not be cancelled": {
    text: "The booking could not be cancelled",
    icon: "error",
  },
  "Booking completed": {
    title: "Booking completed",
    text: "The booking has been completed",
    icon: "success",
  },
  "Booking could not be completed": {
    title: "Booking could not be completed",
    icon: "error",
  },
  "Booking created successfully": {
    title: "Booking created",
    text: "The booking has been created successfully",
    icon: "success",
  },
  "Booking activated": {
    title: "Booking activated",
    text: "The booking has been activated successfully",
    icon: "success",
  },
  "Booking could not be activated": {
    title: "Booking activation failed",
    text: "Booking could not be activated",
    icon: "error",
  },
  "Booking updated successfully": {
    title: "Booking updated",
    text: "Booking has been updated successfully",
    icon: "success",
  },

  // customer messages
  "Customer deleted": {
    title: "Customer deleted",
    text: "Customer has been updated deleted",
    icon: "success",
  },
  
  "Customer could not be deleted": {
    title: "Customer could not be deleted",
    text: "Please try again!",
    icon: "error",
  },
  // vehicle messages
};

export default function useMessageAlert() {
  const location = useLocation();
  const message = location?.state?.message;

  useEffect(() => {
    if (!message) return;
    const config = messageMap[message];
    if (config) {
      Swal.fire({
        confirmButtonText: "OK",
        ...config,
      });
    }
  }, [message]);
}