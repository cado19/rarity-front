import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// -------------------- Vehicles Functions --------------------
export const get_active_vehicles = async () => {
  const response = await api.get("/api/dashboard/active_vehicles.php");
  return response;
};

export const get_reserved_vehicles = async () => {
  const response = await api.get("/api/dashboard/reserved_vehicles.php");
  return response;
};

export const get_returning_vehicles = async () => {
  const response = await api.get("/api/dashboard/due_out_count.php");
  return response;
};

export const get_vehicle_count = async () => {
  const response = await api.get("/api/dashboard/vehicle_count.php");
  return response;
};

export const get_all_vehicles = async () => {
  const response = await api.get(`/api/fleet/all.php`);
  return response;
};

export const get_booking_vehicles = async () => {
  const response = await api.get("/api/fleet/booking_vehicles.php");
  return response.data;
};

export const get_vehicle_extras = async (id) => {
  const response = await api.get(`/api/fleet/read_extras.php`, {
    params: { id },
  });
  return response;
};

export const get_vehicle_base = async (id) => {
  const response = await api.get(`/api/fleet/read_base.php`, {
    params: { id },
  });
  return response;
};

export const get_vehicle_pricing = async (id) => {
  const response = await api.get(`/api/fleet/read_pricing.php`, {
    params: { id },
  });
  return response;
};

export const get_all_issues = async () => {
  const response = await api.get(`/api/fleet/read_issues.php`);
  return response;
};

export const get_issue = async (id) => {
  const response = await api.get(`/api/fleet/read_issue.php`, {
    params: { id },
  });
  return response;
};

// -------------------- Bookings Functions --------------------
// get all bookings
export const fetchBookings = async () => {
  const response = await api.get("/api/bookings/all.php");
  return response;
};

// get cancelled bookings
export const fetchCancelledBookings = async () => {
  const response = await api.get("/api/bookings/cancelled.php");
  return response;
};

// get completed bookings
export const fetchCompletedBookings = async () => {
  const response = await api.get("/api/bookings/completed.php");
  return response;
};

// get upcoming bookings
export const fetchUpcomingBookings = async () => {
  const response = await api.get("/api/bookings/upcoming.php");
  return response;
};

// get active bookings
export const fetchActiveBookings = async () => {
  const response = await api.get("/api/bookings/active.php");
  return response;
};

// get single booking
export const fetchBooking = async (id) => {
  const response = await api.get(`/api/bookings/read_single.php`, {
    params: { id },
  });
  return response;
};

// get reservations
export const fetchReservations = async (id) => {
  const response = await api.get(`/api/reservations/read.php`);
  return response;
};

// get reservation
export const fetchReservation = async (id) => {
  const response = await api.get(`/api/reservations/show.php`);
  return response;
};

// -------------------- Customers Functions --------------------
// get customers
export const fetchCustomers = async () => {
  const response = await axios.get(baseUrl + "/api/customers/all.php");
  return response;
};

// get customer
export const fetchCustomer = async (id) => {
  const response = await api.get(`/api/customers/read_single.php?id=${id}`);
  return response;
};

// get customers for creating a booking
export const fetchBookingCustomers = async () => {
  const response = await api.get("/api/customers/booking_customers.php");
  return response.data;
};

// -------------------- Drivers Functions --------------------
// get drivers for creating a booking
export const fetchBookingDrivers = async () => {
  const response = await api.get("/api/drivers/booking_drivers.php");
  return response.data;
};
