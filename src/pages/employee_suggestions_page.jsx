
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import EmployeeHeader from "../components/employee_header";

// export default function EmployeeSuggestionsPage() {
//   const [formData, setFormData] = useState({
//     title: "",
//     suggestion: "",
//     file: null,
//   });

//   const [employee, setEmployee] = useState(null);
//   const [submittedSuggestions, setSubmittedSuggestions] = useState([]);

//   // Fetch logged-in employee
//   useEffect(() => {
//     const fetchEmployee = async () => {
//       try {
//         const res = await axios.post("http://localhost:3004/view-employee");
//         if (res.data.success && res.data.data?.length) {
//           const email = localStorage.getItem("employeeEmail");
//           const matchedEmployee = res.data.data.find(emp => emp.email === email);
//           if (matchedEmployee) {
//             setEmployee(matchedEmployee);
//           }
//         }
//       } catch (err) {
//         console.error("Failed to fetch employee:", err.message);
//       }
//     };

//     fetchEmployee();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
//   };

//   const handleCancel = () => {
//     setFormData({ title: "", suggestion: "", file: null });
//   };

//   const handleSubmit = async () => {
//     if (!formData.title.trim() || !formData.suggestion.trim()) {
//       alert("Title and Suggestion are required.");
//       return;
//     }

//     try {
//       const formPayload = new FormData();
//       formPayload.append("title", formData.title);
//       formPayload.append("suggestion", formData.suggestion);
//       formPayload.append("message", ""); // Optional
//       formPayload.append("employeeName", employee?.name || "");
//       formPayload.append("employeeId", employee?.id || "");

//       if (formData.file) {
//         formPayload.append("file", formData.file);
//       }

//       const res = await axios.post("http://localhost:3004/add-suggestion", formPayload, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       if (res.data.success) {
//         alert("Suggestion submitted successfully!");
//         setSubmittedSuggestions((prev) => [...prev, res.data.data]);
//         setFormData({ title: "", suggestion: "", file: null });
//       } else {
//         alert("Failed to submit suggestion.");
//       }
//     } catch (error) {
//       console.error("Error submitting suggestion:", error.message);
//       alert("Error submitting suggestion. Please try again.");
//     }
//   };

//   const profileImage = employee?.profileImage || "/employee-placeholder.png";

//   return (
//     <div className="relative min-h-screen bg-[#CDE6EC] font-sans text-gray-800">
//       <EmployeeHeader />

//       <div className="relative z-10 p-8">
//         {/* Employee Info Card */}
//         {employee && (
//           <div className="bg-white shadow-xl rounded-2xl p-6 mb-8 border-l-4 border-[#32A9C7] relative">
//             <div className="absolute top-4 right-4">
//               <img
//                 src={profileImage}
//                 alt="Employee"
//                 className="w-16 h-16 rounded-full border-2 border-blue-400 object-cover"
//               />
//             </div>
//             <h2 className="text-2xl font-bold">Welcome, {employee?.name || "Employee"}</h2>
//             <p className="text-sm text-gray-600 mt-1">Designation: {employee.designation}</p>
//             <p className="text-sm text-gray-600">Email: {employee.email}</p>
//             <p className="text-sm text-gray-600">Employee ID: {employee.id}</p>
//           </div>
//         )}

//         {/* Suggestion Form */}
//         <div className="space-y-6">
//           <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-[#32A9C7]">
//             <h3 className="text-xl font-semibold text-[#32A9C7] mb-4">Add Your Suggestion</h3>

//             <div className="mb-4">
//               <label className="block text-sm font-semibold mb-1">Title</label>
//               <input
//                 type="text"
//                 name="title"
//                 className="w-full p-2 border rounded"
//                 value={formData.title}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block text-sm font-semibold mb-1">Suggestion</label>
//               <textarea
//                 name="suggestion"
//                 rows="4"
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#000]"
//                 value={formData.suggestion}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block text-sm font-semibold mb-1">Attachment (optional)</label>
//               <input
//                 type="file"
//                 onChange={handleFileChange}
//                 className="w-full p-2 border rounded"
//               />
//             </div>

//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={handleCancel}
//                 className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSubmit}
//                 className="bg-[#32A9C7] text-white px-4 py-2 rounded-lg hover:bg-[#3DC3E1]"
//               >
//                 Submit Suggestion
//               </button>
//             </div>
//           </div>

//           {/* Suggestions Table */}
//           <div className="bg-white border-l-4 border-[#32A9C7] p-6 rounded-2xl shadow-md overflow-auto">
//             <h3 className="text-xl font-semibold text-[#32A9C7] mb-4">Submitted Suggestions</h3>
//             <table className="w-full text-sm border">
//               <thead className="bg-[#5ed9de] text-gray-800">
//                 <tr>
//                   <th className="p-3 border">S.N.</th>
//                   <th className="p-3 border">Date</th>
//                   <th className="p-3 border">Title</th>
//                   <th className="p-3 border">Suggestion</th>
//                   <th className="p-3 border">Attachment</th>
//                   <th className="p-3 border">Comment</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {submittedSuggestions.length > 0 ? (
//                   submittedSuggestions.map((sugg, index) => (
//                     <tr key={sugg._id} className="hover:bg-gray-50">
//                       <td className="p-3 border text-center">{index + 1}</td>
//                       <td className="p-3 border text-center">
//                         {new Date(sugg.createdAt).toLocaleDateString()}
//                       </td>
//                       <td className="p-3 border text-center">{sugg.title}</td>
//                       <td className="p-3 border">{sugg.suggestion}</td>
//                       <td className="p-3 border text-center">
//                         {sugg.file ? (
//                           <a
//                             href={`http://localhost:3004/uploads/${sugg.file}`}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-blue-600 underline"
//                           >
//                             {sugg.file}
//                           </a>
//                         ) : (
//                           "—"
//                         )}
//                       </td>
//                       <td className="p-3 border text-center">
//                         {sugg.comment || "Pending"}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="6" className="text-center p-4 text-gray-400">
//                       No suggestion submitted yet.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


