
import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminHeader from "../components/admin_header";
import Select from "react-select";
import { MdOutlineAddTask } from "react-icons/md";
import { FcInfo } from "react-icons/fc";

import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';



export default function AdminSendTaskForm() {
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);


  const formatDate = (dateString) => {
       if (!dateString) return "-";
       const date = new Date(dateString);
       const day = String(date.getDate()).padStart(2, '0');
       const month = String(date.getMonth() + 1).padStart(2, '0');
       const year = date.getFullYear();
       return `${day}-${month}-${year}`;
       };



  const [formData, setFormData] = useState({
      employeeId: "",
      taskDescription: "",
      deadline: "",
      project: [],
      });

  const [attachment, setAttachment] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTask, setSelectedTask] = useState("");
  const [searchTerm, setSearchTerm] = useState("");  // for name search
  const [projectFilter, setProjectFilter] = useState(""); // for project filter
  const todayDate = new Date().toISOString().split("T")[0];




  // Fetch employees, projects, tasks
  useEffect(() => {
    fetchEmployees();
    fetchProjects();
    fetchTasks();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.post("http://localhost:3004/view-employee");
      if (res.data.success) setEmployees(res.data.data);
    } catch (err) {
      console.error("Failed to fetch employees", err);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedEmp = employees.find((emp) => emp._id === formData.employeeId);
    if (!selectedEmp) return toast.error("Employee not found");

     console.log("employeeId sending:", formData.employeeId);


    try {
      const data = new FormData();
      data.append("project_name", formData.project.map(p => p.value).join(", "));
      data.append("employee_name", selectedEmp.name);
      data.append("task", formData.taskDescription);
      data.append("deadline", formData.deadline);
      data.append("employeeId", formData.employeeId);


      //  Admin name from localStorage 
      const adminName = localStorage.getItem("adminName") || "Unknown Admin";
    data.append("assignedBy", adminName);

      //  Add current time
    const currentTime = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
     });
    data.append("time", currentTime);

    if (attachment) data.append("attachment", attachment);

    const res = await axios.post("http://localhost:3004/assign-task-admin", data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.data.success) {
      
        toast.success("Task sent successfully!", { autoClose:2000});
        setFormData({ employeeId:"", taskDescription: "", deadline: "", project: [] });
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


  const openPopup = (desc) => {
  setSelectedTask(desc);
  setShowPopup(true);
};

const closePopup = () => {
  setShowPopup(false);
  setSelectedTask("");
};



  return (
    <div className="min-h-screen bg-[#CDE6EC] flex flex-col">
      <AdminHeader />

      

      {/* Header */}

      <div className="bg-white sticky top-12 z-20 shadow px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Assign Tasks</h1>

        <div className="flex flex-col md:flex-row justify-between items-center gap-2 px-6 mt-3">
          <input
              type="text"
              placeholder="Search by Employee Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded-md w-full md:w-1/3 shadow-sm"
          />

          <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="px-4 py-2 border rounded-md w-full md:w-1/3 shadow-sm"
          >

           <option value="">All Projects</option>
                {[...new Set(tasks.map((task) => task.project_name))].map((proj) => (
           <option key={proj} value={proj}>
                 {proj}
           </option>
              ))}
          </select>

         <button
             onClick={() => {
             setSearchTerm("");
             setProjectFilter("");
             }}
             className="bg-gray-300 text-gray-800 px-3 py-2 rounded-md shadow hover:bg-gray-400"
         >Reset Filters
         </button>

        </div>

        <button
          onClick={() => setShowForm(true)}
          className="bg-[#32A9C7] text-white px-4 py-2 rounded-md hover:bg-[#2588a0] flex items-center gap-2"
        >
          <MdOutlineAddTask className="text-xl" />
          Assign New Task
        </button>

      </div>

      {/*  Task Table */}

        <div className=" bg-white rounded-lg shadow p-3 m-5 overflow-auto">
          <table className="min-w-full text-sm border">

            <thead className="bg-[#5ed9de] text-gray-800">

         {/* <div className="p-6 overflow-x-auto">
            <table className="min-w-full bg-white border shadow rounded-lg">
               <thead className="bg-[#5ed9de] text-gray-700"> */}
      <tr>
        <th className="px-4 py-2 border-r">S.N.</th>
        <th className="px-4 py-2 border-r">Date</th>
        <th className="px-4 py-2 border-r">Sent At</th>
        <th className="px-4 py-2 border-r">Assigned By</th>
        <th className="px-4 py-2 border-r">Employee Name</th>
        <th className="px-4 py-2 border-r">Project</th>
        <th className="px-4 py-2 border-r">Task</th>
        <th className="px-4 py-2 border-r">Deadline</th>
        <th className="px-4 py-2 border-r">Attachment</th>
        <th className="px-4 py-2 border-r">Progress</th>
      </tr>
            </thead>

            <tbody>

      {/* {tasks
        .filter((task) => {
          
          const nameMatch = task.employee_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());
          const projectMatch = projectFilter
            ? task.project_name?.toLowerCase() === projectFilter.toLowerCase()
            : true;
          return nameMatch && projectMatch;
        })
        .map((task, index) => (
          <tr key={task._id} className="border-t hover:bg-gray-50">
            <td className="px-4 py-2 border-r">{index + 1}</td>
            <td className="px-4 py-2 border-r">
              {new Date(task.createdAt).toLocaleDateString("en-IN")}
            </td>
            <td className="px-4 py-2 border-r">{task.time || "-"}</td>
            <td className="px-4 py-2 border-r">{task.assignedBy}</td>
            <td className="px-4 py-2 border-r">{task.employee_name}</td>
            <td className="px-4 py-2 border-r">{task.project_name}</td>
            <td className="px-4 py-2 border-r">
              {task.task.split(" ").length > 2 ? (
                <div className="flex items-center space-x-2">
                  <span>{task.task.split(" ").slice(0, 2).join(" ")}...</span>
                  <button
                    onClick={() => openPopup(task.task)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FcInfo size={18} />
                  </button>
                </div>
              ) : (
                <span>{task.task}</span>
              )}
            </td>
            <td className="px-4 py-2 border-r text-center">
                 {task.deadline ? formatDate(task.deadline) : "-"}
           </td>


            <td className="px-4 py-2 border-r">
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
                <div className="flex justify-center items-center h-full">
              <span>-</span>
            </div>
              )}
            </td>


            <td className="px-4 py-2 border-r text-center">
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
        ))}
      {tasks.length === 0 && (
        <tr>
          <td colSpan="8" className="text-center px-4 py-6 text-gray-500 italic">
            No tasks found.
          </td>
        </tr>
      )} */}


      
{tasks
  .filter((task) => {
    const nameMatch = task.employee_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const projectMatch = projectFilter
      ? task.project_name?.toLowerCase() === projectFilter.toLowerCase()
      : true;
    return nameMatch && projectMatch;
  })
  .map((task, index) => (
    <tr key={task._id} className="border-t hover:bg-gray-50">
      <td className="px-4 py-2 border-r">{index + 1}</td>
      <td className="px-4 py-2 border-r">
        {new Date(task.createdAt).toLocaleDateString("en-IN")}
      </td>
      <td className="px-4 py-2 border-r">{task.time || "-"}</td>
      <td className="px-4 py-2 border-r">{task.assignedBy}</td>
      <td className="px-4 py-2 border-r">{task.employee_name}</td>
      <td className="px-4 py-2 border-r">{task.project_name}</td>
      <td className="px-4 py-2 border-r">
        {task.task.split(" ").length > 2 ? (
          <div className="flex items-center space-x-2">
            <span>{task.task.split(" ").slice(0, 2).join(" ")}...</span>
            <button
              onClick={() => openPopup(task.task)}
              className="text-blue-600 hover:text-blue-800"
            >
              <FcInfo size={18} />
            </button>
          </div>
        ) : (
          <span>{task.task}</span>
        )}
      </td>
      <td className="px-4 py-2 border-r text-center">
        {task.deadline ? formatDate(task.deadline) : "-"}
      </td>
      <td className="px-4 py-2 border-r">
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
          <div className="flex justify-center items-center h-full">
            <span>-</span>
          </div>
        )}
      </td>
      <td className="px-4 py-2 border-r text-center">
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
  ))}

{/* Agar filter ke baad kuch nahi mila to yaha condition lagao */}
{tasks.filter((task) => {
  const nameMatch = task.employee_name
    ?.toLowerCase()
    .includes(searchTerm.toLowerCase());
  const projectMatch = projectFilter
    ? task.project_name?.toLowerCase() === projectFilter.toLowerCase()
    : true;
  return nameMatch && projectMatch;
}).length === 0 && (
  <tr>
    <td colSpan="10" className="text-center px-4 py-6 text-gray-500 italic">
      {searchTerm
        ? "No task assign this employee."
        : "No tasks found."}
    </td>
  </tr>
)}



            </tbody>

          </table>

        </div>


      {/* Popup Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-[#32A9C7] text-center">Assign Task</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
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
                  className="bg-gray-400 text-white px-6 py-1 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-[#32A9C7] text-white px-5 py-1.5 rounded hover:bg-[#2e778a]"
                >
                  Send Task
                </button>
                
              </div>
            </form>

          </div>
        </div>
      )}

      {/* All info Icon popup  */}

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
  <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-xl w-full transition-all duration-300 scale-100">
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
    <div className="max-h-72 overflow-y-auto pr-1">
      <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
        {selectedTask}
      </p>
    </div>
  </div>
       </div>
         
        )}


    </div>
  );
}
