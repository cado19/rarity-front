import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedApp() {
  const loggedIn = localStorage.getItem("loggedIn");

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}