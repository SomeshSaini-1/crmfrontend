
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import EmployeeHeader from "../components/employee_header";
// import { FcInfo } from "react-icons/fc";

// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";


// export default function EmployeeLeaveRequestPage() {
//   const [leaveRequest, setLeaveRequest] = useState({ from: "", to: "", reason: "", file: null, leaveType: "Casual Leave" });
//   const [leaveRequests, setLeaveRequests] = useState([]);
//   const [employee, setEmployee] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedReason, setSelectedReason] = useState("");
//   const [leaveStats, setLeaveStats] = useState({ casual: 0, sick: 0 });
//   const [refresh, setRefresh] = useState(false); // isse re-render trigger hoga
//   const [selectedMonth, setSelectedMonth] = useState("");
//   const currentYear = new Date().getFullYear();
//   const defaultMonthInputValue = `${currentYear}-01`;

//   const [data ,setdata] = useState({ sick : 5, casual :12 })


  
  
  

  

//     // Fetch employee data on mount
//     useEffect(() => {
//     fetchEmployeeData();
//     // setSelectedMonth(new Date().toISOString().slice(0, 7)); 

//     }, []);

//     // Fetch leave requests after employee is loaded
//     useEffect(() => {
//     if (employee?._id) {
//     fetchLeaveRequestsFromDB(employee._id);
//     }
//     }, [employee]);

//     // View Employee 
//     useEffect(() => {
//     if (employee?._id) {
//     axios.post("http://localhost:3004/view-employee", { employeeId: employee._id })
//       .then((res) => {
//         const emp = res.data.data;
//         setLeaveStats({
//           casual: emp.casualLeaves,
//           sick: emp.sickLeaves
//         });
//       })
//       .catch((err) => console.error("Error fetching leave stats", err));
//   }
//     }, [employee, refresh]);


//   const fetchEmployeeData = async () => {
//     try {
//       const res = await axios.post("http://localhost:3004/view-employee");
//       if (res.data.success && res.data.data?.length) {
//         const email = localStorage.getItem("employeeEmail");
//         const matchedEmployee = res.data.data.find(emp => emp.email === email);
//         if (matchedEmployee) {
//           // console.log("Matched employee:", matchedEmployee);
//           setEmployee(matchedEmployee);
//         }
//       }
//     } catch (err) {
//       console.error("Error fetching employee data:", err);
//     }
//   };


//   const fetchLeaveRequestsFromDB = async (empId) => {
//     try {
//       const res = await axios.post("http://localhost:3004/view-employee-leave-request-table", {
//         employeeId: empId,
//       });

//       if (res.data.success && Array.isArray(res.data.data)) {
//         const formatted = res.data.data.map((item) => ({
//           from: item.from_date,
//           to: item.to_date,
//           leaveType: item.leave_type,
//           reason: item.reason,
//           status: item.status,
//           file: item.attachment ? { name: item.attachment } : null,
//           appliedOn: formatDate(item.createdAt),
//           createdAt: item.createdAt, 
//           days: calculateLeaveDays(item.from_date, item.to_date),
//         }));

//         setLeaveRequests(formatted);
//       }
//     } catch (err) {
//       console.error("Error fetching leave requests:", err);
//     }
//   };

//   const profileImage = employee?.profileImage || "/user1.jpg";

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setLeaveRequest({ ...leaveRequest, file });
//   };

//   const calculateLeaveDays = (from, to) => {
//     const start = new Date(from);
//     const end = new Date(to);
//     const timeDiff = end - start;
//     const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
//     return dayDiff > 0 ? dayDiff : 0;
//   };




//    const fetchLeaveRequests = async () => {
//   try {
//     const res = await axios.post("http://localhost:3004/view-employee-leave-request-admin-table");
//     if (res.data.success) {
//       let casual = 12;
//       let sick = 5;

//       res.data.data.forEach((item) => {
//         if (item.employee_name === employee?.name && item.status === "Approved") {
//           const from = new Date(item.from_date);
//           const to = new Date(item.to_date);
//           const days = Math.ceil(Math.abs(to - from) / (1000 * 60 * 60 * 24)) + 1;
          
//             if (item.leave_type === "Sick Leave") {
//             sick =  sick - days;
//           } else {
//             casual -= days;
//           }
//         }
//       });

//       setdata({ casual, sick });
//     }
//   } catch (error) {
//     console.error("Error fetching leave requests:", error);
//   }
//    };



// useEffect(()=>{
//   fetchLeaveRequests();
// },[employee]);






//   const formatDate = (dateString) => {
//   const date = new Date(dateString);
//   const day = String(date.getDate()).padStart(2, '0');
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const year = String(date.getFullYear()).slice(-4); // last 2 digits
//   return `${day}-${month}-${year}`;
// };


//   const handleSubmit = async () => {
//     if (
//       !leaveRequest.from ||
//       !leaveRequest.to ||
//       !leaveRequest.reason.trim() ||
//       !leaveRequest.leaveType
//     ) {
//       // alert("Please fill all required fields.");
//        toast.error("Please fill all required fields!", {
//         position: "top-center",
//         autoClose: 3000,
//       });
//       return;
//     }

//     const days = calculateLeaveDays(leaveRequest.from, leaveRequest.to);
//     if (days <= 0) {
//       toast.error("Invalid leave duration.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("from_date", leaveRequest.from);
//     formData.append("to_date", leaveRequest.to);
//     formData.append("leave_type", leaveRequest.leaveType);
//     formData.append("reason", leaveRequest.reason);
//     formData.append("employeeId", employee?._id);
//     formData.append("employee_name", employee?.name);
//     formData.append("email", employee?.email);
//     formData.append("designation", employee?.designation);
//     formData.append("profileImage", employee?.profileImage || "/user1.jpg");
//     if (leaveRequest.file) {
//       formData.append("attachment", leaveRequest.file);
//     }

//     try {
//       const response = await axios.post("http://localhost:3004/add-leave-request", formData);
//       if (response.data.success) {
//         // alert("Leave request submitted successfully!");
//               toast.success("Leave request submitted successfully!");
        

//         setLeaveRequest({ from: "", to: "", reason: "", file: null, leaveType: "Casual Leave" });

//         await axios.post("http://localhost:3004/add-notification", {
//          admin: true,
//          message: `${employee?.name} has sent a leave request.`,
//         });


//         // Refresh table data after submission
//         fetchLeaveRequestsFromDB(employee._id);
//         setRefresh(prev => !prev); //  Toggle refresh to trigger leaveStats fetch

//       } else {
//         // alert("Failed to submit leave request.");
//         toast.error("Failed to submit leave request.");

//       }
//     } catch (error) {
//       console.error("Error submitting leave request:", error);
//       // alert("Server error. Please try again.");
//       toast.error("Server error. Please try again.");

//     }
//   };


//     const openModal = (reason) => {
//     setSelectedReason(reason);
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setSelectedReason("");
//   };


//    const filteredLeaveRequests = selectedMonth
//     ? leaveRequests.filter((req) => {
//         const reqDate = new Date(req.createdAt);
//         const reqMonth = `${reqDate.getFullYear()}-${String(
//           reqDate.getMonth() + 1
//         ).padStart(2, "0")}`;
//         return reqMonth === selectedMonth;
//       })
//     : leaveRequests;


//     const today = new Date().toISOString().split("T")[0];




//   return (
//     <div className="relative min-h-screen bg-[#CDE6EC] font-sans text-gray-800">
//       <EmployeeHeader />

//       {/* <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} /> */}

//       <div className="relative z-10 p-8">
        
        

//         {/* Employee Card */}

//         <div className="bg-white shadow-xl rounded-2xl p-6 mb-8 border-l-4 border-[#32A9C7] relative">
//           <div className="absolute top-4 right-4">
//             <img
//               // src={profileImage} || "/user1.jpg";
//                src={profileImage && profileImage.startsWith("http")? profileImage: "/user1.jpg"}
//               alt="Employee"
//               className="w-16 h-16 rounded-full border-2 border-blue-400 object-cover"
//             />


//           </div>
//           <h2 className="text-2xl font-bold">Welcome, {employee?.name || "Employee"}</h2>
//           <p className="text-sm text-gray-600 mt-1"><span className="font-bold">Designation:</span> {employee?.designation || "N/A"}</p>
//           <p className="text-sm text-gray-600"><span className="font-bold">Projects:</span> {employee?.project || "N/A"}</p>
//           <p className="text-sm text-gray-600"><span className="font-bold">Email:</span> {employee?.email || "N/A"}</p>
//           <p className="text-sm text-gray-600"><span className="font-bold">Employee ID:</span> {employee?.id || "N/A"}</p>


//           <p className="text-green-600 font-semibold mt-2">Casual Leaves: {data.casual ?? 10} | Sick Leaves: {data.sick ?? 10}</p>
          


//         </div>

//         {/* Leave Form */}
        
//         <div className="space-y-6">
//           <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-[#32A9C7]">
//             <h3 className="text-xl font-semibold text-[#32A9C7] mb-4">Leave Request</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <input
//                  type="date"
//                  value={leaveRequest.from}
//                  min={today}
//                  onChange={(e) => setLeaveRequest({ ...leaveRequest, from: e.target.value })}
//                  className="mt-1 w-full px-4 py-2 border rounded-lg"
//               />

//               <input
//                   type="date"
//                   value={leaveRequest.to}
//                   min={leaveRequest.from || today}
//                   onChange={(e) => setLeaveRequest({ ...leaveRequest, to: e.target.value })}
//                   className="mt-1 w-full px-4 py-2 border rounded-lg"
//               />

//             </div>

//             {/* Leave Type Dropdown */}
//             <div className="mt-4">
//               <label className="text-sm font-medium">Leave Type</label>
//               <select
//                 value={leaveRequest.leaveType}
//                 onChange={(e) => setLeaveRequest({ ...leaveRequest, leaveType: e.target.value })}
//                 className="mt-1 w-full px-4 py-2 border rounded-lg"
//               >
//                 <option value="Casual Leave">Casual Leave</option>
//                 <option value="Sick Leave">Sick Leave</option>

//               </select>
//             </div>

//             <div className="mt-4">
//               <label className="text-sm font-medium">Reason</label>
//               <textarea
//                 rows="3"
//                 value={leaveRequest.reason}
//                 onChange={(e) => setLeaveRequest({ ...leaveRequest, reason: e.target.value })}
//                 className="mt-1 w-full px-4 py-2 border rounded-lg"
//               />
//             </div>

//             <div className="mt-4">
//               <label className="block text-sm font-semibold mb-1">Attachment (optional)</label>
//               <input type="file" onChange={handleFileChange} className="w-full p-2 border rounded" />
//             </div>

//             <div className="mt-4 text-right">
//               <button
//                 onClick={handleSubmit}
//                 className="bg-[#32A9C7] text-white px-4 py-2 rounded-lg hover:bg-[#5895a4]"
//               >
//                 Submit Leave Request
//               </button>
//             </div>
//           </div>

//           {/* Leave Requests Table */}
//           <div className="bg-white border-l-4 border-[#32A9C7] p-6 rounded-2xl shadow-md overflow-auto">


//          <div className="mb-4 flex justify-between items-center">

//           <h3 className="text-xl font-semibold text-[#32A9C7]">Submitted Leave Requests</h3>

//                <div className="flex items-center mb-4">
//       <label className="text-sm font-semibold mr-2">Filter by Month:</label>
//       <input
//         type="month"
//         value={selectedMonth || defaultMonthInputValue}
//         onChange={(e) => setSelectedMonth(e.target.value)}
//         className="border px-2 py-1 rounded"
//       />
//     </div>
//          </div>

//             <table className="w-full text-sm border">
//               <thead className="bg-[#5ed9de] text-gray-800">
//                 <tr>
//                   <th className="p-3 border">Applied On</th>
//                   <th className="p-3 border">From</th>
//                   <th className="p-3 border">To</th>
//                   <th className="p-3 border">Total Days</th>
//                   <th className="p-3 border">Leave Type</th>
//                   <th className="p-3 border">Reason</th>
//                   <th className="p-3 border">Attachment</th>
//                   <th className="p-3 border">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredLeaveRequests.length > 0 ? (
//                   filteredLeaveRequests.map((req, index) => (
//                     <tr key={index} className="hover:bg-gray-50">
//                       <td className="p-3 border text-center">{req.appliedOn}</td>

//                       <td className="p-3 border text-center">{formatDate(req.from)}</td>
//                       <td className="p-3 border text-center">{formatDate(req.to)}</td>
//                       <td className="p-3 border text-center">{req.days}</td>
//                       <td className="p-3 border text-center">{req.leaveType}</td>

                    
// <td className="p-3 border text-left">
//   {req.reason.split(" ").length > 6 ? ( //  condition for >10 words
//     <div className="flex items-center space-x-2">
//       <span>{req.reason.split(" ").slice(0, 6).join(" ")}...</span> {/*  show first 10 words */}
//       <button
//         onClick={() => openModal(req.reason)}         //  open popup with full reason
//         className="text-blue-600 hover:text-blue-800"
//       >
//         <FcInfo size={18} />             {/*  info icon */}
//       </button>
//     </div>
//   ) : (
//     <span>{req.reason}</span>                         //  show full if <= 10 words
//   )}
// </td>



                      
//                      <td className="p-3 border text-center">
//                         {req.file ? (
//                             <a
//                               href={`http://localhost:3004/uploads/${req.file.name}`}  // filename hona chahiye, not name
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="text-blue-600 underline"
//                                >
//                                   View
//                             </a>
//                            ) : (
//                               "—"
//                                 )}
//                      </td>


//                       <td className="p-3 border text-center">
//                         <span
//                           className={`px-2 py-1 rounded-full text-white text-xs ${
//                             req.status === "Approved"
//                               ? "bg-green-500"
//                               : req.status === "Rejected"
//                               ? "bg-red-500"
//                               : "bg-yellow-500"
//                           }`}
//                         >
//                           {req.status}
//                         </span>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="8" className="text-center p-4 text-gray-400">
//                       No leave request submitted yet.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//          {showModal && (


//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//   <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-xl w-full transition-all duration-300 scale-100">
//     {/* Close Button */}
//     <button
//       onClick={closeModal}
//       className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl"
//       aria-label="Close"
//     >
//       &times;
//     </button>

//     {/* Header */}
//     <div className="flex items-center space-x-2 mb-4">
//       <div className="w-2 h-6 bg-blue-500 rounded-sm"></div>
//       <h2 className="text-xl font-semibold text-gray-800 tracking-wide">
//         Task Description
//       </h2>
//     </div>

//     {/* Task Content */}
//     <div className="max-h-72 overflow-y-auto pr-1">
//       <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
//         { selectedReason}
//       </p>
//     </div>
//   </div>
//          </div>

//         )}

//       </div>
//     </div>
//   );
// }




import React, { useState, useEffect } from "react";
import axios from "axios";
import EmployeeHeader from "../components/employee_header";
import { FcInfo } from "react-icons/fc";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function EmployeeLeaveRequestPage() {
  const [leaveRequest, setLeaveRequest] = useState({ from: "", to: "", reason: "", file: null, leaveType: "Casual Leave" });
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [employee, setEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [leaveStats, setLeaveStats] = useState({ casual: 0, sick: 0 });
  const [refresh, setRefresh] = useState(false); // isse re-render trigger hoga
  const [selectedMonth, setSelectedMonth] = useState("");
  const currentYear = new Date().getFullYear();
  const defaultMonthInputValue = `${currentYear}-01`;

  const [data ,setdata] = useState({ sick : 5, casual :12 })


  
  
  

  

    // Fetch employee data on mount
    useEffect(() => {
    fetchEmployeeData();
    // setSelectedMonth(new Date().toISOString().slice(0, 7)); 

    }, []);

    // Fetch leave requests after employee is loaded
    useEffect(() => {
    if (employee?._id) {
    fetchLeaveRequestsFromDB(employee._id);
    }
    }, [employee]);

    // View Employee 
    useEffect(() => {
    if (employee?._id) {
    axios.post("http://localhost:3004/view-employee", { employeeId: employee._id })
      .then((res) => {
        const emp = res.data.data;
        setLeaveStats({
          casual: emp.casualLeaves,
          sick: emp.sickLeaves
        });
      })
      .catch((err) => console.error("Error fetching leave stats", err));
  }
    }, [employee, refresh]);


  const fetchEmployeeData = async () => {
    try {
      const res = await axios.post("http://localhost:3004/view-employee");
      if (res.data.success && res.data.data?.length) {
        const email = localStorage.getItem("employeeEmail");
        const matchedEmployee = res.data.data.find(emp => emp.email === email);
        if (matchedEmployee) {
          // console.log("Matched employee:", matchedEmployee);
          setEmployee(matchedEmployee);
        }
      }
    } catch (err) {
      console.error("Error fetching employee data:", err);
    }
  };


  const fetchLeaveRequestsFromDB = async (empId) => {
    try {
      const res = await axios.post("http://localhost:3004/view-employee-leave-request-table", {
        employeeId: empId,
      });

      if (res.data.success && Array.isArray(res.data.data)) {
        const formatted = res.data.data.map((item) => ({
          from: item.from_date,
          to: item.to_date,
          leaveType: item.leave_type,
          reason: item.reason,
          status: item.status,
          file: item.attachment ? { name: item.attachment } : null,
          appliedOn: formatDate(item.createdAt),
          createdAt: item.createdAt, 
          days: calculateLeaveDays(item.from_date, item.to_date),
        }));

        setLeaveRequests(formatted);
      }
    } catch (err) {
      console.error("Error fetching leave requests:", err);
    }
  };

  const profileImage = employee?.profileImage || "/user1.jpg";

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setLeaveRequest({ ...leaveRequest, file });
  };

  const calculateLeaveDays = (from, to) => {
    const start = new Date(from);
    const end = new Date(to);
    const timeDiff = end - start;
    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    return dayDiff > 0 ? dayDiff : 0;
  };




   const fetchLeaveRequests = async () => {
  try {
    const res = await axios.post("http://localhost:3004/view-employee-leave-request-admin-table");
    if (res.data.success) {
      let casual = 12;
      let sick = 5;

      res.data.data.forEach((item) => {
        if (item.employee_name === employee?.name && item.status === "Approved") {
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
},[employee]);






  const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-4); // last 2 digits
  return `${day}-${month}-${year}`;
};


  const handleSubmit = async () => {
    if (
      !leaveRequest.from ||
      !leaveRequest.to ||
      !leaveRequest.reason.trim() ||
      !leaveRequest.leaveType
    ) {
      // alert("Please fill all required fields.");
       toast.error("Please fill all required fields!", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    const days = calculateLeaveDays(leaveRequest.from, leaveRequest.to);
    if (days <= 0) {
      toast.error("Invalid leave duration.");
      return;
    }

    const formData = new FormData();
    formData.append("from_date", leaveRequest.from);
    formData.append("to_date", leaveRequest.to);
    formData.append("leave_type", leaveRequest.leaveType);
    formData.append("reason", leaveRequest.reason);
    formData.append("employeeId", employee?._id);
    formData.append("employee_name", employee?.name);
    formData.append("email", employee?.email);
    formData.append("designation", employee?.designation);
    formData.append("profileImage", employee?.profileImage || "/user1.jpg");
    if (leaveRequest.file) {
      formData.append("attachment", leaveRequest.file);
    }

    try {
      const response = await axios.post("http://localhost:3004/add-leave-request", formData);
      if (response.data.success) {
        // alert("Leave request submitted successfully!");
              toast.success("Leave request submitted successfully!");
        

        setLeaveRequest({ from: "", to: "", reason: "", file: null, leaveType: "Casual Leave" });

        await axios.post("http://localhost:3004/add-notification", {
         admin: true,
         message: `${employee?.name} has sent a leave request.`,
        });


        // Refresh table data after submission
        fetchLeaveRequestsFromDB(employee._id);
        setRefresh(prev => !prev); //  Toggle refresh to trigger leaveStats fetch

      } else {
        // alert("Failed to submit leave request.");
        toast.error("Failed to submit leave request.");

      }
    } catch (error) {
      console.error("Error submitting leave request:", error);
      // alert("Server error. Please try again.");
      toast.error("Server error. Please try again.");

    }
  };


    const openModal = (reason) => {
    setSelectedReason(reason);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReason("");
  };


   const filteredLeaveRequests = selectedMonth
    ? leaveRequests.filter((req) => {
        const reqDate = new Date(req.createdAt);
        const reqMonth = `${reqDate.getFullYear()}-${String(
          reqDate.getMonth() + 1
        ).padStart(2, "0")}`;
        return reqMonth === selectedMonth;
      })
    : leaveRequests;


    const today = new Date().toISOString().split("T")[0];




  return (
    <div className="relative min-h-screen bg-[#CDE6EC] font-sans text-gray-800">
  <EmployeeHeader />

  <div className="relative z-10 p-4 sm:p-6 lg:p-8">
    
    {/* Employee Card */}
    <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border-l-4 border-[#32A9C7] relative">
      <div className="absolute top-4 right-4">
        <img
          src={profileImage && profileImage.startsWith("http") ? profileImage : "/user1.jpg"}
          alt="Employee"
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-blue-400 object-cover"
        />
      </div>
      <h2 className="text-lg sm:text-2xl font-bold">Welcome, {employee?.name || "Employee"}</h2>
      <p className="text-xs sm:text-sm text-gray-600 mt-1">
        <span className="font-bold">Designation:</span> {employee?.designation || "N/A"}
      </p>
      <p className="text-xs sm:text-sm text-gray-600">
        <span className="font-bold">Projects:</span> {employee?.project || "N/A"}
      </p>
      <p className="text-xs sm:text-sm text-gray-600">
        <span className="font-bold">Email:</span> {employee?.email || "N/A"}
      </p>
      <p className="text-xs sm:text-sm text-gray-600">
        <span className="font-bold">Employee ID:</span> {employee?.id || "N/A"}
      </p>

      <p className="text-green-600 font-semibold mt-2 text-sm sm:text-base">
        Casual Leaves: {data.casual ?? 10} | Sick Leaves: {data.sick ?? 10}
      </p>
    </div>

    {/* Leave Form */}
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md border-l-4 border-[#32A9C7]">
        <h3 className="text-lg sm:text-xl font-semibold text-[#32A9C7] mb-4">Leave Request</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <input
            type="date"
            value={leaveRequest.from}
            min={today}
            onChange={(e) => setLeaveRequest({ ...leaveRequest, from: e.target.value })}
            className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base"
          />

          <input
            type="date"
            value={leaveRequest.to}
            min={leaveRequest.from || today}
            onChange={(e) => setLeaveRequest({ ...leaveRequest, to: e.target.value })}
            className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base"
          />
        </div>

        {/* Leave Type Dropdown */}
        <div className="mt-4">
          <label className="text-sm font-medium">Leave Type</label>
          <select
            value={leaveRequest.leaveType}
            onChange={(e) => setLeaveRequest({ ...leaveRequest, leaveType: e.target.value })}
            className="mt-1 w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base"
          >
            <option value="Casual Leave">Casual Leave</option>
            <option value="Sick Leave">Sick Leave</option>
          </select>
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium">Reason</label>
          <textarea
            rows="3"
            value={leaveRequest.reason}
            onChange={(e) => setLeaveRequest({ ...leaveRequest, reason: e.target.value })}
            className="mt-1 w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-semibold mb-1">Attachment (optional)</label>
          <input type="file" onChange={handleFileChange} className="w-full p-2 border rounded text-sm" />
        </div>

        <div className="mt-4 flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={handleSubmit}
            className="w-full sm:w-auto bg-[#32A9C7] text-white px-4 py-2 rounded-lg hover:bg-[#5895a4] text-sm sm:text-base"
          >
            Submit Leave Request
          </button>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white border-l-4 border-[#32A9C7] p-4 sm:p-6 rounded-2xl shadow-md overflow-x-auto">
        <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <h3 className="text-lg sm:text-xl font-semibold text-[#32A9C7]">Submitted Leave Requests</h3>

          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold">Filter by Month:</label>
            <input
              type="month"
              value={selectedMonth || defaultMonthInputValue}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border px-2 py-1 rounded text-sm"
            />
          </div>
        </div>

        <table className="w-full text-xs sm:text-sm border min-w-[700px]">
          <thead className="bg-[#5ed9de] text-gray-800">
            <tr>
              <th className="p-2 sm:p-3 border">Applied On</th>
              <th className="p-2 sm:p-3 border">From</th>
              <th className="p-2 sm:p-3 border">To</th>
              <th className="p-2 sm:p-3 border">Total Days</th>
              <th className="p-2 sm:p-3 border">Leave Type</th>
              <th className="p-2 sm:p-3 border">Reason</th>
              <th className="p-2 sm:p-3 border">Attachment</th>
              <th className="p-2 sm:p-3 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaveRequests.length > 0 ? (
              filteredLeaveRequests.map((req, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-2 sm:p-3 border text-center">{req.appliedOn}</td>
                  <td className="p-2 sm:p-3 border text-center">{formatDate(req.from)}</td>
                  <td className="p-2 sm:p-3 border text-center">{formatDate(req.to)}</td>
                  <td className="p-2 sm:p-3 border text-center">{req.days}</td>
                  <td className="p-2 sm:p-3 border text-center">{req.leaveType}</td>
                  <td className="p-2 sm:p-3 border text-left">
                    {req.reason.split(" ").length > 6 ? (
                      <div className="flex items-center space-x-2">
                        <span>{req.reason.split(" ").slice(0, 6).join(" ")}...</span>
                        <button
                          onClick={() => openModal(req.reason)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FcInfo size={18} />
                        </button>
                      </div>
                    ) : (
                      <span>{req.reason}</span>
                    )}
                  </td>
                  <td className="p-2 sm:p-3 border text-center">
                    {req.file ? (
                      <a
                        href={`http://localhost:3004/uploads/${req.file.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="p-2 sm:p-3 border text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-white text-xs ${
                        req.status === "Approved"
                          ? "bg-green-500"
                          : req.status === "Rejected"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center p-4 text-gray-400">
                  No leave request submitted yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

    {/* Modal */}
    {showModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2">
        <div className="relative bg-white rounded-2xl shadow-2xl p-4 sm:p-6 max-w-lg w-full">
          <button
            onClick={closeModal}
            className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-2 h-6 bg-blue-500 rounded-sm"></div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Task Description</h2>
          </div>
          <div className="max-h-64 overflow-y-auto">
            <p className="text-gray-700 whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
              {selectedReason}
            </p>
          </div>
        </div>
      </div>
    )}
  </div>
</div>

  );
}