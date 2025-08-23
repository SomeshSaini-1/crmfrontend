
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import AdminHeader from "../components/admin_header";
import Select from "react-select";
import { useLocation, useNavigate } from "react-router-dom";
import CreatableSelect from "react-select/creatable";

import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


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
      });
    }

    fetchProjects();
  }, [employee]);

  const fetchProjects = async () => {
    try {
      const res = await axios.post("http://localhost:3004/view-project");
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

      if (employeeData.password.trim() !== "") {
        formData.append("password", employeeData.password);
      }

      if (employeeData.file) {
        formData.append("profileImage", employeeData.file);
      }

      const res = await axios.post("http://localhost:3004/edit-employee", formData, {
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
    <div className="min-h-screen bg-[#CDE6EC]">
      <div className="sticky top-0 z-50">
        <AdminHeader />
      </div>
      {/* <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} /> */}

      <div className="flex justify-center mt-6 px-4">
        <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-3xl">
          <h2 className="text-xl font-semibold text-blue-700 mb-4 text-center">
            Edit Employee
          </h2>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>


            <input type="text" name="employeeId" placeholder="Employee ID" value={employeeData.         employeeId} onChange={handleChange} className="px-4 py-2 border rounded-md text-sm" />

            <input type="text" name="fullName" placeholder="Full Name" value={employeeData.fullName} onChange={handleChange} className="px-4 py-2 border rounded-md text-sm" />

            <input type="email" name="email" placeholder="Email" value={employeeData.email} onChange={handleChange} className="px-4 py-2 border rounded-md text-sm" />

            <input type="password" name="password" placeholder="Change Password (optional)" value={employeeData.password} onChange={handleChange} className="px-4 py-2 border rounded-md text-sm" />

            <input type="date" name="dob" value={employeeData.dob} onChange={handleChange} className="px-4 py-2 border rounded-md text-sm" />

            <input type="text" name="contact" placeholder="Contact Number" value={employeeData.contact} onChange={handleChange} className="px-4 py-2 border rounded-md text-sm" />

            <input type="text" name="alternate" placeholder="Alternate Number" value={employeeData.alternate} onChange={handleChange} className="px-4 py-2 border rounded-md text-sm" />

            <textarea name="address" placeholder="Address" value={employeeData.address} onChange={handleChange} className="px-4 py-2 border rounded-md text-sm" />

            <select name="gender" value={employeeData.gender} onChange={handleChange} className="px-4 py-2 border rounded-md text-sm bg-white">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            {/* <select name="designation" value={employeeData.designation} onChange={handleChange} className="px-4 py-2 border rounded-md text-sm bg-white">
              <option value="">Select Designation</option>
              <option value="Software developer">Software developer</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Project manager">Project manager</option>
              <option value="Director">Director</option>
              <option value="Mobile app developer">Mobile app developer</option>
              <option value="Flutter developer">Flutter developer</option>
              <option value="IoT Developer">IoT Developer</option>
              <option value="Network Engineer">Network Engineer</option>
              <option value="IoT Data Scientist">IoT Data Scientist</option>
              <option value="IoT Security Specialist">IoT Security Specialist</option>
            </select> */}



               <CreatableSelect
          isClearable
          options={[
            { value: "Software developer", label: "Software developer" },
            { value: "Frontend Developer", label: "Frontend Developer" },
            { value: "Backend Developer", label: "Backend Developer" },
            { value: "Project manager", label: "Project manager" },
            { value: "HR", label: "HR" },
            { value: "Mobile app developer", label: "Mobile app developer" },
            { value: "Flutter developer", label: "Flutter developer" },
            { value: "IoT Developer", label: "IoT Developer" },
            { value: "Network Engineer", label: "Network Engineer" },
            { value: "IoT Data Scientist", label: "IoT Data Scientist" },
            { value: "IoT Security Specialist", label: "IoT Security Specialist" },
          ]}
          onChange={(selectedOption) =>
            setEmployeeData({
              ...employeeData,
              designation: selectedOption ? selectedOption.value : "",
            })
          }
          value={
            employeeData.designation
              ? { value: employeeData.designation, label: employeeData.designation }
              : null
          }
          className="text-sm"
          classNamePrefix="select"
          placeholder="Select or type designation..."
        />



            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
  <select
    name="role"
    value={employeeData.role}
    onChange={handleChange}
    className="w-full px-4 py-2 border rounded-md text-sm bg-white"
  >
    <option value="">Select Role</option>
    <option value="Employee">Employee</option>
    <option value="Employee TL">Employee TL</option>
  </select>

  <Select
    isMulti
    name="project"
    options={projectList.map((proj) => ({ label: proj.project_name, value: proj.project_name }))}
    value={employeeData.project}
    onChange={(selected) => 
      setEmployeeData((prev) => ({
        ...prev,
        project: selected,
      }))
    }
    className="text-sm"
    classNamePrefix="select"
    placeholder="Select projects..."/>
     </div>



     <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
             <select
                name="industry"
                value={employeeData.industry}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md text-sm bg-white"
             >
                <option value="">Select industry</option>
                <option value="Software">Software</option>
                <option value="Firmware/Embedded">Firmware/Embedded</option>
                <option value="Hardware">Hardware</option>
                <option value="HR">HR</option>
                <option value="BA">BA</option>
                <option value="Sales & Marketing">Sales & Marketing</option>

             </select>
             </div>



            <div className="md:col-span-2">
              <label className="block mb-1 font-semibold ">Profile Image</label>
              <input
                type="file"
                name="file"
                onChange={handleChange}
                ref={fileInputRef}
                className="w-full px-3 py-2 border rounded-md text-sm"
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
                  className="mt-2 w-24 h-24 object-cover rounded-full border"
                />
              )}
            </div>

            <div className="md:col-span-2 flex justify-end gap-4 mt-4">
              <button type="button" onClick={() => navigate("/admintimesheetspage")} className="w-32 text-blue-600 border border-blue-600 py-2 rounded-md hover:bg-blue-50 text-sm">Cancel</button>
              <button type="submit" className="w-32 bg-[#32A9C7] text-white py-2 rounded-md hover:bg-[#5895a4] text-sm">Save Changes</button>
              
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


