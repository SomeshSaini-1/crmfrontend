
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import EmployeeHeader from "../components/employee_header";
// import Select from "react-select";
// import { useNavigate } from "react-router-dom";
// import { FcInfo } from "react-icons/fc";

// import { FiClock } from "react-icons/fi";
// import { ToastContainer, toast } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';




// export default function EmployeeTimesheetsPage() {
//   const [formData, setFormData] = useState({ date: "", login: "", logout: "", project: [], hours: "", task: "", nextday: "",file: null, suggestion: "" });
//   const [tasks, setTasks] = useState([]);
//   const [employee, setEmployee] = useState(null);
//   const [projects, setProjects] = useState([]);
//   // const [showProfile, setShowProfile] = useState(false);
//   const navigate = useNavigate();
//   const [showModal, setShowModal] = useState(false);
//   const [selectedTask, setSelectedTask] = useState("");
//   const [selectedSuggestions, setSelectedSuggestions] = useState("");
//   const [selectedNextDayTask, setSelectedNextdayTask] = useState("");
//   const [selectedMonth, setSelectedMonth] = useState("");



// useEffect(() => {
//   fetchEmployeeData();
//   // fetchProjectData();
//   setTodayDate();
//   setSelectedMonth(new Date().toISOString().slice(0, 7));
// }, []);



// useEffect(() => {
//   const employeeEmail = localStorage.getItem("employeeEmail");
//   console.log("Stored Email:", employeeEmail); 
//   const today = new Date().toISOString().split("T")[0];

//   const loginTimeKey = `employeeLoginTime_${employeeEmail}`;
//   const loginDateKey = `loginDate_${employeeEmail}`;

//   const storedLoginTime = localStorage.getItem(loginTimeKey);
//   const storedLoginDate = localStorage.getItem(loginDateKey);

//   if (storedLoginDate === today && storedLoginTime) {
//     console.log("✅ Using stored login time");
//     setFormData((prevData) => ({
//       ...prevData,
//       date: today,
//       login: storedLoginTime,
//     }));
//   } else {
//     const now = new Date();
    
//     const formattedTime = `${String(now.getHours()).padStart(2, "0")}:${String(
//       now.getMinutes()
//     ).padStart(2, "0")}`;
//     console.log(" Saving new login time:", formattedTime);

//     localStorage.setItem(loginTimeKey, formattedTime);
//     localStorage.setItem(loginDateKey, today);

//     setFormData((prevData) => ({
//       ...prevData,
//       date: today,
//       login: formattedTime,
//     }));
//   }
// }, []);



//   useEffect(() => {
//     if (employee?._id) {
//       fetchEmployeeTimesheets();
//     }
//   }, [employee]);


//   const setTodayDate = () => {
//     const today = new Date();
//     const formatted = today.toISOString().split("T")[0];
//     setFormData((prev) => ({ ...prev, date: formatted }));
//   };


//   const fetchEmployeeData = async () => {
//     try {
//       const res = await axios.post("http://localhost:3004/view-employee");
//       if (res.data.success && res.data.data?.length) {
//         const email = localStorage.getItem("employeeEmail");
//         const matchedEmployee = res.data.data.find(emp => emp.email === email);
//         if (matchedEmployee) {
//           setEmployee(matchedEmployee);
//         }
//       }
//     } catch (err) {
//       console.error("Error fetching employee data:", err);
//     }
//   };


//   // const fetchProjectData = async () => {
//   //   try {
//   //     const res = await axios.post("http://localhost:3004/view-project");
//   //     if (res.data.success) {
//   //       setProjects(res.data.data);
//   //     }
//   //   } catch (err) {
//   //     console.error("Error fetching project list:", err);
//   //   }
//   // };


//   const fetchEmployeeTimesheets = async () => {
//     try {
//       const res = await axios.post("http://localhost:3004/view-employee-timesheet", {
//         id: employee._id
//       });
//       if (res.data.success) {
//         setTasks(res.data.data);
//       }
//     } catch (err) {
//       console.error("Error fetching employee timesheets:", err);
//     }
//   };

//   const formatTime = (value) => {
//     let digits = value.replace(/[^0-9]/g, "");
//     if (digits.length >= 3) {
//       return digits.slice(0, 2) + ":" + digits.slice(2, 4);
//     }
//     return digits;
//   };

//   const calculateWorkingHours = (login, logout) => {
//     if (!login.includes(":") || !logout.includes(":")) return "";

//     const [loginH, loginM] = login.split(":").map(Number);
//     const [logoutH, logoutM] = logout.split(":").map(Number);

//     const loginDate = new Date(0, 0, 0, loginH, loginM);
//     const logoutDate = new Date(0, 0, 0, logoutH, logoutM);

//     let diff = (logoutDate - loginDate) / 60000;
//     if (diff < 0) diff += 12 * 60;

//     const hours = Math.floor(diff / 60).toString().padStart(2, "0");
//     const minutes = (diff % 60).toString().padStart(2, "0");

//     return `${hours}:${minutes}`;
//   };

//   const handleTimeChange = (type, value) => {
//     const formatted = formatTime(value);
//     const updatedFormData = { ...formData, [type]: formatted };

//     if (type === "login" || type === "logout") {
//       const working = calculateWorkingHours(
//         type === "login" ? formatted : formData.login,
//         type === "logout" ? formatted : formData.logout
//       );
//       updatedFormData.hours = working;
//     }

//     setFormData(updatedFormData);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//  const handleSubmit = async () => {
//   const { project, login, logout, hours, task, nextday, file, suggestion } = formData;

//   if (!project.length || !login || !logout || !hours || !task || !nextday) {
//     // alert("Please fill all required fields");
//     toast.error("Please fill all required fields!", {
//   position: "top-center",
//   autoClose: 3000,
// });

//     return;
//   }

//   const projectNames = project.map((p) => p.value).join(", ");

//   const form = new FormData();
//   form.append("project_name", projectNames);
//   form.append("login_time", login);
//   form.append("logout_time", logout);
//   form.append("hours", hours);
//   form.append("task", task);
//   form.append("next_day_task", nextday);
//   form.append("employeeId", employee._id);
  
//   // Add employee_name to form
//   form.append("employee_name", employee.name);

//   if (file) form.append("attachment", file);
//   if (suggestion) form.append("suggestions", suggestion);

//   try {
//     const res = await axios.post("http://localhost:3004/add-employee-timesheet", form, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });

//     if (res.data.success) {
//       // alert("Timesheet submitted successfully!");
//       toast.success("Timesheet submitted successfully!");

//       fetchEmployeeTimesheets();
//       setFormData({
//         date: formData.date,
//         login: "",
//         logout: "",
//         project: [],
//         hours: "",
//         task: "",
//         nextday: "",
//         file: null,
//         suggestion: "",
//       });
//     } else {
//       // alert("Failed to submit timesheet.");
//       toast.error("Failed to submit timesheet.");

//     }
//   } catch (err) {
//     console.error("Submission error:", err);
//     // alert("Something went wrong while submitting.");
//     toast.error("Something went wrong while submitting.");

//   }
// };



//   const handleCancel = () => {
//     setFormData({ date: formData.date, login: "", logout: "", project: [], hours: "", task: "", nextday: "" });
//   };

//   const profileImage = employee?.profileImage || "/user1.jpg";


//    const openModal = (task, suggestions,next_day_task) => {
//     setSelectedTask(task);
//     setSelectedSuggestions(suggestions)
//     setSelectedNextdayTask(next_day_task)
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setSelectedTask("");
//     setSelectedSuggestions("");
//     setSelectedNextdayTask("");
//   };


//     const filteredTasks = selectedMonth
//     ? tasks.filter((entry) => {
//         const entryDate = new Date(entry.createdAt);
//         const entryMonth = `${entryDate.getFullYear()}-${String(
//           entryDate.getMonth() + 1
//         ).padStart(2, "0")}`;
//         return entryMonth === selectedMonth;
//       })
//     : tasks;


  
//   return (
//     <div className="min-h-screen bg-[#CDE6EC] font-sans text-gray-800">
//       <EmployeeHeader />
//       <div className="p-8">


//         {/* <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} /> */}


//         {/* Edmployee Info Crd  */}

//         <div className="bg-white shadow-xl rounded-2xl p-6 mb-8 border-l-4 border-[#32A9C7] relative">
//           <div className="absolute top-4 right-4">
//             <img src={profileImage} alt="Employee" className="w-16 h-16 rounded-full border-2 border-blue-400 object-cover cursor-pointer" onClick={() => navigate("/employeedeatilsemployeesidepage")} />
//           </div>
//           <h2 className="text-2xl font-bold">Welcome, {employee?.name || "Employee"}</h2>
//           <p className="text-sm text-gray-600 mt-1"><span className="font-bold">Designation:</span> {employee?.designation || "N/A"}</p>
//           <p className="text-sm text-gray-600"><span className="font-bold">Projects:</span> {employee?.project || "N/A"}</p>

//           <p className="text-sm text-gray-600"><span className="font-bold">Email:</span> {employee?.email || "N/A"}</p>

//           <p className="text-sm text-gray-600"><span className="font-bold">Employee ID:</span> {employee?.employeeId || employee?.id || "N/A"}</p>
//         </div>

//         <div className="space-y-6">


//           {/* Timesheets Form  */}

//           <div className="bg-white border-l-4 border-[#32A9C7] p-6 rounded-2xl shadow-md">
//             <h3 className="text-xl font-semibold mb-4 text-[#32A9C7]">Submit Your Timesheet</h3>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//               <div>
//                 <label className="text-sm font-medium">Date</label>
//                   <input
//                     type="date"
//                     name="date"
//                     value={formData.date}
//                     readOnly
//                     className="mt-1 w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-600 shadow-sm cursor-not-allowed"
//                   />
//               </div>

//               <div>
//                 <label className="text-sm font-medium">Login time</label>
//                   <input
//                      type="text"
//                      placeholder="HH:MM"
//                      maxLength={5}
//                      value={formData.login}
//                      readOnly
//                      className="mt-1 w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-600 shadow-sm cursor-not-allowed"
//                   />
//               </div>

//               {/* <div>
//                 <label className="text-sm font-medium">Logout time</label>
//                   <input
//                      type="text"
//                      placeholder="HH:MM"
//                      maxLength={5}
//                      value={formData.logout}
//                      onChange={(e) => handleTimeChange("logout", e.target.value)}
//                      className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
//                   />
//               </div> */}


// <div className="relative w-full">
//   <label className="text-sm font-medium">Logout time</label>
//   <div className="mt-1 relative">
//     {/* Editable Text Input */}
//     <input
//       type="text"
//       placeholder="HH:MM"
//       maxLength={5}
//       value={formData.logout}
//       onChange={(e) => handleTimeChange("logout", e.target.value)}
//       className="w-full pr-12 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
//     />

//     {/* Clock Icon Button */}
//     <button
//       type="button"
//       onClick={() => {
//         const now = new Date();
//         const currentTime = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
//         handleTimeChange("logout", currentTime);
//       }}
//       className="absolute right-3 top-1/2 -translate-y-1/2 text-white bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg flex items-center justify-center"
//     >
//       <FiClock size={22} />
//     </button>
//   </div>
// </div>







//               <div>
//                 <label className="text-sm font-medium">Working Hours</label>
//                   <input
//                     type="text"
//                     value={formData.hours}
//                     readOnly
//                     className="mt-1 w-full px-4 py-2 border bg-gray-100 text-gray-600 rounded-lg shadow-sm cursor-not-allowed"
//                   />
//               </div>

//               {/* <div>
//                 <label className="text-sm font-medium">Project(s)</label>
//                   <Select
//                    isMulti
//                    options={projects.map(proj => ({ value: proj.project_name, label: proj.project_name }))}
//                    value={formData.project}
//                    onChange={(selectedOptions) =>
//                    setFormData(prev => ({
//                    ...prev,
//                    project: selectedOptions
//                    }))
//                    }
//                    className="mt-1"
//                    />
//               </div> */}


//               <div>
//   <label className="text-sm font-medium">Project(s)</label>
//   <Select
//     isMulti
//     options={
//       employee?.project
//         ? employee.project.split(",").map((proj) => ({
//             value: proj.trim(),
//             label: proj.trim(),
//           }))
//         : []
//     }
//     value={formData.project}
//     onChange={(selectedOptions) =>
//       setFormData((prev) => ({
//         ...prev,
//         project: selectedOptions,
//       }))
//     }
//     className="mt-1"
//   />
// </div>


//             </div>

//             <div className="mt-4">
//               <label className="text-sm font-medium">Today Task</label>
//                 <textarea
//                   name="task"
//                   rows="3"
//                   value={formData.task}
//                   onChange={handleChange}
//                   className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
//                 />

//             </div>

//             <div className="mt-4">
//               <label className="text-sm font-medium">Attachment (optional)
//                  {/* (image/pdf/excel/video) */}
//                  </label>
//               <input type="file"
//                 onChange={(e) =>
//                 setFormData((prev) => ({
//                 ...prev,
//                 file: e.target.files[0]
//                }))
//                }
//               accept=".png,.jpg,.jpeg,.pdf,.xlsx,.xls,.csv,.mp4,.mov,.avi"
//               className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm"/>
//             </div>

//             <div className="mt-4">
//               <label className="text-sm font-medium">Next Day Task</label>
//                <textarea
//                 name="nextday"
//                 rows="2"
//                 value={formData.nextday}
//                 onChange={handleChange}
//                 className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
//               />
//             </div>

//             <div className="mt-4">
//               <label className="text-sm font-medium">Suggestion (optional)</label>
//                 <textarea
//                   name="suggestion"
//                   rows="2"
//                   value={formData.suggestion}
//                   onChange={handleChange}
//                   className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"/>
//             </div>

//              <div className="mt-6 flex justify-end gap-3">
//               <button
//                 onClick={handleCancel}
//                 className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 shadow"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSubmit}
//                 className="px-4 py-2 rounded-lg bg-[#32A9C7] hover:bg-[#2b97b1] text-white shadow-lg"
//               >
//                 Submit
//               </button>
//             </div>

//           </div>

 


//           {/* Task Table */}
//           <div className="bg-white border-l-4 border-[#32A9C7] p-6 rounded-2xl shadow-md overflow-auto">

//            <div className="mb-4 flex justify-between items-center">
//             <h3 className="text-xl font-semibold text-[#32A9C7]">Submitted Tasks</h3>
//             <div>
//              <label className="text-sm font-semibold mr-2">Filter by Month:</label>
//                <input
//                  type="month"
//                  value={selectedMonth}
//                  onChange={(e) => setSelectedMonth(e.target.value)}
//                  className="border px-2 py-1 rounded"/>
//             </div>
//           </div>

//             <table className="w-full text-sm border">
//               <thead className="bg-[#5ed9de] text-gray-800">
//                 <tr>
//                   <th className="p-3 border">Date</th>
//                   <th className="p-3 border">Login Time</th>
//                   <th className="p-3 border">Logout Time</th>
//                   <th className="p-3 border">Total Hours</th>
//                   <th className="p-3 border">Project</th>
//                   <th className="p-3 border">Task</th>
//                   <th className="p-3 border">Attachments</th>
//                   <th className="p-3 border">Suggestions</th>
//                   <th className="p-3 border">Next Day Task</th>
//                 </tr>
//               </thead>

//               <tbody>
//     {filteredTasks.length > 0 ? (
//     filteredTasks.map((entry, index) => (
//       <tr key={index} className="hover:bg-gray-50">
//         <td className="p-3 border">{new Date(entry.createdAt).toLocaleDateString()}</td>
//         <td className="p-3 border">{entry.login_time}</td>
//         <td className="p-3 border">{entry.logout_time}</td>
//         <td className="p-3 border">{entry.hours}</td>
//         <td className="p-3 border">{entry.project_name}</td>

//         <td className="p-3 border">
//           {entry.task && entry.task.split(" ").length > 10 ? (
//             <div className="flex items-center space-x-2">
//               <span>{entry.task.split(" ").slice(0, 6).join(" ")}...</span>
//               <button
//                 onClick={() => openModal(entry.task)}
//                 className="text-blue-600 hover:text-blue-800"
//               >
//                 <FcInfo size={18} />
//               </button>
//             </div>
//           ) : (
//             <span>{entry.task}</span>
//           )}
//         </td>

//         <td className="p-3 border">
//           {entry.attachment ? (
//             <a
//               href={`http://localhost:3004/uploads/${entry.attachment}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-blue-600"
//             >
//               View
//             </a>
//           ) : (
//             <span className="flex justify-center items-center h-full text-2xl">-</span>
//           )}
//         </td>

//         <td className="p-3 border">
//           {!entry.suggestions || entry.suggestions.trim() === "" ? (
//             <div className="flex justify-center items-center h-full">
//               <span className="text-2xl">-</span>
//             </div>
//           ) : entry.suggestions.split(" ").length > 10 ? (
//             <div className="flex items-center space-x-2">
//               <span>{entry.suggestions.split(" ").slice(0, 6).join(" ")}...</span>
//               <button
//                 onClick={() => openModal(entry.suggestions)}
//                 className="text-blue-600 hover:text-blue-800"
//               >
//                 <FcInfo size={18} />
//               </button>
//             </div>
//           ) : (
//             <span>{entry.suggestions}</span>
//           )}
//         </td>

//         <td className="p-3 border">
//           {entry.next_day_task.split(" ").length > 10 ? (
//             <div className="flex items-center space-x-2">
//               <span>{entry.next_day_task.split(" ").slice(0, 6).join(" ")}...</span>
//               <button
//                 onClick={() => openModal(entry.next_day_task)}
//                 className="text-blue-600 hover:text-blue-800"
//               >
//                 <FcInfo size={18} />
//               </button>
//             </div>
//           ) : (
//             <span>{entry.next_day_task}</span>
//           )}
//         </td>
//       </tr>
//     ))
//   ) : (
//     <tr>
//       <td colSpan="8" className="text-center p-4 text-gray-400">
//         No task submitted for selected month.
//       </td>
//     </tr>
//   )}
//               </tbody>
//             </table>

//           </div>

//         </div>

//          {showModal && (

//            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//              <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-xl w-full transition-all duration-300 scale-100">
//         {/* Close Button */}
//              <button
//                  onClick={closeModal}
//                  className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl"
//                  aria-label="Close"
//               >
//                   &times;
//               </button>

//         {/* Header */}
//     <div className="flex items-center space-x-2 mb-4">
//       <div className="w-2 h-6 bg-blue-500 rounded-sm"></div>
//       <h2 className="text-xl font-semibold text-gray-800 tracking-wide">
//         Task Description
//       </h2>
//     </div>

//     {/* Task Content */}
//     <div className="max-h-72 overflow-y-auto pr-1">
//       <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
//         {[selectedTask, selectedSuggestions,selectedNextDayTask ]}
//       </p>
//     </div>
//   </div>
//           </div>




//         )}

//       </div>
//     </div>
//   );
// }




import React, { useState, useEffect } from "react";
import axios from "axios";
import EmployeeHeader from "../components/employee_header";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { FcInfo } from "react-icons/fc";

import { FiClock } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';




export default function EmployeeTimesheetsPage() {
  const [formData, setFormData] = useState({ date: "", login: "", logout: "", project: [], hours: "", task: "", nextday: "",file: null, suggestion: "" });
  const [tasks, setTasks] = useState([]);
  const [employee, setEmployee] = useState(null);
  const [projects, setProjects] = useState([]);
  // const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState("");
  const [selectedSuggestions, setSelectedSuggestions] = useState("");
  const [selectedNextDayTask, setSelectedNextdayTask] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");



useEffect(() => {
  fetchEmployeeData();
  // fetchProjectData();
  setTodayDate();
  setSelectedMonth(new Date().toISOString().slice(0, 7));
}, []);



useEffect(() => {
  const employeeEmail = localStorage.getItem("employeeEmail");
  const today = new Date().toISOString().split("T")[0];

  const loginTimeKey = `employeeLoginTime_${employeeEmail}`;
  const loginDateKey = `loginDate_${employeeEmail}`;

  let storedLoginTime = localStorage.getItem(loginTimeKey);
  let storedLoginDate = localStorage.getItem(loginDateKey);

  if (storedLoginDate !== today || !storedLoginTime) {
    // ✅ New day OR no login stored yet → set fresh login time
    const now = new Date();
    storedLoginTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    localStorage.setItem(loginTimeKey, storedLoginTime);
    localStorage.setItem(loginDateKey, today);
  }

  // ✅ Always use localStorage time, never overwrite for the same day
  setFormData((prevData) => ({
    ...prevData,
    date: today,
    login: storedLoginTime,
  }));
}, []);





  useEffect(() => {
    if (employee?._id) {
      fetchEmployeeTimesheets();
    }
  }, [employee]);


  const setTodayDate = () => {
    const today = new Date();
    const formatted = today.toISOString().split("T")[0];
    setFormData((prev) => ({ ...prev, date: formatted }));
  };


  const fetchEmployeeData = async () => {
    try {
      const res = await axios.post("http://localhost:3004/view-employee");
      if (res.data.success && res.data.data?.length) {
        const email = localStorage.getItem("employeeEmail");
        const matchedEmployee = res.data.data.find(emp => emp.email === email);
        if (matchedEmployee) {
          setEmployee(matchedEmployee);
        }
      }
    } catch (err) {
      console.error("Error fetching employee data:", err);
    }
  };


  // const fetchProjectData = async () => {
  //   try {
  //     const res = await axios.post("http://localhost:3004/view-project");
  //     if (res.data.success) {
  //       setProjects(res.data.data);
  //     }
  //   } catch (err) {
  //     console.error("Error fetching project list:", err);
  //   }
  // };


  const fetchEmployeeTimesheets = async () => {
    try {
      const res = await axios.post("http://localhost:3004/view-employee-timesheet", {
        id: employee._id
      });
      if (res.data.success) {
        setTasks(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching employee timesheets:", err);
    }
  };

  const formatTime = (value) => {
    let digits = value.replace(/[^0-9]/g, "");
    if (digits.length >= 3) {
      return digits.slice(0, 2) + ":" + digits.slice(2, 4);
    }
    return digits;
  };

  const calculateWorkingHours = (login, logout) => {
    if (!login.includes(":") || !logout.includes(":")) return "";

    const [loginH, loginM] = login.split(":").map(Number);
    const [logoutH, logoutM] = logout.split(":").map(Number);

    const loginDate = new Date(0, 0, 0, loginH, loginM);
    const logoutDate = new Date(0, 0, 0, logoutH, logoutM);

    let diff = (logoutDate - loginDate) / 60000;
    if (diff < 0) diff += 12 * 60;

    const hours = Math.floor(diff / 60).toString().padStart(2, "0");
    const minutes = (diff % 60).toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  const handleTimeChange = (type, value) => {
    const formatted = formatTime(value);
    const updatedFormData = { ...formData, [type]: formatted };

    if (type === "login" || type === "logout") {
      const working = calculateWorkingHours(
        type === "login" ? formatted : formData.login,
        type === "logout" ? formatted : formData.logout
      );
      updatedFormData.hours = working;
    }

    setFormData(updatedFormData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async () => {
  const { project, login, logout, hours, task, nextday, file, suggestion } = formData;

  if (!project.length || !login || !logout || !hours || !task || !nextday) {
    // alert("Please fill all required fields");
    toast.error("Please fill all required fields!", {
  position: "top-center",
  autoClose: 3000,
});

    return;
  }

  const projectNames = project.map((p) => p.value).join(", ");

  const form = new FormData();
  form.append("project_name", projectNames);
  form.append("login_time", login);
  form.append("logout_time", logout);
  form.append("hours", hours);
  form.append("task", task);
  form.append("next_day_task", nextday);
  form.append("employeeId", employee._id);
  
  // Add employee_name to form
  form.append("employee_name", employee.name);

  if (file) form.append("attachment", file);
  if (suggestion) form.append("suggestions", suggestion);

  try {
    const res = await axios.post("http://localhost:3004/add-employee-timesheet", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data.success) {
      // alert("Timesheet submitted successfully!");
      toast.success("Timesheet submitted successfully!");

      fetchEmployeeTimesheets();
      setFormData({
        date: formData.date,
        login: "",
        logout: "",
        project: [],
        hours: "",
        task: "",
        nextday: "",
        file: null,
        suggestion: "",
      });
    } else {
      // alert("Failed to submit timesheet.");
      toast.error("Failed to submit timesheet.");

    }
  } catch (err) {
    console.error("Submission error:", err);
    // alert("Something went wrong while submitting.");
    toast.error("Something went wrong while submitting.");

  }
};



  const handleCancel = () => {
    setFormData({ date: formData.date, login: "", logout: "", project: [], hours: "", task: "", nextday: "" });
  };

  const profileImage = employee?.profileImage || "/user1.jpg";


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


    const filteredTasks = selectedMonth
    ? tasks.filter((entry) => {
        const entryDate = new Date(entry.createdAt);
        const entryMonth = `${entryDate.getFullYear()}-${String(
          entryDate.getMonth() + 1
        ).padStart(2, "0")}`;
        return entryMonth === selectedMonth;
      })
    : tasks;


  
  return (
    <div className="min-h-screen bg-[#CDE6EC] font-sans text-gray-800">
      <EmployeeHeader />
      <div className="p-8">


        {/* <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} /> */}


        {/* Edmployee Info Crd  */}

        <div className="bg-white shadow-xl rounded-2xl p-6 mb-8 border-l-4 border-[#32A9C7] relative">
          <div className="absolute top-4 right-4">
            <img src={profileImage} alt="Employee" className="w-16 h-16 rounded-full border-2 border-blue-400 object-cover cursor-pointer" onClick={() => navigate("/employeedeatilsemployeesidepage")} />
          </div>
          <h2 className="text-2xl font-bold">
             {/* Mobile view (Welcome + Name alag line me) */}
              <span className="block sm:hidden">
                 Welcome,
                <span className="block">{employee?.name || "Employee"}</span>
              </span>

              {/* Desktop/Laptop view (Welcome, Name ek hi line me) */}
                 <span className="hidden sm:inline">
                    Welcome, {employee?.name || "Employee"}
                 </span>
          </h2>

          <p className="text-sm text-gray-600 mt-1"><span className="font-bold">Designation:</span> {employee?.designation || "N/A"}</p>
          <p className="text-sm text-gray-600"><span className="font-bold">Projects:</span> {employee?.project || "N/A"}</p>

          <p className="text-sm text-gray-600"><span className="font-bold">Email:</span> {employee?.email || "N/A"}</p>

          <p className="text-sm text-gray-600"><span className="font-bold">Employee ID:</span> {employee?.employeeId || employee?.id || "N/A"}</p>
        </div>

        <div className="space-y-6">


          {/* Timesheets Form  */}

          <div className="bg-white border-l-4 border-[#32A9C7] p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-[#32A9C7]">Submit Your Timesheet</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div>
                <label className="text-sm font-medium">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    readOnly
                    className="mt-1 w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-600 shadow-sm cursor-not-allowed"
                  />
              </div>

              <div>
                <label className="text-sm font-medium">Login time</label>
                  <input
  type="text"
  placeholder="HH:MM"
  maxLength={5}
  value={formData.login}
  onChange={(e) => handleTimeChange("login", e.target.value)}
  className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
/>

              </div>

              {/* <div>
                <label className="text-sm font-medium">Logout time</label>
                  <input
                     type="text"
                     placeholder="HH:MM"
                     maxLength={5}
                     value={formData.logout}
                     onChange={(e) => handleTimeChange("logout", e.target.value)}
                     className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
              </div> */}


<div className="relative w-full">
  <label className="text-sm font-medium">Logout time</label>
  <div className="mt-1 relative">
    {/* Editable Text Input */}
    <input
      type="text"
      placeholder="HH:MM"
      maxLength={5}
      value={formData.logout}
      onChange={(e) => handleTimeChange("logout", e.target.value)}
      className="w-full pr-12 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
    />

    {/* Clock Icon Button */}
    <button
      type="button"
      onClick={() => {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
        handleTimeChange("logout", currentTime);
      }}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-white bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg flex items-center justify-center"
    >
      <FiClock size={22} />
    </button>
  </div>
</div>







              <div>
                <label className="text-sm font-medium">Working Hours</label>
                  <input
                    type="text"
                    value={formData.hours}
                    readOnly
                    className="mt-1 w-full px-4 py-2 border bg-gray-100 text-gray-600 rounded-lg shadow-sm cursor-not-allowed"
                  />
              </div>

              {/* <div>
                <label className="text-sm font-medium">Project(s)</label>
                  <Select
                   isMulti
                   options={projects.map(proj => ({ value: proj.project_name, label: proj.project_name }))}
                   value={formData.project}
                   onChange={(selectedOptions) =>
                   setFormData(prev => ({
                   ...prev,
                   project: selectedOptions
                   }))
                   }
                   className="mt-1"
                   />
              </div> */}


              <div>
  <label className="text-sm font-medium">Project(s)</label>
  <Select
    isMulti
    options={
      employee?.project
        ? employee.project.split(",").map((proj) => ({
            value: proj.trim(),
            label: proj.trim(),
          }))
        : []
    }
    value={formData.project}
    onChange={(selectedOptions) =>
      setFormData((prev) => ({
        ...prev,
        project: selectedOptions,
      }))
    }
    className="mt-1"
  />
</div>


            </div>

            <div className="mt-4">
              <label className="text-sm font-medium">Today Task</label>
                <textarea
                  name="task"
                  rows="3"
                  value={formData.task}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />

            </div>

            <div className="mt-4">
              <label className="text-sm font-medium">Attachment (optional)
                 {/* (image/pdf/excel/video) */}
                 </label>
              <input type="file"
                onChange={(e) =>
                setFormData((prev) => ({
                ...prev,
                file: e.target.files[0]
               }))
               }
              accept=".png,.jpg,.jpeg,.pdf,.xlsx,.xls,.csv,.mp4,.mov,.avi"
              className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm"/>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium">Next Day Task</label>
               <textarea
                name="nextday"
                rows="2"
                value={formData.nextday}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium">Suggestion (optional)</label>
                <textarea
                  name="suggestion"
                  rows="2"
                  value={formData.suggestion}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"/>
            </div>

             <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 shadow"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-lg bg-[#32A9C7] hover:bg-[#2b97b1] text-white shadow-lg"
              >
                Submit
              </button>
            </div>

          </div>

 


          {/* Task Table */}
          <div className="bg-white border-l-4 border-[#32A9C7] p-4 md:p-6 rounded-2xl shadow-md">
  {/* Header */}
  <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
    <h3 className="text-lg md:text-xl font-semibold text-[#32A9C7]">
      Submitted Tasks
    </h3>
    <div className="flex items-center gap-2 text-sm">
      <label className="font-semibold">Filter by Month:</label>
      <input
        type="month"
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        className="border px-2 py-1 rounded"
      />
    </div>
  </div>

  {/* Table Wrapper for Responsiveness */}
  <div className="overflow-x-auto">
    <table className="w-full min-w-[900px] text-xs md:text-sm border">
      <thead className="bg-[#5ed9de] text-gray-800">
        <tr>
          <th className="p-2 md:p-3 border whitespace-nowrap">Date</th>
          <th className="p-2 md:p-3 border whitespace-nowrap">Login Time</th>
          <th className="p-2 md:p-3 border whitespace-nowrap">Logout Time</th>
          <th className="p-2 md:p-3 border whitespace-nowrap">Total Hours</th>
          <th className="p-2 md:p-3 border whitespace-nowrap">Project</th>
          <th className="p-2 md:p-3 border whitespace-nowrap">Task</th>
          <th className="p-2 md:p-3 border whitespace-nowrap">Attachments</th>
          <th className="p-2 md:p-3 border whitespace-nowrap">Suggestions</th>
          <th className="p-2 md:p-3 border whitespace-nowrap">Next Day Task</th>
        </tr>
      </thead>

      <tbody>
        {filteredTasks.length > 0 ? (
          filteredTasks.map((entry, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="p-2 md:p-3 border whitespace-nowrap">
                {new Date(entry.createdAt).toLocaleDateString()}
              </td>
              <td className="p-2 md:p-3 border whitespace-nowrap">
                {entry.login_time}
              </td>
              <td className="p-2 md:p-3 border whitespace-nowrap">
                {entry.logout_time}
              </td>
              <td className="p-2 md:p-3 border whitespace-nowrap">
                {entry.hours}
              </td>
              <td className="p-2 md:p-3 border whitespace-nowrap">
                {entry.project_name}
              </td>

              {/* Task */}
              <td className="p-2 md:p-3 border">
                {entry.task && entry.task.split(" ").length > 10 ? (
                  <div className="flex items-center space-x-2">
                    <span>
                      {entry.task.split(" ").slice(0, 6).join(" ")}...
                    </span>
                    <button
                      onClick={() => openModal(entry.task)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FcInfo size={18} />
                    </button>
                  </div>
                ) : (
                  <span>{entry.task}</span>
                )}
              </td>

              {/* Attachments */}
              <td className="p-2 md:p-3 border text-center">
                {entry.attachment ? (
                  <a
                    href={`http://localhost:3004/uploads/${entry.attachment}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600"
                  >
                    View
                  </a>
                ) : (
                  <span className="text-lg">-</span>
                )}
              </td>

              {/* Suggestions */}
              <td className="p-2 md:p-3 border">
                {!entry.suggestions || entry.suggestions.trim() === "" ? (
                  <div className="text-center text-lg">-</div>
                ) : entry.suggestions.split(" ").length > 10 ? (
                  <div className="flex items-center space-x-2">
                    <span>
                      {entry.suggestions.split(" ").slice(0, 6).join(" ")}...
                    </span>
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

              {/* Next Day Task */}
              <td className="p-2 md:p-3 border">
                {entry.next_day_task.split(" ").length > 10 ? (
                  <div className="flex items-center space-x-2">
                    <span>
                      {entry.next_day_task.split(" ").slice(0, 6).join(" ")}...
                    </span>
                    <button
                      onClick={() => openModal(entry.next_day_task)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FcInfo size={18} />
                    </button>
                  </div>
                ) : (
                  <span>{entry.next_day_task}</span>
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan="9"
              className="text-center p-4 text-gray-400 text-sm md:text-base"
            >
              No task submitted for selected month.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>


        </div>

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
        Full Description
      </h2>
    </div>

    {/* Task Content */}
    <div className="max-h-72 overflow-y-auto pr-1">
      <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
        {[selectedTask, selectedSuggestions,selectedNextDayTask ]}
      </p>
    </div>
  </div>
          </div>




        )}

      </div>
    </div>
  );
}


