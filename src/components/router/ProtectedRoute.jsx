import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const loggedIn = localStorage.getItem("loggedIn");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  const userRoles = user?.roles?.map((r) => r.id) || [];

  // Check if user has at least one allowed role
  const isAuthorized = allowedRoles.some((role) => userRoles.includes(role));

  if (!isAuthorized) {
    return (
      <Navigate
        to="/"
        replace
        state={{ message: "You are not authorized to view this page." }}
      />
    );
  }

  return children;
}
