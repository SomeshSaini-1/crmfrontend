


import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { FcInfo } from "react-icons/fc";
import EmployeeHeader from "../components/employee_header";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdKeyboardArrowDown } from "react-icons/md";

export default function EmployeeRequirementsPage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    requirement: "",
    attachment: null,
    deadline: "",
  });

  const [selectedMonth, setSelectedMonth] = useState("All");
  const [requirements, setRequirements] = useState([]);

  // Info modal
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

  // Handle form change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "attachment") {
      setFormData({ ...formData, attachment: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();

    const employeeId = localStorage.getItem("employeeId");
    const sendBy = localStorage.getItem("employeeName");

    form.append("requirement", formData.requirement);
    form.append("deadline", formData.deadline);
    form.append("employeeId", employeeId);
    form.append("sendBy", sendBy);

    if (formData.attachment) {
      form.append("attachment", formData.attachment);
    }

    try {
      const response = await fetch("http://otplai.com:4006/add-requirement", {
        method: "POST",
        body: form,
      });

      const result = await response.json();

      if (result.success) {
        const newReq = result.data;
        setRequirements((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            date: new Date().toLocaleDateString(),
            requirement: newReq.requirement,
            attachment: newReq.attachment,
            deadline: newReq.deadline,
            adminComment: "",
          },
        ]);

        setFormData({ requirement: "", attachment: null, deadline: "" });
        setShowForm(false);
        toast.success("Requirement request submitted successfully!");
      } else {
        toast.error("Failed to submit requirement: " + result.message);
      }
    } catch (error) {
      console.error("Error submitting requirement:", error);
      toast.error("Error submitting requirement");
    }
  };

  // Fetch requirements on load
  useEffect(() => {
    const fetchRequirements = async () => {
      const sendBy = localStorage.getItem("employeeName");

      try {
        const response = await fetch(
          "http://otplai.com:4006/view-requirement-table-employee",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sendBy }),
          }
        );

        const result = await response.json();
        if (result.success) {
          const formattedData = result.data.map((req, index) => {
            const dateObj = new Date(req.createdAt);
            return {
              id: index + 1,
              date: dateObj.toLocaleDateString(),
              month: (dateObj.getMonth() + 1).toString().padStart(2, "0"),
              requirement: req.requirement,
              attachment: req.attachment,
              deadline: req.deadline,
              adminComment: req.adminComment || "",
            };
          });
          setRequirements(formattedData);
        }
      } catch (err) {
        console.error("Error fetching requirements:", err);
      }
    };

    fetchRequirements();
  }, []);

  // Filter by month
  const filteredRequirements = requirements.filter((req) => {
    if (selectedMonth === "All") return true;
    return req.month === selectedMonth;
  });

  return (
    <div className="min-h-screen bg-[#CDE6EC] flex flex-col">
      <EmployeeHeader />

      {/* Header */}
      <div className="bg-white sticky top-0 z-10 shadow px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <h1 className="text-lg sm:text-xl font-bold text-[#32A9C7]">
          Requirements
        </h1>

        <div className="flex flex-wrap items-center gap-3">


          {/* Month Filter */}

          {/* <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-xs sm:text-sm"
          >
            <option value="All">All Months</option>
            {[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ].map((m, i) => (
              <option key={i} value={String(i + 1).padStart(2, "0")}>
                {m}
              </option>
            ))}
          </select> */}



          <div className="relative w-full sm:w-auto">
  <select
    value={selectedMonth}
    onChange={(e) => setSelectedMonth(e.target.value)}
    className="border border-gray-300 rounded px-3 py-2 pr-8 text-xs sm:text-sm w-full appearance-none bg-white"
  >
    <option value="All">All Months </option>
    {[
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ].map((m, i) => (
      <option key={i} value={String(i + 1).padStart(2, "0")}>
        {m}
      </option>
    ))}
  </select>

  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl text-gray-500 pointer-events-none">
    <MdKeyboardArrowDown />
  </span>
</div>




          {/* Add Button */}
          <button
            onClick={() => setShowForm(true)}
            className="bg-[#32A9C7] hover:bg-[#188ca9] text-white font-medium px-3 sm:px-4 py-2 rounded flex items-center gap-2 shadow text-xs sm:text-sm"
          >
            <FaPlus /> Add Requirement
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-[#32A9C7] text-white">
              <th className="p-2 sm:p-3 border">S.N.</th>
              <th className="p-2 sm:p-3 border">Date</th>
              <th className="p-2 sm:p-3 border">Requirement</th>
              <th className="p-2 sm:p-3 border">Attachment</th>
              <th className="p-2 sm:p-3 border">Deadline</th>
              <th className="p-2 sm:p-3 border">Admin Comment</th>
            </tr>
          </thead>

          <tbody>
            {filteredRequirements.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No requirements available for this month.
                </td>
              </tr>
            ) : (
              filteredRequirements.map((req, index) => (
                <tr key={req.id} className="hover:bg-blue-50">
                  <td className="p-2 sm:p-3 border text-center">
                    {index + 1}
                  </td>
                  <td className="p-2 sm:p-3 border">{req.date}</td>
                  {/* Requirement with popup */}
                  <td className="p-2 sm:p-3 border">
                    {req.requirement.length > 30 ? (
                      <div className="flex items-center space-x-2">
                        <span>{req.requirement.slice(0, 30)}...</span>
                        <button
                          onClick={() => openInfoModal(req.requirement)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FcInfo size={16} />
                        </button>
                      </div>
                    ) : (
                      req.requirement
                    )}
                  </td>

                  <td className="p-2 sm:p-3 border">
                    {req.attachment ? (
                      <a
                        href={`http://otplai.com:4006/uploads/${req.attachment}`}
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

                  <td className="p-2 sm:p-3 border text-center">
                    {req.deadline
                      ? new Date(req.deadline).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="p-2 sm:p-3 border text-center">
                    {req.adminComment && req.adminComment.trim() !== "" ? (
                      req.adminComment.length > 30 ? (
                        <div className="flex items-center justify-center space-x-2">
                          <span>{req.adminComment.slice(0, 30)}...</span>
                          <button
                            onClick={() => openInfoModal(req.adminComment)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FcInfo size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="text-gray-700">
                          {req.adminComment}
                        </div>
                      )
                    ) : (
                      <span className="bg-yellow-500 text-white font-semibold px-2 py-1 rounded-lg text-xs">
                        Pending...
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Popup Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-[#32A9C7] animate-fadeIn">
            <h2 className="text-lg font-bold mb-4 text-[#32A9C7] border-b pb-2">
              Add Requirement
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Requirement</label>
                <textarea
                  name="requirement"
                  value={formData.requirement}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 text-sm"
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Attachment</label>
                <input
                  type="file"
                  name="attachment"
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 text-sm"
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#32A9C7] text-white rounded text-sm hover:bg-[#188ca9]"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xl">
            <button
              onClick={closeInfoModal}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-6 bg-blue-500 rounded-sm"></div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 tracking-wide">
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
