

import React, { useState, useEffect } from "react";
import axios from "axios";
import EmployeeHeader from "../components/employee_header";
import { FcInfo } from "react-icons/fc";
import Select from "react-select";

import { MdKeyboardArrowDown } from "react-icons/md";

import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


export default function EmployeeViewTaskPage() {
  const [employee, setEmployee] = useState(null);


  const [assignedTasks, setAssignedTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTask, setSelectedTask] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const todayDate = new Date().toISOString().split("T")[0];
  const [activeTable, setActiveTable] = useState("My Assigned Tasks");






  const [formData, setFormData] = useState({
  project: [],
  employeeId: "",
  taskDescription: "",
  deadline: "",
});
const [attachment, setAttachment] = useState(null);




const [tlAssignedTasks, setTlAssignedTasks] = useState([]);

const fetchTLAssignedTasks = async (tlName) => {
  try {
    const res = await axios.post("http://localhost:3004/view-task-by-tl", {
      assignedBy: tlName,
    });
    if (res.data.success) {
      setTlAssignedTasks(res.data.data);
    }
  } catch (err) {
    console.error("Error fetching TL tasks", err);
  }
};





const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};



const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedEmp = employees.find((emp) => emp._id === formData.employeeId);
    if (!selectedEmp) return alert("Employee not found");

    try {
      const data = new FormData();
      data.append("project_name", formData.project.map(p => p.value).join(", "));
      data.append("employee_name", selectedEmp.name);
      data.append("task", formData.taskDescription);
      data.append("deadline", formData.deadline);
      data.append("employeeId", formData.employeeId);


     //  TL name from localStorage 
    const assignedBy = localStorage.getItem("employeeName") || "Unknown TL";
    data.append("assignedBy", assignedBy)



      //  Add current time
const currentTime = new Date().toLocaleTimeString("en-IN", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});
data.append("time", currentTime);

      if (attachment) data.append("attachment", attachment);

      const res = await axios.post("http://localhost:3004/assign-task-tl", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Task sent successfully!");
        setFormData({ employeeId: "", taskDescription: "", deadline: "", project: [],  });
        setAttachment(null);
        setShowForm(false);
        fetchTasks();
      } else {
        toast.error("Failed to send task");
      }
    } catch (err) {
      console.error("Send error", err);
      toast.error("Something went wrong");
    }
  };






  const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};



  useEffect(() => {
    fetchEmployee();
  }, []);

 useEffect(() => {
  if (employee?._id) {
    fetchAssignedTasks(employee._id);
    markNotificationsRead(employee._id);

    const tlName = localStorage.getItem("employeeName");
    if (employee.role === "Employee TL" && tlName) {
      fetchTLAssignedTasks(tlName);
    }
  }
}, [employee]);


  const fetchEmployee = async () => {
    try {
      const res = await axios.post("http://localhost:3004/view-employee");
      const email = localStorage.getItem("employeeEmail");
      console.log("📧 Employee Email from LocalStorage:", email);
      const emp = res.data.data.find((e) => e.email === email);
      if (emp) setEmployee(emp);
    } catch (err) {
      console.error("Error fetching employee:", err);
    }
  };


  const fetchAssignedTasks = async (empId) => {
    try {
      const res = await axios.post("http://localhost:3004/view-assign-task-employee", {
        employeeId: empId,
      });
      if (res.data.success) {
        setAssignedTasks(res.data.data);
        fetchNotifications(empId); //  parallel fetch notifications
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };


 useEffect(() => {
    // fetchEmployees();
    fetchProjects();
    fetchTasks();
  }, []);


  useEffect(() => {
  if (employee?.email) {
    fetchEmployees(); // Only run when employee info is ready
  }
}, [employee]);


 

const fetchEmployees = async () => {
  try {
    const res = await axios.post("http://localhost:3004/view-employee");
    const allEmployees = res.data.data;

    const currentUserEmail = localStorage.getItem("employeeEmail");

    // ✅ Filter out logged-in user from the list
    const filteredEmployees = allEmployees.filter(
      (emp) => emp.email !== currentUserEmail
    );

    setEmployees(filteredEmployees); // use this to populate dropdown
  } catch (err) {
    console.error("Error fetching employees:", err);
  }
};





  const fetchProjects = async () => {
    try {
      const res = await axios.post("http://localhost:3004/view-project");
      if (res.data.success) setProjects(res.data.data);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
  };


   const fetchTasks = async () => {
    try {
      const res = await axios.post("http://localhost:3004/view-assign-task-admin");
      if (res.data.success) setTasks(res.data.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };





  const fetchNotifications = async (empId) => {
    try {
      const res = await axios.post("http://localhost:3004/get-employee-notifications", {
        employeeId: empId,
      });
      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const markNotificationsRead = async (empId) => {
    try {
      await axios.post("http://localhost:3004/mark-all-read", {
        employeeId: empId,
      });
    } catch (err) {
      console.error("Failed to mark notifications as read");
    }
  };

  const openPopup = (taskDesc) => {
    setSelectedTask(taskDesc);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedTask("");
  };

  
  // Map SentAt and ReadAt from notification to each task (assuming message === task)
  const enrichTasks = assignedTasks.map((task) => {
  const relatedNote = notifications.find((n) => n.taskId === task._id); //  reliable

    return {
      ...task,
      sentAt: relatedNote?.createdAt,
      readAt: relatedNote?.readAt,
    };
  });


  //  Add this filter 
const filteredTasks = enrichTasks.filter((task) => {
  if (selectedMonth === "All") return true;
  const taskMonth = new Date(task.createdAt).getMonth();
  return taskMonth === parseInt(selectedMonth);
});



const filteredTlTasks = tlAssignedTasks.filter((task) => {
  if (selectedMonth === "All") return true;
  const taskMonth = new Date(task.createdAt).getMonth();
  return taskMonth === parseInt(selectedMonth);
});




const handleProgressChange = async (taskId, newProgress) => {
  try {
    const res = await axios.post("http://localhost:3004/update-task-progress", {
      taskId,
      progress: parseInt(newProgress),
    });

    if (res.data.success) {
      setAssignedTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, progress: parseInt(newProgress) } : task
        )
      );
    } else {
      alert("Failed to update progress");
    }
  } catch (error) {
    console.error("Progress update failed", error);
    alert("Error updating progress");
  }
};





  return (
    <div className="min-h-screen bg-[#CDE6EC] font-sans">
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">

      <EmployeeHeader />
       {/* <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} /> */}
      <div className="py-4">
       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">


  {employee?.role !== "Employee TL" && (
  <h2 className="text-2xl font-semibold">My Assigned Tasks</h2>
)}
  {employee?.role === "Employee TL" && (
  <div className="flex justify-center mb-4 sm:mb-6 px-1">
    <div className="flex flex-wrap bg-[#f6f9fa] rounded-full p-1 w-full sm:w-fit gap-1">

      <button
        onClick={() => setActiveTable("My Assigned Tasks")}
        className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
          activeTable === "My Assigned Tasks"
            ? "bg-[#32A9C7] text-white"
            : "text-[#32A9C7] bg-transparent"
        }`}
      >
        Assigned Tasks
      </button>
      <button
        onClick={() => setActiveTable("Tasks Assigned By You (as TL)")}
        className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
          activeTable === "Tasks Assigned By You (as TL)"
            ? "bg-[#226272] text-white"
            : "text-[#226272] bg-transparent"
        }`}
      >
        Re-Assigned Tasks
      </button>
    </div>
  </div>
)}



<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">

{employee?.role === "Employee TL" && (
  <button
    onClick={() => setShowForm(true)}
    className="bg-[#32A9C7] text-white px-4 py-2 rounded shadow hover:bg-[#2b97b1] w-full sm:w-auto sm:ml-4 sm:mr-3"

  >
    Assign Task
  </button>
)}


  

<div className="flex items-center gap-2 w-full sm:w-auto">
  {/* Label */}
  <label className="text-sm text-gray-700">Filter by Month:</label>

  {/* Dropdown with custom icon */}
  <div className="relative w-full sm:w-auto">
    <select
      value={selectedMonth}
      onChange={(e) => setSelectedMonth(e.target.value)}
      className="w-full sm:w-auto px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm appearance-none bg-white"
    >
      <option value="All">All</option>
      <option value="0">January</option>
      <option value="1">February</option>
      <option value="2">March</option>
      <option value="3">April</option>
      <option value="4">May</option>
      <option value="5">June</option>
      <option value="6">July</option>
      <option value="7">August</option>
      <option value="8">September</option>
      <option value="9">October</option>
      <option value="10">November</option>
      <option value="11">December</option>
    </select>

    {/* Custom icon */}
    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl text-gray-500 pointer-events-none">
      <MdKeyboardArrowDown />
    </span>
  </div>
</div>


  </div>
</div>






         {(employee?.role !== "Employee TL" || activeTable === "My Assigned Tasks") && (
        <div className="bg-white rounded-lg shadow p-4 overflow-auto">

          <table className="min-w-full text-sm border">

            <thead className="bg-[#5ed9de] text-gray-800 text-xs sm:text-sm">

              <tr>
                <th className="p-3 border">Date</th>
                <th className="p-3 border">Sent At</th>
                {/* <th className="p-3 border">Read At</th> */}
                <th className="p-3 border">Assigned By</th>
                <th className="p-3 border">Project</th>
                <th className="p-3 border">Task</th>
                <th className="p-3 border">Deadline</th>
                <th className="p-3 border">Attachment</th>
                <th className="p-3 border text-center">Progress</th>

                

              </tr>
            </thead>
            <tbody>
              {filteredTasks.length > 0 ? (
         filteredTasks.map((task, index) => (

                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-3 border text-center">{new Date(task.createdAt).toLocaleDateString("en-IN")}</td>
                    <td className="p-3 border text-center">{task.sentAt ? new Date(task.sentAt).toLocaleTimeString("en-IN",{ hour: "2-digit", minute: "2-digit", hour12: true}) : "-"}</td>

                    {/* <td className="p-3 border text-center">
                      {task.readAt ? new Date(task.readAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true}) : <span className="text-red-500">Unread</span>}
                    </td> */}
                    <td className="p-3 border text-center">{task.assignedBy}</td>


                    <td className="p-3 border text-center">{task.project_name}</td>
                    <td className="p-3 border text-left">
                      {task.task.split(" ").length > 5 ? (
                        <div className="flex items-center gap-2">
                          <span>{task.task.split(" ").slice(0, 5).join(" ")}...</span>
                          <button onClick={() => openPopup(task.task)}>
                            <FcInfo size={18} />
                          </button>
                        </div>
                      ) : (
                        task.task
                      )}
                    </td>


                    <td className="p-3 border text-center">
                           {task.deadline ? formatDate(task.deadline) : "-"}</td>



                    <td className="p-3 border text-center">
                      {task.attachment ? (
                        <a
                          href={`http://localhost:3004/uploads/${task.attachment}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          View
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>


                    {/* <td className="p-3 border text-center">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={task.progress || 0}
                          onChange={(e) => handleProgressChange(task._id, e.target.value)}
                          className="w-20 h-1.5"
                        />
                         <span className="ml-2 text-sm">{task.progress || 0}%</span>
                    </td> */}




           <td className="p-3 border text-center">
            <div className="flex items-center justify-center">
              <div className="flex items-center rounded-full bg-[#CDE6EC] shadow-md px-2 py-1 w-30 h-6 justify-between">
               {/* Minus Button */}
                 <button
                   onClick={() =>
                   handleProgressChange(task._id, Math.max((task.progress || 0) - 5, 0))
                   }
                   className="text-xl text-gray-600 hover:text-red-500 w-8 h-8 rounded-full flex items-center justify-center">
                   –
                 </button>

               {/* Progress Value */}
                 <span className="text-sl font-medium text-gray-800">
                     {task.progress || 0}%
                 </span>

               {/* Plus Button */}
                <button
                  onClick={() =>
                  handleProgressChange(task._id, Math.min((task.progress || 0) + 5, 100))
                  }
                  className="text-xl text-gray-600 hover:text-green-500 w-8 h-8 rounded-full flex items-center justify-center">
                  +
                  </button>
               </div>
             </div>
           </td>





                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center p-4 text-gray-600 bold italic">
                    No tasks assigned yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
         )}

        
        {employee?.role === "Employee TL" && activeTable === "Tasks Assigned By You (as TL)" && (
  <div className="mt-4">
    {/* <h2 className="text-xl font-semibold mb-2">Tasks Assigned By You (as TL)</h2> */}
    <div className="bg-white rounded-lg shadow p-4 overflow-auto">
      <table className="min-w-full text-sm border">
        <thead className="bg-[#5ed9de] text-gray-800 text-xs sm:text-sm">

          <tr>
            <th className="p-3 border">Date</th>
            <th className="p-3 border">Sent At</th>
            <th className="p-3 border">Assigned To</th>
            <th className="p-3 border">Project</th>
            <th className="p-3 border">Task</th>
            <th className="p-3 border">Deadline</th>
            <th className="p-3 border">Attachment</th>

        <th className="px-4 py-2 border-r">Progress</th>

          </tr>
        </thead>
        <tbody>
          {filteredTlTasks.length > 0 ? (
  filteredTlTasks.map((task, index) => (

              <tr key={index} className="hover:bg-gray-50">
                <td className="p-3 border text-center">
                  {new Date(task.createdAt).toLocaleDateString("en-IN")}
                </td>

               <td className="p-3 border text-center">
                   {task.time || "-"}
                </td>



                <td className="p-3 border text-center">{task.employee_name}</td>
                <td className="p-3 border text-center">{task.project_name}</td>
                <td className="p-3 border text-left">
                  {task.task.length > 40 ? (
                    <div className="flex items-center gap-2">
                      <span>{task.task.slice(0, 40)}...</span>
                      <button onClick={() => openPopup(task.task)}>
                        <FcInfo size={18} />
                      </button>
                    </div>
                  ) : (
                    task.task
                  )}
                </td>
                <td className="p-3 border text-center">
                  {task.deadline ? formatDate(task.deadline) : "-"}
                </td>
                <td className="p-3 border text-center">
                  {task.attachment ? (
                    <a
                      href={`http://localhost:3004/uploads/${task.attachment}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View
                    </a>
                  ) : (
                    "-"
                  )}
                </td>


                         <td className="px-4 py-2 border text-center">
  <div className="w-24 mx-auto">
    <div className="h-2 bg-gray-200 rounded-full">
      <div
        className="h-2 bg-green-500 rounded-full"
        style={{ width: `${task.progress || 0}%` }}
      ></div>
    </div>
    <div className="text-xs mt-1">{task.progress || 0}%</div>
  </div>
</td>


              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center p-4 text-gray-600 italic">
                No tasks assigned by you.
              </td>

      

            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
)}




      </div>



      {showForm && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg p-4 sm:p-6 w-[92%] max-w-xl sm:max-w-2xl shadow-lg">

            <h2 className="text-xl font-bold mb-4 text-[#32A9C7] text-center">Assign Task</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* <div>
                  <label className="block mb-1">Employee</label>
                  <select
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 p-2 rounded-md"
                  >
                    <option value="">Select</option>
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name}
                      </option>
                    ))}
                  </select>
                </div> */}



                

<div>
  <label className="block mb-1">Employee</label>

  <div className="relative">
    <select
      name="employeeId"
      value={formData.employeeId}
      onChange={handleChange}
      required
      className="w-full border border-gray-300 p-2 pr-8 rounded-md appearance-none bg-white"
    >
      <option value="">Select</option>
      {employees.map((emp) => (
        <option key={emp._id} value={emp._id}>
          {emp.name}
        </option>
      ))}
    </select>

    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl text-gray-500 pointer-events-none">
      <MdKeyboardArrowDown />
    </span>
  </div>
</div>



                <div>
                  <label className="block mb-1">Project(s)</label>
                  <Select
                    isMulti
                    options={projects.map((proj) => ({
                      value: proj.project_name || proj.name,
                      label: proj.project_name || proj.name,
                    }))}
                    value={formData.project}
                    onChange={(selected) => setFormData((prev) => ({ ...prev, project: selected }))}
                  />
                </div>


              </div>

              <div>
                <label className="block mb-1">Task Description</label>
                <textarea
                  name="taskDescription"
                  value={formData.taskDescription}
                  onChange={handleChange}
                  required
                  rows="2"
                  className="w-full border p-2 rounded-md"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Deadline</label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    // required
                    min={todayDate}
                    className="w-full border p-2 rounded-md"
                  />
                </div>

                <div>
                  <label className="block mb-1">Attachment</label>
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.pdf,.xls,.xlsx,.mp4,.mov,.avi"
                    onChange={(e) => setAttachment(e.target.files[0])}
                    className="w-full border p-2 rounded-md"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-4">

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Send Task
                </button>
                
              </div>
            </form>
          </div>
  </div>
)}





      {/* Task Description Popup */}
      {showPopup && (

       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
  <div className="relative bg-white rounded-2xl shadow-2xl p-4 sm:p-6 w-[90%] max-w-sm sm:max-w-lg md:max-w-xl lg:max-w-2xl">

    {/* Close Button */}
    <button
      onClick={closePopup}
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
    <div className="max-h-[70vh] overflow-y-auto pr-1">

      <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
        {selectedTask}
      </p>
    </div>
  </div>
       </div>

      )}
    </div>
    </div>
  );
}
