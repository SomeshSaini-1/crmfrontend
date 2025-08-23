
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import AdminHeader from "../components/admin_header";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import CreatableSelect from "react-select/creatable";

import { IoCheckmarkCircle } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";

import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';





export default function AdminManageEmployeePage() {
  const [projectList, setProjectList] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [emailSuggestionVisible, setEmailSuggestionVisible] = useState(false);

  const [employeeIdValid, setEmployeeIdValid] = useState(null); 
// null = not checked, true = available, false = already exists


const [contactError, setContactError] = useState("");
const [alternateError, setAlternateError] = useState("");



  const [employeeData, setEmployeeData] = useState({
    employeeId: "",
    fullName: "",
    email: "",
    password: "",
    designation: "",
    project: "",
    file: null,
    dob: "",
    contact: "",
    alternate: "",
    address: "",
    gender: "",
    role: "",
    industry: "",
  });


  const fetchProjects = async () => {
    try {
      const res = await axios.post("http://localhost:3004/view-project");
      if (res.data.success) setProjectList(res.data.data);
      else setProjectList([]);
    } catch (err) {
      console.error("Failed to fetch projects:", err.message);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);



  const checkEmployeeId = async (id) => {
  if (!id) {
    setEmployeeIdValid(null);
    return;
  }
  try {
    const res = await axios.post("http://localhost:3004/check-employee-id", { employeeId: id });
    if (res.data.exists) {
      setEmployeeIdValid(false); //  already exists
    } else {
      setEmployeeIdValid(true);  //  available
    }
  } catch (err) {
    console.error("Error checking employeeId:", err.message);
    setEmployeeIdValid(null);
  }
};




 const handleChange = (e) => {
  const { name, value, files } = e.target;

  if (name === "project") return;

 if (name === "contact" || name === "alternate") {
  if (/^\d{0,10}$/.test(value)) {
    setEmployeeData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error as user types
    if (name === "contact" && value.length === 10) setContactError("");
    if (name === "alternate" && value.length === 10) setAlternateError("");
  }

  return;
}


 if (name === "employeeId") {
  // Only allow digits
  if (/^\d*$/.test(value)) {
    setEmployeeData((prev) => ({ ...prev, [name]: value }));
    checkEmployeeId(value); // API call to backend
  }
  return;
}


  //  Email field suggestion logic
if (name === "email") {
  const lowerEmail = value.toLowerCase(); // convert to lowercase
  setEmployeeData((prev) => ({
    ...prev,
    [name]: lowerEmail,
  }));
  setEmailSuggestionVisible(!lowerEmail.includes("@") && lowerEmail.length > 0);
  return;
}



  

  setEmployeeData((prev) => ({
    ...prev,
    [name]: files ? files[0] : value,
  }));
};






   const handleSubmit = async (e) => {
    e.preventDefault();

    const { employeeId, fullName, email, password, designation, project, dob, contact, alternate, address, gender, role, industry } = employeeData;

    if (!employeeId || !fullName || !email || !password || !designation || !project || !dob || !contact || !alternate || !address || !gender || !role || !industry) {

      if (contact.length !== 10 || alternate.length !== 10) {
  if (contact.length !== 10) setContactError("Contact number must be exactly 10 digits.");
  if (alternate.length !== 10) setAlternateError("Alternate number must be exactly 10 digits.");
  toast.error("Phone numbers must be exactly 10 digits.");
  return;
}


      // alert("All detail required.");
      toast.error("All detail required.", {position: "top-center", autoClose: 3000});

      return;
    }

    try {
      const formData = new FormData();
      formData.append("id", employeeData.employeeId);
      formData.append("name", employeeData.fullName);
      formData.append("email", employeeData.email);
      formData.append("password", employeeData.password);
      formData.append("designation", employeeData.designation);
      formData.append("project", employeeData.project);
      formData.append("dob", employeeData.dob);
      formData.append("contact", employeeData.contact);
      formData.append("alternate", employeeData.alternate);
      formData.append("address", employeeData.address);
      formData.append("gender", employeeData.gender);
      formData.append("role", employeeData.role);
      formData.append("industry", employeeData.industry);


      if (employeeData.file) {
        formData.append("profileImage", employeeData.file);
      }

      const res = await axios.post("http://localhost:3004/add-employee", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Employee added successfully!");
        setTimeout(() => {
          navigate("/admintimesheetspage")
        },3000)
        
       
        //  toast.success(msg)
        //     setTimeout(() => {
        //         navigate('/product')
        //     },2000);



        setEmployeeData({
          employeeId: "",
          fullName: "",
          email: "",
          password: "",
          designation: "",
          project: "",
          file: null,
          dob: "",
          contact: "",
          alternate: "",
          address: "",
          gender: "",
          role: "",
          industry: "",
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        // alert(res.data.message || "Failed to add employee.");
        toast.error(res.data.message || "Failed to add employee.");

      }
    } catch (err) {
      console.error("Error adding employee:", err.message);
      // alert("Something went wrong.");
      toast.error("Something went wrong.");

    }
  };



  // ⬇ Industry wise designations list
const designationOptionsByIndustry = {
  Software: [
    { value: "Software Developer", label: "Software Developer" },
    { value: "Frontend Developer", label: "Frontend Developer" },
    { value: "Backend Developer", label: "Backend Developer" },
    { value: "Mobile App Developer", label: "Mobile App Developer" },
    { value: "Flutter Developer", label: "Flutter Developer" },
    { value: "Project Manager", label: "Project Manager" },
  ],
  "Firmware/Embedded": [
    { value: "Embedded Engineer", label: "Embedded Engineer" },
    { value: "IoT Developer", label: "IoT Developer" },
    { value: "Firmware Developer", label: "Firmware Developer" },
    { value: "IoT Data Scientist", label: "IoT Data Scientist" },
    { value: "IoT Security Specialist", label: "IoT Security Specialist" },
  ],
  Hardware: [
    { value: "Hardware Engineer", label: "Hardware Engineer" },
    { value: "Network Engineer", label: "Network Engineer" },
    { value: "PCB Designer", label: "PCB Designer" },
    { value: "VLSI Engineer", label: "VLSI Engineer" },
  ],
  HR: [
    { value: "HR Executive", label: "HR Executive" },
    { value: "HR Manager", label: "HR Manager" },
    { value: "Talent Acquisition Specialist", label: "Talent Acquisition Specialist" },
  ],
  BA: [
    { value: "Business Analyst", label: "Business Analyst" },
    { value: "Product Analyst", label: "Product Analyst" },
    { value: "Project Coordinator", label: "Project Coordinator" },
  ],
  "Sales & Marketing": [
    { value: "Sales Executive", label: "Sales Executive" },
    { value: "Marketing Manager", label: "Marketing Manager" },
    { value: "Digital Marketing Specialist", label: "Digital Marketing Specialist" },
    { value: "Business Development Executive", label: "Business Development Executive" },
  ],
};




  return (
    <div className="min-h-screen bg-[#CDE6EC]">
      <div className="sticky top-0 z-50">
        <AdminHeader />
      </div>
      {/* <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} /> */}
      

      <div className="flex justify-center mt-6 px-4">
  <div className="bg-white p-8 pb-8 rounded-xl shadow-xl w-full max-w-3xl my-8">
    <h2 className="text-xl font-semibold text-blue-700 mb-6 text-center">
      Add New Employee
    </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

           <div className="relative">
             <input
                type="text"
                name="employeeId"
                placeholder="Enter Employee ID"
                value={employeeData.employeeId}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md text-sm"
             />

              {employeeIdValid === true && (
                <span className="absolute right-3 top-2 text-green-500 text-lg"><IoCheckmarkCircle/></span>
               )}
              {employeeIdValid === false && (
              <span className="absolute right-3 top-2 text-red-500 text-lg"><RxCross2/></span>
                )}
            </div>

            
            <input type="text" name="fullName" placeholder="Enter Full Name" value={employeeData.fullName} onChange={handleChange} className="w-full px-4 py-2 border rounded-md text-sm" />




          <div className="relative">
              <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  value={employeeData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md text-sm"
                  autoComplete="off"
              />

             {emailSuggestionVisible && (
  <div
    className="px-4 py-2 absolute z-20 left-0 right-0 bg-white border border-gray-300 rounded-md text-sm cursor-pointer hover:bg-blue-100"
    onClick={() => {
      setEmployeeData((prev) => ({
        ...prev,
        email: prev.email + "@gmail.com",
      }));
      setEmailSuggestionVisible(false);
    }}
  >
    {employeeData.email.toLowerCase()}@gmail.com
  </div>
)}


          </div>



          <div className="relative">

              <input
                 type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter Password"
                value={employeeData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 pr-10 border rounded-md text-sm"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-2.5 right-3 text-gray-600">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>

          </div>

            {/* <input type="date" name="dob" value={employeeData.dob || ""} onChange={handleChange}
               className="w-full px-4 py-2 border rounded-md text-sm"
               max={new Date().toISOString().split("T")[0]}/> */}



               <input
                   type="date"
                   name="dob"
                   value={employeeData.dob || ""}
                   onChange={handleChange}
                   className="w-full px-4 py-2 border rounded-md text-sm"
                   max={new Date(
                   new Date().setFullYear(new Date().getFullYear() - 16)
                   )
                  .toISOString()
                  .split("T")[0]}
               />



               
            <div>
  <input
    type="text"
    name="contact"
    placeholder="Contact Number"
    value={employeeData.contact || ""}
    onChange={handleChange}
    className="w-full px-4 py-2 border rounded-md text-sm"
  />
  {contactError && <p className="text-red-500 text-xs mt-1">{contactError}</p>}
</div>

<div>
  <input
    type="text"
    name="alternate"
    placeholder="Alternate Number"
    value={employeeData.alternate || ""}
    onChange={handleChange}
    className="w-full px-4 py-2 border rounded-md text-sm"
  />
  {alternateError && <p className="text-red-500 text-xs mt-1">{alternateError}</p>}
</div>


            {/* <textarea name="address" placeholder="Address" value={employeeData.address || ""} onChange={handleChange} className="w-full px-4 py-1 border rounded-md text-sm" /> */}


            <textarea name="address" placeholder="Address" value={employeeData.address || ""} onChange={handleChange} className="w-full px-4 py-1 border rounded-md text-sm resize-y overflow-auto"/>
            


            <select name="gender" value={employeeData.gender || ""} onChange={handleChange} className="w-full px-4 py-2 border rounded-md text-sm bg-white">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>



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






            {/* <CreatableSelect
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
        /> */}



        <CreatableSelect
  isClearable
  // isDisabled={!employeeData.industry} // disable until industry selected
  options={designationOptionsByIndustry[employeeData.industry] || []}
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
  placeholder={
    employeeData.industry
      ? "Select or type designation..."
      : "Please select industry first"
  }
/>





          {/* <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6"> */}
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
    onChange={(selectedOptions) => {
      setEmployeeData((prev) => ({
        ...prev,
        project: selectedOptions.map((opt) => opt.value),
      }));
    }}
    className="text-sm"
    classNamePrefix="select"
    placeholder="Select projects..."
  />
          {/* </div> */}

          {/* <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
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
             </div> */}

                  
            <div className="col-span-1 md:col-span-2">
              <label className="block mb-1 font-semibold ">Profile Image</label>
              <input
                type="file"
                name="file"
                onChange={handleChange}
                ref={fileInputRef}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>

            <div className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-4">
              <button
                type="button" onClick={() => navigate("/admintimesheetspage")}
                className="w-32 text-blue-600 border border-blue-600 py-2 rounded-md hover:bg-blue-50 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-32 bg-[#32A9C7] text-white py-2 rounded-md hover:bg-blue-700 text-sm"
              >
                Confirm
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}