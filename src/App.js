// import React from 'react'
// import { BrowserRouter, Route, Routes } from 'react-router-dom'


// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";




// // employees 
// import EmployeeLoginPage from './pages/employee_login_page'
// import EmployeeTimesheetsPage from './pages/employee_timesheets_page'
// import EmployeeLeaveRequestPage from './pages/employee_leave_request_page'
// // import EmployeeSuggestionsPage from './pages/employee_suggestions_page'

// // admin 
// import AdminLoginPage from './pages/admin_login_page'
// import AdminTimesheestPage from './pages/admin_timesheets_page'
// import AdminManageEmployeePage from './pages/admin_manage_employee_page'
// import AdminManageProjectPage from './pages/admin_manage_project_page'
// // import AdminSuggestionsPage from './pages/admin_suggestions_page'
// import AdminLeaveRequestPage from './pages/admin_leave_request_page'
// import AdminEditEmployeePage from './pages/admin_edit_employee_page'
// import EmployeeDetailsPopupEmployeePage from './popuopforms/employee_details_popup_employee_page'
// import EmployeeDetailsProfileForAdminPage from './popuopforms/employee_details_admin_side'
// import AdminTaskSendPage from './pages/admin_task_send_page'
// import EmployeeViewTaskPage from './pages/employee_view_task_page'
// import AdminDetails from './popuopforms/admin_details'
// import EmployeeStockManagementPage from './pages/employee_stock_management_page'
// import AdminStockManagementPage from './pages/admin_stock_management_page'
// import AdminAddStockPage from './pages/admin_add_stock_page'
// import EmployeeAddStockPage from './pages/employee_add_stock_page'
// import EmployeeEditStockForm from './pages/employee_edit_stock_page'
// import AdminEditStockForm from './pages/admin_edit_stock_page'
// import AdminDashboardPage from './pages/admin_dashboard_page'
// import EmployeeRequirementsPage from './pages/employee_requirement_page'
// import AdminRequirementPage from './pages/admin_requirement_page'
// // import EditStockForm from './pages/employee_edit_stock_page'



// export default function App() {
//   return (
//     <div>
//       <BrowserRouter>
//         <Routes>

//         {/* employees  */}
//         <Route path="/" element={<EmployeeLoginPage/>} ></Route>
//         <Route path="/employeetimesheetspage" element={<EmployeeTimesheetsPage/>} ></Route>
//         <Route path="/employeeleaverequestpage" element={<EmployeeLeaveRequestPage/>} ></Route>
//         {/* <Route path="/employeesuggestionspage" element={<EmployeeSuggestionsPage/>} ></Route> */}
//         <Route path="/employeedeatilsemployeesidepage" element={<EmployeeDetailsPopupEmployeePage/>} ></Route>
//         <Route path="/employeedetailsadminsidepage" element={<EmployeeDetailsProfileForAdminPage/>}></Route>
//         <Route path="/employeeviewtaskpage" element={<EmployeeViewTaskPage/>}></Route>
//         <Route path="/employeestockmanagementpage" element={<EmployeeStockManagementPage/>}></Route>
//         <Route path="/employeeaddstockpage" element={<EmployeeAddStockPage/>}></Route>

//         <Route path="/employeeeditstockform" element={<EmployeeEditStockForm/>}></Route>
//         <Route path="/employeerequirementform" element={<EmployeeRequirementsPage/>}></Route>





        

//         {/* admin  */}
//         <Route path="/adminloginpage" element={<AdminLoginPage/>} ></Route>
//         <Route path="/admintimesheetspage" element={<AdminTimesheestPage/>} ></Route>
//         <Route path="/adminmanageemployeepage" element={<AdminManageEmployeePage/>} ></Route>
//         <Route path="/adminmanageprojectpage" element={<AdminManageProjectPage/>} ></Route>
//         {/* <Route path="/adminsuggestionspage" element={<AdminSuggestionsPage/>} ></Route> */}
//         <Route path="/adminleaverequestpage" element={<AdminLeaveRequestPage/>} ></Route>
//         <Route path="/admineditemployeepage" element={<AdminEditEmployeePage/>} ></Route>
//         <Route path="/admintasksendpage" element={<AdminTaskSendPage/>}></Route>
//         <Route path="/adminprofile" element={<AdminDetails/>}></Route>
//         <Route path="/adminstockmanagementpage" element={<AdminStockManagementPage/>}></Route>
//         <Route path="/adminaddstockpage" element={<AdminAddStockPage/>}></Route>
//         <Route path="/admineditstockform" element={<AdminEditStockForm/>}></Route>
//         <Route path="/admindashboardpage" element={<AdminDashboardPage/>}></Route>
//         <Route path="/adminrequirementpage" element={<AdminRequirementPage/>}></Route>


        

//         </Routes>

//         <ToastContainer
//           position="top-right"
//           autoClose={3000}
//           hideProgressBar={false}
//           newestOnTop={false}
//           closeOnClick
//           pauseOnHover
//           draggable
//           theme="colored"
//         />
       


//       </BrowserRouter>
//     </div>
//   )
// }




import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ProtectedRoute from "./components/protected_routes";


// employees
import EmployeeLoginPage from "./pages/employee_login_page";
import EmployeeTimesheetsPage from "./pages/employee_timesheets_page";
import EmployeeLeaveRequestPage from "./pages/employee_leave_request_page";
import EmployeeDetailsPopupEmployeePage from "./popuopforms/employee_details_popup_employee_page";
import EmployeeDetailsProfileForAdminPage from "./popuopforms/employee_details_admin_side";
import EmployeeViewTaskPage from "./pages/employee_view_task_page";
import EmployeeStockManagementPage from "./pages/employee_stock_management_page";
import EmployeeAddStockPage from "./pages/employee_add_stock_page";
import EmployeeEditStockForm from "./pages/employee_edit_stock_page";
import EmployeeRequirementsPage from "./pages/employee_requirement_page";

// admin
import AdminLoginPage from "./pages/admin_login_page";
import AdminTimesheestPage from "./pages/admin_timesheets_page";
import AdminManageEmployeePage from "./pages/admin_manage_employee_page";
import AdminManageProjectPage from "./pages/admin_manage_project_page";
import AdminLeaveRequestPage from "./pages/admin_leave_request_page";
import AdminEditEmployeePage from "./pages/admin_edit_employee_page";
import AdminTaskSendPage from "./pages/admin_task_send_page";
import AdminDetails from "./popuopforms/admin_details";
import AdminStockManagementPage from "./pages/admin_stock_management_page";
import AdminAddStockPage from "./pages/admin_add_stock_page";
import AdminEditStockForm from "./pages/admin_edit_stock_page";
import AdminDashboardPage from "./pages/admin_dashboard_page";
import AdminRequirementPage from "./pages/admin_requirement_page";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<EmployeeLoginPage />} />
          <Route path="/adminloginpage" element={<AdminLoginPage />} />

          {/* Employee Protected Routes */}
          <Route
            path="/employeetimesheetspage"
            element={
              <ProtectedRoute role="employee">
                <EmployeeTimesheetsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employeeleaverequestpage"
            element={
              <ProtectedRoute role="employee">
                <EmployeeLeaveRequestPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employeedeatilsemployeesidepage"
            element={
              <ProtectedRoute role="employee">
                <EmployeeDetailsPopupEmployeePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employeedetailsadminsidepage"
            element={
              <ProtectedRoute role="admin">
                <EmployeeDetailsProfileForAdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employeeviewtaskpage"
            element={
              <ProtectedRoute role="employee">
                <EmployeeViewTaskPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employeestockmanagementpage"
            element={
              <ProtectedRoute role="employee">
                <EmployeeStockManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employeeaddstockpage"
            element={
              <ProtectedRoute role="employee">
                <EmployeeAddStockPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employeeeditstockform"
            element={
              <ProtectedRoute role="employee">
                <EmployeeEditStockForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employeerequirementform"
            element={
              <ProtectedRoute role="employee">
                <EmployeeRequirementsPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admintimesheetspage"
            element={
              <ProtectedRoute role="admin">
                <AdminTimesheestPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/adminmanageemployeepage"
            element={
              <ProtectedRoute role="admin">
                <AdminManageEmployeePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/adminmanageprojectpage"
            element={
              <ProtectedRoute role="admin">
                <AdminManageProjectPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/adminleaverequestpage"
            element={
              <ProtectedRoute role="admin">
                <AdminLeaveRequestPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admineditemployeepage"
            element={
              <ProtectedRoute role="admin">
                <AdminEditEmployeePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admintasksendpage"
            element={
              <ProtectedRoute role="admin">
                <AdminTaskSendPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/adminprofile"
            element={
              <ProtectedRoute role="admin">
                <AdminDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/adminstockmanagementpage"
            element={
              <ProtectedRoute role="admin">
                <AdminStockManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/adminaddstockpage"
            element={
              <ProtectedRoute role="admin">
                <AdminAddStockPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admineditstockform"
            element={
              <ProtectedRoute role="admin">
                <AdminEditStockForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admindashboardpage"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/adminrequirementpage"
            element={
              <ProtectedRoute role="admin">
                <AdminRequirementPage />
              </ProtectedRoute>
            }
          />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />
      </BrowserRouter>
    </div>
  );
}
