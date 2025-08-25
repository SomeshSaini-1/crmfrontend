
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailSuggestionVisible, setEmailSuggestionVisible] = useState(false);

  

useEffect(() => {
  const rememberedEmail = localStorage.getItem("rememberAdminEmail");
  const rememberedPassword = localStorage.getItem("rememberAdminPassword");
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
      const response = await axios.post("http://localhost:3004/admin-login", {
        email,
        password,
      });

      const resData = response.data;

      if (resData.success) {
        localStorage.setItem("adminToken", resData.token);
        localStorage.setItem("adminId", resData.data._id);
        localStorage.setItem("adminName", resData.data.name);
        localStorage.setItem("adminEmail", resData.data.email);


        // if (rememberMe) {
        //     localStorage.setItem("rememberAdminEmail", email);
        //     localStorage.setItem("rememberAdminPassword", password);

        // } else {
        //      localStorage.removeItem("rememberEmail");
        //      localStorage.removeItem("rememberPassword");
        // }



        if (rememberMe) {
  localStorage.setItem("rememberAdminEmail", email);
  localStorage.setItem("rememberAdminPassword", password);
} else {
  localStorage.removeItem("rememberAdminEmail");
  localStorage.removeItem("rememberAdminPassword");
}




        toast.success("Admin Login Successfully!", {autoClose:2000});
                      setTimeout(() => {
        navigate("/admintimesheetspage");
        },2000)
      } else {
        setErrorMsg(resData.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg("Something went wrong. Please try again.");
    }
  };
  



  return (
    <div className="h-screen bg-cover bg-center flex justify-center items-center"
      style={{ backgroundImage: "url('/background4.avif')" }}>

        

      <div className="w-[400px] bg-white/20 rounded-xl shadow-xl backdrop-blur-lg border border-white/30 overflow-hidden">

        <div className="bg-white/30 text-center text-2xl font-bold text-[#1b1e36] py-5">
          <img src="/oxymoranewlogo.png" alt="Logo" className="mx-auto w-30 h-12" />
        </div>

        <div className="px-8 py-6 text-black">
          <h2 className="text-xl font-bold mb-1 text-center">Sign in Admin</h2>
          <p className="text-sm mb-4 text-center">Enter your email and password to sign in</p>

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
              autoComplete="off"/>

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
                  onClick={() => setShowPassword(!showPassword)}>

           {showPassword ? <FaEyeSlash /> : <FaEye />}
             </button>
          </div>


          <div className="flex items-center justify-between mb-5">
            <label className="text-sm text-black">
             <input
               type="checkbox"
               className="mr-2"
               checked={rememberMe}
               onChange={(e) => setRememberMe(e.target.checked)}/>
              Remember me
            </label>

          </div>

          <button
            onClick={handleLogin}
            className="w-full py-2 bg-[#32A9C7] text-white font-bold rounded hover:bg-[#2794af] transition duration-300">
            SIGN IN
          </button>

        </div>
      </div>
    </div>
  );
}
