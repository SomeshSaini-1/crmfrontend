
import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FcInfo } from "react-icons/fc";
import AdminHeader from "../components/admin_header";
import { toast } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';

export default function AdminRequirementsPage() {
  const [requirements, setRequirements] = useState([]);
  const [comments, setComments] = useState({});
  const [searchTerm, setSearchTerm] = useState("");


  // Popup state
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedInfoText, setSelectedInfoText] = useState("");

  const openInfoModal = (text) => {
    setSelectedInfoText(text);
    setShowInfoModal(true);
  };

  const closeInfoModal = () => {
    setSelectedInfoText("");
    setShowInfoModal(false);
  };

  const handleCommentChange = (id, value) => {
    setComments((prev) => ({ ...prev, [id]: value }));
  };

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        const response = await fetch(
          "http://otplai.com:4006/view-requirement-table-admin",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();

        if (result.success) {
          const formatted = result.data.map((req) => ({
            id: req._id,
            date: new Date(req.createdAt).toLocaleDateString(),
            employeeName: req.sendBy || "N/A",
            requirement: req.requirement,
            attachment: req.attachment,
            deadline: req.deadline,
            adminComment: req.adminComment || "",
          }));
          setRequirements(formatted);
        } else {
          console.error("No requirements found");
        }
      } catch (error) {
        console.error("Error fetching admin requirements:", error);
      }
    };

    fetchRequirements();
    markRequirementNotificationsAsRead();
  }, []);



  const markRequirementNotificationsAsRead = async () => {
  try {
    await fetch("http://otplai.com:4006/mark-requirement-notifications-read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Failed to mark requirement notifications as read:", err);
  }
};


  

  const handleSubmitComment = async (id) => {
    const comment = comments[id];

    try {
      const response = await fetch(
        "http://otplai.com:4006/update-admin-comment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            adminComment: comment,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setRequirements((prev) =>
          prev.map((req) =>
            req.id === id ? { ...req, adminComment: comment } : req
          )
        );
        setComments((prev) => ({ ...prev, [id]: "" }));
        toast.success("Comment submitted & saved to database!");
      } else {
        toast.error("Failed to update comment: " + result.message);
      }
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error("Error updating comment");
    }
  };



  const filteredRequirements = requirements.filter((req) =>
  req.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
);




  return (
    <div className="h-screen bg-[#CDE6EC] flex flex-col">
      <AdminHeader />

      
        <div className="bg-white sticky top-0 z-10 shadow px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-3">
          <h1 className="text-xl font-bold text-[#32A9C7]">Admin Requirements</h1>

          <div className="flex items-center bg-white border border-blue-100 rounded px-2 py-1">
            <FaSearch className="text-gray-500 mr-2" />
            <input
  type="text"
  placeholder="Search by Employee..."
  className="outline-none text-sm bg-transparent"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
          </div>
        </div>

        <div className="bg-white shadow rounded overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#32A9C7] text-white">
                <th className="p-3 border">S.N.</th>
                <th className="p-3 border">Date</th>
                <th className="p-3 border">Employee Name</th>
                <th className="p-3 border">Requirement</th>
                <th className="p-3 border">Attachment</th>
                <th className="p-3 border">Deadline</th>

                <th className="p-3 border">Admin Comment</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequirements.length === 0 ? (
    <tr>
      <td colSpan="7" className="text-center p-4 text-gray-500">
        No requirements found.
      </td>
    </tr>
  ) : (
    filteredRequirements.map((req, index) => (
      <tr key={req.id} className="hover:bg-blue-50">
        <td className="p-3 border text-center">{index + 1}</td>
        <td className="p-3 border">{req.date}</td>
        <td className="p-3 border">{req.employeeName}</td>

                    {/* Requirement column with popup */}
                    <td className="p-3 border">
                      {req.requirement.length > 30 ? (
                        <div className="flex items-center space-x-2">
                          <span>{req.requirement.slice(0, 30)}...</span>
                          <button
                            onClick={() => openInfoModal(req.requirement)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FcInfo size={18} />
                          </button>
                        </div>
                      ) : (
                        req.requirement
                      )}
                    </td>

                    {/* Attachment */}
                    <td className="p-3 border">
                      {req.attachment ? (
                        <a
                              href={`http://otplai.com:4006/uploads/${req.attachment}`}  // filename hona chahiye, not name
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



                    <td className="p-3 border text-center">
          {req.deadline
            ? new Date(req.deadline).toLocaleDateString()
            : "-"}
        </td>

                    {/* Admin Comment column with popup */}
                    <td className="p-3 border text-center">
                      {req.adminComment && req.adminComment.trim() !== "" ? (
                        req.adminComment.length > 30 ? (
                          <div className="flex items-center justify-center space-x-2">
                            <span>{req.adminComment.slice(0, 30)}...</span>
                            <button
                              onClick={() => openInfoModal(req.adminComment)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <FcInfo size={18} />
                            </button>
                          </div>
                        ) : (
                          <div className="text-gray-700">{req.adminComment}</div>
                        )
                      ) : (
                        <textarea
                          rows="2"
                          value={comments[req.id] ?? ""}
                          onChange={(e) =>
                            handleCommentChange(req.id, e.target.value)
                          }
                          className="w-full p-2 border rounded text-sm"
                          placeholder="Write your comment"
                        />
                      )}
                    </td>

                    {/* Action */}
                    <td className="p-3 border text-center">
                      {req.adminComment && req.adminComment.trim() !== "" ? (
                       <p className=" py-1 bg-green-600 text-white rounded" >Submitted</p> 
                      ) : (
                        <button
                          onClick={() => handleSubmitComment(req.id)}
                          className="px-3 py-1 bg-[#32A9C7] text-white rounded hover:bg-[#188ca9]"
                        >
                          Submit
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-xl w-full">
            <button
              onClick={closeInfoModal}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-6 bg-blue-500 rounded-sm"></div>
              <h2 className="text-xl font-semibold text-gray-800 tracking-wide">
                Full Description
              </h2>
            </div>
            <div className="max-h-72 overflow-y-auto pr-1">
              <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                {selectedInfoText}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
