
import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminHeader from "../components/admin_header";
import { FcInfo } from "react-icons/fc";

import { MdKeyboardArrowDown } from "react-icons/md";

import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function AdminLeaveRequestsPage() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");

  // Status modal state
  const [statusModal, setStatusModal] = useState({
    isOpen: false,
    requestId: null,
    currentStatus: "",
  });

  // Filters
  const [searchName, setSearchName] = useState("");
  const [filterMonth, setFilterMonth] = useState("");



  const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};



  useEffect(() => {
    fetchLeaveRequests();
    markLeaveNotificationsAsRead();
  }, []);

 const markLeaveNotificationsAsRead = async () => {
  try {
    await axios.post("http://localhost:3004/mark-leave-notifications-read");
  } catch (err) {
    console.error("Failed to mark leave notifications as read:", err);
  }
};


  const fetchLeaveRequests = async () => {
    try {
      const res = await axios.post("http://localhost:3004/view-employee-leave-request-admin-table");
      if (res.data.success) {
        const formatted = res.data.data.map((item) => {
          const from = new Date(item.from_date);
          const to = new Date(item.to_date);
          const diffTime = Math.abs(to - from);
          const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

          return {
            _id: item._id,
            employeeId: item.employeeId,
            name: item.employee_name,
            appliedOn: new Date(item.createdAt).toISOString().split("T")[0],
            from: item.from_date,
            to: item.to_date,
            days,
            leaveType: item.leave_type,
            reason: item.reason,
            file: item.attachment ? { name: item.attachment } : null,
            profileImage: item.profileImage || "/oxymoralogo.png",
            status: item.status,
          };
        });
        setLeaveRequests(formatted);
      }
    } catch (error) {
      console.error("Error fetching leave requests:", error);
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

  
  const openStatusModal = (id, status) => {
  if (status === "Pending" || status === "Rejected") {
    setStatusModal({ isOpen: true, requestId: id, currentStatus: status });
  }
  };


  const closeStatusModal = () => {
    setStatusModal({ isOpen: false, requestId: null, currentStatus: "" });
  };



  const updateStatus = async (id, newStatus, currentStatus) => {
  if (currentStatus === "Approved") {
    toast.error("This request is already approved and cannot be changed.");
    return;
  }

  try {
    const res = await axios.post("http://localhost:3004/update-leave-status", {
      leaveId: id,
      status: newStatus,
    });

    if (res.data.success) {
      setLeaveRequests((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, status: newStatus } : req
        )
      );

      //  Show toast based on newStatus
      if (newStatus === "Approved") {
        toast.success("Leave request approved successfully.", {autoClose:2000});
      } else if (newStatus === "Rejected") {
        toast.warn("Leave request rejected.", {autoClose:2000});
      }

      closeStatusModal();
    } else {
      toast.error(res.data.message || "Failed to update status.");
    }
  } catch (err) {
    console.error("Error updating status:", err);
    toast.error(err.response?.data?.message || "Something went wrong.");
  }
};

  
  return (
    <div className="min-h-screen bg-[#CDE6EC] flex flex-col">
    {/* <div className="min-h-screen bg-[#CDE6EC] flex flex-col"></div> */}
      <AdminHeader />

      

      <div className="bg-white sticky top-12 z-20 shadow px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold mb-2">Employee Leave Requests</h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by employee name"
            className="border px-3 py-2 rounded-lg"
            onChange={(e) => setSearchName(e.target.value.toLowerCase())}
          />

          {/* <select
            className="border px-3 py-2 rounded-lg"
            onChange={(e) => setFilterMonth(e.target.value)}
          >
            <option value="">All Months</option>
            {Array.from({ length: 12 }, (_, i) => {
              const month = new Date(0, i).toLocaleString("default", { month: "long" });
              return <option key={i} value={i}>{month}</option>;
            })}
          </select> */}



<div className="relative w-fit">
  <select
    className="border px-3 py-2 pr-8 rounded-lg appearance-none text-sm bg-white"
    onChange={(e) => setFilterMonth(e.target.value)}
  >
    <option value="">All Months</option>
    {Array.from({ length: 12 }, (_, i) => {
      const month = new Date(0, i).toLocaleString("default", { month: "long" });
      return <option key={i} value={i}>{month}</option>;
    })}
  </select>
  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-xl">
    <MdKeyboardArrowDown />
  </span>
</div>






          <button
            className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
            onClick={() => {
              setSearchName("");
              setFilterMonth("");
            }}
          >
            Reset Filters
          </button>
        </div>
      </div>


        {/* Leave Requests Table */}
        <div className="bg-white rounded-lg shadow p-3 m-5  overflow-auto">
          <table className="min-w-full text-sm border">
            <thead className="bg-[#5ed9de] text-gray-800">


              <tr>
                <th className="p-3 border">Image</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Applied On</th>
                <th className="p-3 border">From</th>
                <th className="p-3 border">To</th>
                <th className="p-3 border">Total Days</th>
                <th className="p-3 border">Leave Type</th>
                <th className="p-3 border">Reason</th>
                <th className="p-3 border">Attachment</th>
                <th className="p-3 border">Status</th>
              </tr>
            </thead>


           <tbody>
  {leaveRequests
    .filter((req) => {
      const nameMatch = req.name.toLowerCase().includes(searchName);
      const appliedMonth = new Date(req.appliedOn).getMonth();
      const monthMatch =
        filterMonth === "" || appliedMonth === Number(filterMonth);
      return nameMatch && monthMatch;
    })
    .map((req, index, arr) => (
      <tr key={index} className="hover:bg-gray-50">
        <td className="p-3 border text-center">
          <img
            src={req.profileImage}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover mx-auto"
          />
        </td>
        <td className="p-3 border text-center">{req.name}</td>
        <td className="p-3 border text-center">{formatDate(req.appliedOn)}</td>
        <td className="p-3 border text-center">{formatDate(req.from)}</td>
        <td className="p-3 border text-center">{formatDate(req.to)}</td>
        <td className="p-3 border text-center">{req.days}</td>
        <td className="p-3 border text-center">{req.leaveType}</td>
        <td className="p-3 border text-left">
          {req.reason.split(" ").length > 5 ? (
            <div className="flex items-center space-x-2">
              <span>
                {req.reason.split(" ").slice(0, 5).join(" ")}...
              </span>
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
        <td className="p-3 border text-center">
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
        <td className="p-3 border text-center">
          <button
            onClick={() => openStatusModal(req._id, req.status)}
            className={`px-2 py-1 rounded-full text-white text-xs ${
              req.status === "Approved"
                ? "bg-green-500"
                : req.status === "Rejected"
                ? "bg-red-500"
                : "bg-yellow-500 hover:opacity-90"
            }`}
            disabled={req.status === "Approved"}
          >
            {req.status}
          </button>
        </td>
      </tr>
    ))}

  {/* Agar filter ke baad data empty ho */}
  {leaveRequests.filter((req) => {
    const nameMatch = req.name.toLowerCase().includes(searchName);
    const appliedMonth = new Date(req.appliedOn).getMonth();
    const monthMatch =
      filterMonth === "" || appliedMonth === Number(filterMonth);
    return nameMatch && monthMatch;
  }).length === 0 && (
    <tr>
      <td colSpan="10" className="text-center px-4 py-6 text-gray-500">
        {filterMonth !== ""
          ? "No Leave Request available for this month."
          : "No leave request submitted yet."}
      </td>
    </tr>
  )}
</tbody>



          </table>
        </div>

        {/* Reason Modal */}
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
        {selectedReason}
      </p>
    </div>
  </div>
          </div>


        )}

        {/* Status Update Modal */}
        {statusModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-sm w-full shadow-lg relative text-center">
              <h2 className="text-lg font-bold mb-4 text-gray-800">Update Leave Status</h2>
              <p className="text-gray-600 mb-6">Do you want to approve or reject this leave request?</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => updateStatus(statusModal.requestId, "Approved", statusModal.currentStatus)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus(statusModal.requestId, "Rejected", statusModal.currentStatus)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
              <button
                onClick={closeStatusModal}
                className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
              >
                &times;
              </button>
            </div>
          </div>
        )}
      {/* </div> */}
    </div>
  );
}
