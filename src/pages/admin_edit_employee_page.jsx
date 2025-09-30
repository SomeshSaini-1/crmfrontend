


import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import AdminHeader from "../components/admin_header";
import Select from "react-select";
import { useLocation, useNavigate } from "react-router-dom";
import CreatableSelect from "react-select/creatable";

import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { MdKeyboardArrowDown } from "react-icons/md";



export default function AdminEditEmployeePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const employee = location.state?.employee;
  const fileInputRef = useRef(null);

  const [projectList, setProjectList] = useState([]);
  const [employeeData, setEmployeeData] = useState({ employeeId: "", fullName: "", email: "", password: "", designation: "", project: [], file: null, profileImage: "", dob: "", contact: "", alternate: "", address: "", gender: "", role: "", industry: ""});

  useEffect(() => {
    if (employee) {
      const normalizedProjects = typeof employee.project === "string"
        ? employee.project.split(",").map((p) => ({
            label: p.trim(),
            value: p.trim(),
          }))
        : [];

      setEmployeeData({
        employeeId: employee.id || "",
        fullName: employee.name || "",
        email: employee.email || "",
        password: "",
        designation: employee.designation || "",
        project: normalizedProjects,
        file: null,
        profileImage: employee.profileImage || "",
        dob: employee.dob || "",
        contact: employee.contact || "",
        alternate: employee.alternate || "",
        address: employee.address || "",
        gender: employee.gender || "",
        role: employee.role || "",
        industry: employee.industry || "",
        showStockOption: employee.showStockOption || false, 
      });
    }

    fetchProjects();
  }, [employee]);

  const fetchProjects = async () => {
    try {
      const res = await axios.post("http://otplai.com:4006/view-project");
      if (res.data.success) {
        setProjectList(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setEmployeeData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { employeeId, fullName, email, designation, project } = employeeData;

    if (
      !employeeId ||
      !fullName ||
      !email ||
      !designation ||
      !project.length ||
      !employeeData.dob ||
      !employeeData.contact ||
      !employeeData.alternate ||
      !employeeData.address ||
      !employeeData.gender ||
      !employeeData.role ||
      !employeeData.industry 
    ) {
      // alert("All fields except password are required.");
      toast.error("All fields are required but password is not required.", {position: "top-center", autoClose: 2000});

      return;
    }

    try {
      const formData = new FormData();
      formData.append("_id", employee._id);
      formData.append("id", employeeData.employeeId);
      formData.append("name", employeeData.fullName);
      formData.append("email", employeeData.email);
      formData.append("designation", employeeData.designation);
      formData.append("dob", employeeData.dob);
      formData.append("contact", employeeData.contact);
      formData.append("alternate", employeeData.alternate);
      formData.append("address", employeeData.address);
      formData.append("gender", employeeData.gender);
      formData.append("role", employeeData.role);
      formData.append("industry", employeeData.industry);
      formData.append("project", employeeData.project.map((p) => p.value).join(","));
      formData.append("showStockOption", employeeData.showStockOption ? "true" : "false");


      if (employeeData.password.trim() !== "") {
        formData.append("password", employeeData.password);
      }

      if (employeeData.file) {
        formData.append("profileImage", employeeData.file);
      }

      const res = await axios.post("http://otplai.com:4006/edit-employee", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        // alert("Employee updated successfully!");
        toast.success("Employee updated successfully!");
        setTimeout(() => {
          navigate("/admintimesheetspage");
        },2000)

        


      } else {
        toast.error(res.data.message || "Update failed.", {position:"top-center"});
      }
    } catch (err) {
      console.error("Update error:", err.message);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-[#CDE6EC] flex flex-col">
  <div className="sticky top-0 z-50">
    <AdminHeader />
  </div>

  <div className="flex justify-center flex-1 mt-6 mb-6 px-4">
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-4xl">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
        Edit Employee
      </h2>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
        
        {/* Stock Option Checkbox */}
        <div className="md:col-span-2 flex items-center gap-3 border p-3 rounded-lg bg-blue-50">
          <input
            type="checkbox"
            id="showStockOption"
            name="showStockOption"
            checked={employeeData.showStockOption || false}
            onChange={(e) =>
              setEmployeeData({
                ...employeeData,
                showStockOption: e.target.checked,
              })
            }
            className="h-5 w-5"
          />
          <label htmlFor="showStockOption" className="text-sm font-medium text-gray-700">
            Allow Stock Option Access
          </label>
        </div>

        {/* Employee ID */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Employee ID</label>
          <input
            type="text"
            name="employeeId"
            placeholder="Enter Employee ID"
            value={employeeData.employeeId}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            placeholder="Enter Full Name"
            value={employeeData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={employeeData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Change Password (optional)</label>
          <input
            type="password"
            name="password"
            placeholder="Enter New Password"
            value={employeeData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* DOB */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={employeeData.dob}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Contact */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Contact Number</label>
          <input
            type="text"
            name="contact"
            placeholder="Enter Contact Number"
            value={employeeData.contact}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Alternate Contact */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Alternate Number</label>
          <input
            type="text"
            name="alternate"
            placeholder="Enter Alternate Number"
            value={employeeData.alternate}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Address</label>
          <input
            name="address"
            placeholder="Enter Address"
            value={employeeData.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Gender</label>
          <div className="relative">
            <select
              name="gender"
              value={employeeData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 pr-8 border rounded-lg text-sm bg-white appearance-none focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl pointer-events-none">
              <MdKeyboardArrowDown />
            </span>
          </div>
        </div>

    
          {/* Role */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Role</label>
            <div className="relative">
              <select
                name="role"
                value={employeeData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 pr-8 border rounded-lg text-sm bg-white appearance-none focus:ring-2 focus:ring-blue-400 outline-none"
              >
                <option value="">Select Role</option>
                <option value="Employee">Employee</option>
                <option value="Employee TL">Employee TL</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl pointer-events-none">
                <MdKeyboardArrowDown />
              </span>
            </div>
          </div>

          {/* Projects */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Projects</label>
            <Select
              isMulti
              name="project"
              options={projectList.map((proj) => ({
                label: proj.project_name,
                value: proj.project_name,
              }))}
              value={employeeData.project}
              onChange={(selected) =>
                setEmployeeData((prev) => ({
                  ...prev,
                  project: selected,
                }))
              }
              className="text-sm"
              classNamePrefix="select"
              placeholder="Select projects..."
            />
          </div>
        

        {/* Industry */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Industry</label>
          <div className="relative">
            <select
              name="industry"
              value={employeeData.industry}
              onChange={handleChange}
              className="w-full px-4 py-2 pr-8 border rounded-lg text-sm bg-white appearance-none focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="">Select Industry</option>
              <option value="Software">Software</option>
              <option value="Firmware/Embedded">Firmware/Embedded</option>
              <option value="Hardware">Hardware</option>
              <option value="HR">HR</option>
              <option value="BA">BA</option>
              <option value="Sales & Marketing">Sales & Marketing</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl pointer-events-none">
              <MdKeyboardArrowDown />
            </span>
          </div>
        </div>

        {/* Profile Image */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-600 mb-1">Profile Image</label>
          <input
            type="file"
            name="file"
            onChange={handleChange}
            ref={fileInputRef}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none"
          />
          {employeeData.profileImage && !employeeData.file && (
            <img
              src={
                employeeData.profileImage.startsWith("http")
                  ? employeeData.profileImage
                  : `https://otplai.com/Metallicz/Myapi/upload_logo/${employeeData.profileImage}`
              }
              alt="Profile Preview"
              onError={(e) => (e.target.style.display = "none")}
              className="mt-3 w-24 h-24 object-cover rounded-full border shadow-md"
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="md:col-span-2 flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => navigate("/admintimesheetspage")}
            className="w-32 text-blue-600 border border-blue-600 py-2 rounded-lg hover:bg-blue-50 text-sm font-semibold transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-32 bg-[#32A9C7] text-white py-2 rounded-lg hover:bg-[#5895a4] text-sm font-semibold transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
    </div>

  );
}