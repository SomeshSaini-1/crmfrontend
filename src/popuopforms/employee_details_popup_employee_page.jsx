import React, { useEffect, useState } from "react";
import axios from "axios";
import EmployeeHeader from "../components/employee_header";

export default function EmployeeProfilePage() {
  const [employee, setEmployee] = useState(null);


  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await axios.post("http://otplai.com:4006/view-employee");
        if (res.data.success) {
          const email = localStorage.getItem("employeeEmail");
          const emp = res.data.data.find((e) => e.email === email);
          if (emp) setEmployee(emp);
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployee();
  }, []);

  const Field = ({ label, value }) => (
    <div>
      <label className="block text-sm font-medium text-gray-600">{label}</label>
      <p className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-700">{value || "N/A"}</p>
    </div>
  );

  const profileImage =
    employee?.profileImage || "/user1.jpg";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <EmployeeHeader/>
    <div className="min-h-screen bg-[#CDE6EC] p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-8 border-l-4 border-[#32A9C7]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#32A9C7]">My Profile</h2>
          <img
            src={profileImage}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border-2 border-blue-400"
          />
        </div>

        {employee ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Employee ID" value={employee.id} />
            <Field label="Full Name" value={employee.name} />
            <Field label="Email" value={employee.email} />
            {/* <Field label="Password" value={employee.password} /> */}
            <Field label="Address" value={employee.address} />
            <Field label="Gender" value={employee.gender} />
            <Field label="Date of Birth" value={employee.dob} />
            <Field label="Contact" value={employee.contact} />
            <Field label="Alternate No." value={employee.alternate} />
            
            <Field label="Designation" value={employee.designation} />
            <Field label="Role" value={employee.role} />
            <Field label="industry" value={employee.industry} />




            <Field
    label="Project(s)"
    value={Array.isArray(employee.project) ? employee.project.join(", ") : employee.project}
  />

  <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
    <a
      href="/employeetimesheetspage"
      className="inline-block bg-[#32A9C7] hover:bg-[#2795B0] text-white text-sm font-semibold py-2 px-6 rounded-md transition"
    >
      Back to Timesheet
    </a>
  </div> 
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-8">Loading profile...</p>
        )}
      </div>
    </div>
    </div>
  );
}
