import { Navigate } from "react-router-dom";


export default function ProtectedRoute({ children, role }) {
  const employeeToken = localStorage.getItem("employeeToken");
  const adminToken = localStorage.getItem("adminToken");

  if (role === "employee" && !employeeToken) {
    return <Navigate to="/" replace />;
  }
  if (role === "admin" && !adminToken) {
    return <Navigate to="/adminloginpage" replace />;
  }

  return children;
}



