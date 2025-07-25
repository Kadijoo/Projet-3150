import { Navigate } from "react-router-dom";

function PrivateRoute({ role, children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== role) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}
export default PrivateRoute;
