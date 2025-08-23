
import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminHeader from "../components/admin_header";
import { FaTrash } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { FcInfo } from "react-icons/fc";

import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';




export default function AdminTimesheetsPage() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [search, setSearch] = useState("");
  const [timesheet, setTimesheet] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState("");
  const [selectedSuggestions, setSelectedSuggestions] = useState("");
  const [selectedNextDayTask, setSelectedNextdayTask] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");  // for filter 

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [employeeIdToDelete, setEmployeeIdToDelete] = useState(null);


  useEffect(() => {
    fetchEmployees();
  setSelectedMonth(new Date().toISOString().slice(0, 7));
  }, []);


  const fetchEmployees = async () => {
    try {
      const res = await axios.post("http://localhost:3004/view-employee");
      if (res.data.success) {
        setEmployees(res.data.data);
      } else {
        console.error("Employee fetch failed");
      }
    } catch (err) {
      console.error("API Error:", err.message);
    }
  };


  const fetchTimesheetData = async (employeeId) => {
    try {
      const res = await axios.post("http://localhost:3004/view-employee-timesheet", { id: employeeId });
      if (res.data.success) {
        setTimesheet(res.data.data);
      } else {
        setTimesheet([]);
      }
    } catch (err) {
      console.error("Error fetching timesheet:", err.message);
      setTimesheet([]);
    }
  };

  // const handleEdit = (employee) => {
  //   alert(`Edit feature clicked for: ${employee.name}`);
  // };

  // const handleDelete = async (id) => {
  //   if (window.confirm("Are you sure you want to delete this employee?")) {
  //     try {
  //       const res = await axios.post("http://localhost:3004/delete-employee", { _id: id });

  //       if (res.data.success) {
  //         alert(res.data.message || "Deleted successfully");
  //         setEmployees((prev) => prev.filter((emp) => emp._id !== id));
  //       } else {
  //         alert(res.data.message || "Failed to delete employee");
  //       }
  //     } catch (error) {
  //       console.error("Delete failed:", error.message);
  //       alert("Something went wrong while deleting.");
  //     }
  //   }
  // };

  const confirmDeleteEmployee = async () => {
  try {
    const res = await axios.post("http://localhost:3004/delete-employee", {
      _id: employeeIdToDelete,
    });

    if (res.data.success) {
      toast.success(res.data.message || "Employee deleted successfully!", { autoClose: 2000 });
      setEmployees((prev) => prev.filter((emp) => emp._id !== employeeIdToDelete));
    } else {
      toast.error(res.data.message || "Failed to delete employee.");
    }
  } catch (error) {
    console.error("Delete Employee Error:", error);
    toast.error("Something went wrong while deleting the employee.");
  } finally {
    setShowDeleteConfirm(false);
    setEmployeeIdToDelete(null);
  }
};




  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name?.toLowerCase().includes(search.toLowerCase()) ||
      emp.email?.toLowerCase().includes(search.toLowerCase())
  );




    const [data ,setdata] = useState({
    sick : 5,
    casual :12            
     })

  const fetchLeaveRequests = async () => {
  try {
    const res = await axios.post("http://localhost:3004/view-employee-leave-request-admin-table");
    if (res.data.success) {
      let casual = 12;
      let sick = 5;

      res.data.data.forEach((item) => {
        if (item.employee_name === selectedEmployee?.name && item.status === "Approved") {
          const from = new Date(item.from_date);
          const to = new Date(item.to_date);
          const days = Math.ceil(Math.abs(to - from) / (1000 * 60 * 60 * 24)) + 1;
          
            if (item.leave_type === "Sick Leave") {
            sick =  sick - days;
          } else {
            casual -= days;
          }
        }
      });

      setdata({ casual, sick });
    }
  } catch (error) {
    console.error("Error fetching leave requests:", error);
  }
   };



useEffect(()=>{
  fetchLeaveRequests();
},[selectedEmployee]);



  // for info popup 
   const openModal = (task, suggestions,next_day_task) => {
    setSelectedTask(task);
    setSelectedSuggestions(suggestions)
    setSelectedNextdayTask(next_day_task)
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTask("");
    setSelectedSuggestions("");
    setSelectedNextdayTask("");

  };


  const filteredTimesheet = selectedMonth
    ? timesheet.filter((entry) => {
        const entryDate = new Date(entry.createdAt);
        const entryMonth = `${entryDate.getFullYear()}-${String(
          entryDate.getMonth() + 1
        ).padStart(2, "0")}`;
        return entryMonth === selectedMonth;
      })
    : timesheet;



  return (
    <div className="min-h-screen bg-gradient-to-br bg-[#CDE6EC] text-gray-800">
      <AdminHeader />


      <div className="sticky top-12 z-20 bg-white shadow px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-blue-700 whitespace-nowrap">
         Employee Timesheets
        </h1>

        {/* Search + Button group */}

        {!selectedEmployee && (
        <div className="flex items-center gap-3 w-full md:w-auto">
         <input
           type="text"
           placeholder="Search by name or email..."
           className="px-4 py-2 border border-gray-300 rounded-lg w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-400"
           value={search}
           onChange={(e) => setSearch(e.target.value)}
          />

          <Link to="/adminmanageemployeepage">
           <button className="bg-[#32A9C7] text-white px-4 py-2 rounded-md hover:bg-[#2588a0] transition whitespace-nowrap">
            + Add New Employee
            </button>
          </Link>
        </div>
        )}

      </div>


      <div className="p-6">
        {!selectedEmployee ? (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {employees.length === 0 ? (
    // case: No employee added at all
    <div className="col-span-full text-center py-10 text-gray-500 font-semibold">
      Employees are not available, please Add Employee
    </div>
  ) : filteredEmployees.length === 0 ? (
    // case: Search applied but no match found
    <div className="col-span-full text-center py-10 text-gray-500 font-semibold">
      This Employee is not available in your table
    </div>
  ) : (
    filteredEmployees.map((emp) => (
      <div
        key={emp._id}
        className="relative bg-white rounded-xl shadow hover:shadow-lg transition p-5 pt-6 cursor-pointer"
      >
        <div className="absolute top-2 right-2 flex space-x-2 z-10">
          <Link to="/admineditemployeepage" state={{ employee: emp }}>
            <button className="p-2 rounded-full hover:bg-green-200">
              <FaEdit className="h-5 w-5" />
            </button>
          </Link>

          <button
            className="p-2 rounded-full hover:bg-red-200"
            onClick={() => {
              setShowDeleteConfirm(true);
              setEmployeeIdToDelete(emp._id);
            }}
          >
            <FaTrash />
          </button>
        </div>

        <div
          onClick={() => {
            setSelectedEmployee(emp);
            fetchTimesheetData(emp._id);
          }}
          className="flex items-center gap-4"
        >
          <img
            src={
              emp.profileImage?.startsWith("http")
                ? emp.profileImage
                : "/user1.jpg"
            }
            alt={emp.name}
            className="w-20 h-20 rounded-full border-2 border-[#32A9C7] shadow object-cover"
          />

          <div>
            <h2 className="text-xl font-bold text-[#32A9C7]">{emp.name}</h2>
            <p className="text-sm">
              <span className="font-semibold">ID:</span> {emp.id || "N/A"}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Email:</span> {emp.email}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Designation:</span> {emp.designation}
            </p>
          </div>
        </div>
      </div>
    ))
  )}
</div>


        ) : (

          <div className="bg-white p-6 md:p-8 rounded-xl shadow-xl w-full">

            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
              
             <img
               src={
               selectedEmployee.profileImage?.startsWith("http")
               ? selectedEmployee.profileImage: "/user1.jpg"
               }
               alt={selectedEmployee.name}
               className="w-24 h-24 rounded-full border-2 border-[#32A9C7] shadow object-cover cursor-pointer"
               onClick={() =>
               navigate("/employeedetailsadminsidepage", {
               state: { employee: selectedEmployee }
               })
               }
              />

              <div>
                <h2 className="text-2xl font-bold text-[#32A9C7]">{selectedEmployee.name}</h2>
                <p><strong>ID:</strong> {selectedEmployee.id}</p>
                <p><strong>Email:</strong> {selectedEmployee.email}</p>
                <p><strong>Designation:</strong> {selectedEmployee.designation}</p>
                <p><strong>Projects:</strong> {selectedEmployee.project}</p>
                <p className="text-green-600 font-semibold mt-2">Casual Leaves: {data.casual ?? 10} | Sick Leaves: {data.sick ?? 10}</p>
              </div>
            </div>

            <div className="flex justify-end items-center mb-4">
              <label className="text-sm font-semibold mr-2">Filter by Month:</label>
                <input
                   type="month"
                   value={selectedMonth}
                   onChange={(e) => setSelectedMonth(e.target.value)}
                   className="border px-2 py-1 rounded"
                />
            </div>


            <div className="overflow-auto">
              <table className="min-w-full border-collapse table-auto text-sm shadow-sm">
                <thead className="bg-blue-100 text-blue-800 font-semibold text-left">
                  <tr>
                    <th className="border px-4 py-2">Date</th>
                    <th className="border px-4 py-2">Login</th>
                    <th className="border px-4 py-2">Logout</th>
                    <th className="border px-4 py-2">Hours</th>
                    <th className="border px-4 py-2">Project</th>
                    <th className="border px-4 py-2">Task</th>
                    <th className="border px-4 py-2">Attachment</th>
                    <th className="border px-4 py-2">Suggestions</th>
                    <th className="border px-4 py-2">Next Day Task</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTimesheet.length > 0 ? (
                    filteredTimesheet.map((entry, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border px-4 py-2">
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </td>
                        <td className="border px-4 py-2">{entry.login_time}</td>
                        <td className="border px-4 py-2">{entry.logout_time}</td>
                        <td className="border px-4 py-2">{entry.hours}</td>
                        <td className="border px-4 py-2">{entry.project_name}</td>


                        {/* <td className="border px-4 py-2">{entry.task}</td> */}

             <td className="border px-4 py-2">
                                    {entry.task && entry.task.split(" ").length > 10 ? ( //  condition for >10 words
                                      <div className="flex items-center space-x-2">
                                        <span>{entry.task.split(" ").slice(0, 6).join(" ")}...</span> {/*  show first 10 words */}
                                        <button
                                          onClick={() => openModal(entry.task)}         //  open popup with full reason
                                          className="text-blue-600 hover:text-blue-800"
                                        >
                                          <FcInfo size={18} />             {/*  info icon */}
                                        </button>
                                      </div>
                                    ) : (
                                      <span>{entry.task}</span>                         //  show full if <= 10 words
                                    )}
                                  </td>


                        {/*  Attachment - show download/view link */}
                      <td className="border px-4 py-2">{entry.attachment ? (
           <a
            href={`http://localhost:3004/uploads/${entry.attachment}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600"
          >
            View
          </a>
        ) : (
          <div className="flex justify-center items-center h-full">
              <span className="text-2xl">-</span>
            </div>
        )}
                      </td>

                      

                       {/*  Description */}
                      {/* <td className="border px-4 py-2">{entry.suggestions || "-"}</td> */}

                      <td className="border px-4 py-2">
  {!entry.suggestions || entry.suggestions.trim() === "" ? (
    <div className="flex justify-center items-center h-full">
              <span className="text-2xl">-</span>
            </div>
  ) : entry.suggestions.split(" ").length > 10 ? (
    <div className="flex items-center space-x-2">
      <span>{entry.suggestions.split(" ").slice(0, 6).join(" ")}...</span>
      <button
        onClick={() => openModal(entry.suggestions)}
        className="text-blue-600 hover:text-blue-800"
      >
        <FcInfo size={18} />
      </button>
    </div>
  ) : (
    <span>{entry.suggestions}</span>
  )}
</td>



                  {/* <td className="border px-4 py-2">{entry.next_day_task}</td>*/}

                   <td className="border px-4 py-2">
                                          {entry.next_day_task.split(" ").length > 10 ? ( //  condition for >10 words
                                            <div className="flex items-center space-x-2">
                                              <span>{entry.next_day_task && entry.next_day_task.split(" ").slice(0, 6).join(" ")}...</span> {/*  show first 10 words */}
                                              <button
                                                onClick={() => openModal(entry.next_day_task)}         //  open popup with full reason
                                                className="text-blue-600 hover:text-blue-800"
                                              >
                                                <FcInfo size={18} />             {/*  info icon */}
                                              </button>
                                            </div>
                                          ) : (
                                            <span>{entry.next_day_task}</span>                         //  show full if <= 10 words
                                          )}
                                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center py-4 text-gray-400 border">
                        No timesheet data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setSelectedEmployee(null);
                  setTimesheet([]);
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow"
              >
                Back to List
              </button>
            </div>
          </div>
          
        )}


        {showModal && (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-xl w-full transition-all duration-300 scale-100">
    {/* Close Button */}
    <button
      onClick={closeModal}
      className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl"
      aria-label="Close"
    >
      &times;
    </button>

    {/* Header */}
    <div className="flex items-center space-x-2 mb-4">
      <div className="w-2 h-6 bg-blue-500 rounded-sm"></div>
      <h2 className="text-xl font-semibold text-gray-800 tracking-wide">
        Task Description
      </h2>
    </div>

    {/* Task Content */}
    <div className="max-h-72 overflow-y-auto pr-1">
      <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
        { [selectedTask, selectedSuggestions, selectedNextDayTask ]}
      </p>
    </div>
  </div>
         </div>
        )}


        {showDeleteConfirm && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4 text-center">Confirm Deletion</h2>
      <p className="mb-6 text-center">Are you sure you want to delete this employee?</p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setShowDeleteConfirm(false)}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={confirmDeleteEmployee}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
    </div>
     )}



      </div>
    </div>
  );
}
