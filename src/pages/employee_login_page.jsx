
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


export default function EmployeeLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [emailSuggestionVisible, setEmailSuggestionVisible] = useState(false)

  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);



     useEffect(() => {
     const rememberedEmail = localStorage.getItem("rememberEmployeeEmail");
     const rememberedPassword = localStorage.getItem("rememberEmployeePassword");
     if (rememberedEmail && rememberedPassword) {
      setEmail(rememberedEmail);
      setPassword(rememberedPassword);
      setRememberMe(true);
       }
     }, []);



    const handleLogin = async () => {
  if (!email || !password) {
    setErrorMsg("Please enter both email and password.");
    return;
  }

  try {
    setLoading(true);

    const res = await axios.post("http://localhost:3004/login-employee", {
      email,
      password,
    });
    console.log(" Login Response:", res.data);

    if (res.data.status === 200) {
      localStorage.setItem("employeeEmail", email);
      localStorage.setItem("employeeId", res.data.data._id);
      localStorage.setItem("employeeType", res.data.data.role); //  Important for TL/Employee
      localStorage.setItem("employeeName", res.data.data.name);
      localStorage.setItem("profileImage", res.data.data.profileImage);


      localStorage.setItem("employeeIndustry", res.data.data.industry); // 👈 Add this line



      //  Time and Date storage logic
      const today = new Date().toISOString().split("T")[0];
      const loginTimeKey = `employeeLoginTime_${email}`;
      const loginDateKey = `loginDate_${email}`;
      const storedDate = localStorage.getItem(loginDateKey);

      if (storedDate !== today || !localStorage.getItem(loginTimeKey)) {
        // Agar stored date alag hai ya loginTime exist nahi karta
        const now = new Date();
        const formattedTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        localStorage.setItem(loginTimeKey, formattedTime);
        localStorage.setItem(loginDateKey, today);
      }

      //  Remember me
      if (rememberMe) {
       localStorage.setItem("rememberEmployeeEmail", email);
       localStorage.setItem("rememberEmployeePassword", password);

      } else {
        localStorage.removeItem("rememberEmail");
        localStorage.removeItem("rememberPassword");
      }


      


      //  Redirect
      toast.success("Employee Login Successfully!", {autoClose:2000});
              setTimeout(() => {
      navigate("/employeetimesheetspage");
      },1500)
    } else {
      setErrorMsg(res.data.message);
    }
  } catch (err) {
    setErrorMsg("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
    };



  return (
    <div className="h-screen bg-cover bg-center flex justify-center items-center" style={{ backgroundImage: "url('/background4.avif')" }}>
      
      <div className="w-96 bg-white/20 rounded-xl shadow-xl backdrop-blur-lg border border-white/30">
        <div className="bg-white/30 text-center text-2xl font-bold text-[#1b1e36] py-5">
          <img src="/oxymoranewlogo.png" alt="Logo" className="mx-auto  w-30 h-12" />
        </div>
        <div className="p-8 text-black">
          <h2 className="text-xl font-bold mb-1">Sign In</h2>
          <p className="text-sm mb-5">Enter your email and password to sign in</p>

          {errorMsg && <p className="text-red-600 text-sm mb-3">{errorMsg}</p>}

          <label className="text-sm font-semibold block mb-1">
            <span className="text-red-500 mr-1">*</span>Email
          </label>

       <div className="relative mb-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 rounded border text-sm bg-white/80 text-black"
          value={email}
          onChange={(e) => {
          const val = e.target.value;
            setEmail(val);
            setEmailSuggestionVisible(!val.includes("@") && val.length > 0);
            }}
          autoComplete="off"
        />
      {emailSuggestionVisible && (

        <div
          className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md text-sm cursor-pointer hover:bg-blue-100 px-2 py-1 mt-1"
          onClick={() => {
            setEmail(email + "@gmail.com");
            setEmailSuggestionVisible(false);
            }}>
          {email}@gmail.com
        </div>
      )}
        </div>

          <label className="text-sm font-semibold block mb-1">
            <span className="text-red-500 mr-1">*</span>Password
          </label>


        <div className="relative mb-4">
           <input
             type={showPassword ? "text" : "password"}
             placeholder="Password"
             className="w-full p-2 rounded border text-sm bg-white/80 text-black pr-10"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
           />
           <button
             type="button"
             className="absolute top-2.5 right-3 text-gray-600"
             onClick={() => setShowPassword(!showPassword)}
           >
             {showPassword ? <FaEyeSlash /> : <FaEye />}
           </button>
         </div>

          <div className="flex items-center justify-between mb-5">
            <label className="text-sm text-black">
               <input
                 type="checkbox"
                 className="mr-2"
                 checked={rememberMe}
                 onChange={(e) => setRememberMe(e.target.checked)}
               />
              Remember me
            </label>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-2 bg-[#32A9C7] text-white font-bold rounded hover:bg-[#2794af] transition duration-300"
          >
            {loading ? "Signing in..." : "SIGN IN"}
          </button>

        </div>
      </div>
    </div>
  );
}


