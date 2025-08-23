// import React, { useState, useEffect } from "react";
// import AdminHeader from "../components/admin_header";

// export default function AdminSuggestionsPage() {
//   const [suggestions, setSuggestions] = useState([]);

//   useEffect(() => {
//     // Dummy suggestion data
//     setSuggestions([
//       {
//         _id: "1",
//         employeeId: "EMP001",
//         name: "Amit Sharma",
//         title: "Better Dev Tools",
//         suggestion: "We should consider integrating new browser debugging extensions.",
//         fileName: "debug-tool.pdf",
//         fileUrl: "/uploads/suggestions/debug-tool.pdf",
//         adminComment: "",
//       },
//       {
//         _id: "2",
//         employeeId: "EMP002",
//         name: "Neha Patel",
//         title: "Health Benefits",
//         suggestion: "Offer yoga sessions during lunch breaks.",
//         fileName: "",
//         fileUrl: "",
//         adminComment: "",
//       },
//     ]);
//   }, []);

//   const handleAdminCommentChange = (id, comment) => {
//     setSuggestions((prev) =>
//       prev.map((item) =>
//         item._id === id ? { ...item, adminComment: comment } : item
//       )
//     );
//   };

//   const handleSubmitComment = (id) => {
//     const suggestion = suggestions.find((item) => item._id === id);
//     alert(`(Mock) Admin comment for ${suggestion.name}: ${suggestion.adminComment}`);
//     // API call to submit comment can go here
//   };

//   return (
//     <div className="h-screen bg-gray-100 flex flex-col">
//       <AdminHeader />
//       <div className="min-h-screen bg-gray-100 p-8">
//         <h1 className="text-2xl font-bold mb-6">Employee Suggestions</h1>
//         <div className="bg-white p-6 rounded-xl shadow-md overflow-auto">
//           <table className="w-full text-sm border">
//             <thead className="bg-[#5ed9de] text-gray-800">
//               <tr>
//                 <th className="p-3 border">Employee ID</th>
//                 <th className="p-3 border">Name</th>
//                 <th className="p-3 border">Title</th>
//                 <th className="p-3 border">Suggestion</th>
//                 <th className="p-3 border">Attachment</th>
//                 <th className="p-3 border">Admin Comment</th>
//                 <th className="p-3 border">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {suggestions.map((sugg, index) => (
//                 <tr key={index} className="hover:bg-gray-50">
//                   <td className="p-3 border text-center">{sugg.employeeId}</td>
//                   <td className="p-3 border text-center">{sugg.name}</td>
//                   <td className="p-3 border text-center">{sugg.title}</td>
//                   <td className="p-3 border text-left">{sugg.suggestion}</td>
//                   <td className="p-3 border text-center">
//                     {sugg.fileName ? (
//                       <a
//                         href={sugg.fileUrl}
//                         target="_blank"
//                         rel="noreferrer"
//                         className="text-blue-600 underline"
//                       >
//                         View
//                       </a>
//                     ) : (
//                       "—"
//                     )}
//                   </td>
//                   <td className="p-3 border text-center">
//                     <textarea
//                       rows="2"
//                       value={sugg.adminComment}
//                       onChange={(e) =>
//                         handleAdminCommentChange(sugg._id, e.target.value)
//                       }
//                       className="w-full p-2 border rounded text-sm"
//                       placeholder="Write your comment"
//                     />
//                   </td>
//                   <td className="p-3 border text-center">
//                     <button
//                       onClick={() => handleSubmitComment(sugg._id)}
//                       className="bg-[#32A9C7] text-white px-3 py-1 rounded hover:bg-[#3DC3E1] text-xs"
//                     >
//                       Submit Comment
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//               {suggestions.length === 0 && (
//                 <tr>
//                   <td colSpan="7" className="text-center p-4 text-gray-400">
//                     No suggestions submitted yet.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }
