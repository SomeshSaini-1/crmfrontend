// // src/components/ProtectedRoute.jsx
// import React from "react";
// import { Navigate } from "react-router-dom";

// /**
//  * ProtectedRoute component
//  * @param {ReactNode} children - The page/component to render if authenticated
//  * @param {"admin" | "employee"} role - Which role's token to check
//  */
// export default function ProtectedRoute({ children, role }) {
//   const adminToken = localStorage.getItem("adminToken");
//   const employeeToken = localStorage.getItem("employeeToken");

//   if (role === "admin") {
//     if (!adminToken) {
//       return <Navigate to="/adminloginpage" replace />;
//     }
//   }

//   if (role === "employee") {
//     if (!employeeToken) {
//       return <Navigate to="/" replace />; // Employee login page
//     }
//   }

//   return children;
// }
