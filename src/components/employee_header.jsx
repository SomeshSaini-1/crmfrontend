

import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { MdArrowDropDown, MdMenu, MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EmployeeHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [inventoryDropdownOpen, setInventoryDropdownOpen] = useState(false);
  const [employeeIndustry, setEmployeeIndustry] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [employee, setEmployee] = useState(null);


  // Fetch notifications
  useEffect(() => {
    const fetchNotificationCount = async () => {
      const email = localStorage.getItem("employeeEmail");
      if (!email) return;

      try {
        const res = await axios.post("http://otplai.com:4006/view-employee");
        if (res.data.success) {


          const foundEmployee = res.data.data.find((emp) => emp.email === email);
if (foundEmployee) {
  setEmployee(foundEmployee); // 👈 yaha state me save kar diya

  const notiRes = await axios.post(
    "http://otplai.com:4006/get-employee-notifications",
    { employeeId: foundEmployee._id }
  );
  if (notiRes.data.success) {
    const unread = notiRes.data.data.filter((n) => !n.isRead);
    setUnreadCount(unread.length);
  }
}



        }
      } catch (err) {
        console.error("Notification fetch error:", err);
      }
    };

    fetchNotificationCount();
  }, []);

  useEffect(() => {
    const industry = localStorage.getItem("employeeIndustry");
    if (industry) setEmployeeIndustry(industry);
  }, []);

  useEffect(() => {
    if (location.pathname === "/employeeviewtaskpage") {
      setUnreadCount(0);
    }
  }, [location.pathname]);

  // Logout logic
  const handleLogoutClick = () => setShowLogoutConfirm(true);

 const confirmLogout = () => {
  //  localStorage.clear() hatao
  //  sirf employee related keys delete karo
  localStorage.removeItem("employeeEmail");
  localStorage.removeItem("employeeId");
  localStorage.removeItem("employeeType");
  localStorage.removeItem("employeeName");
  localStorage.removeItem("profileImage");
  localStorage.removeItem("employeeToken");
  localStorage.removeItem("employeeIndustry");

  // 👇 loginTimeKey aur loginDateKey ko intentionally remove nahi kiya
  // taki same din ka login time preserve rahe

  toast.success("Logout Successfully!", { autoClose: 2000 });
  setTimeout(() => navigate("/"), 2000);
};



  const cancelLogout = () => setShowLogoutConfirm(false);

  // Dropdowns
  const toggleDropdown = () => setDropdownOpen((p) => !p);
  const goToProfile = () => {
    navigate("/employeedeatilsemployeesidepage");
    setDropdownOpen(false);
  };

  const menuItems = [
    { label: "Timesheets", path: "/employeetimesheetspage" },
    { label: "Leave Request", path: "/employeeleaverequestpage" },
    { label: "Assign Task", path: "/employeeviewtaskpage" },
  ];

  return (
    <>
      <nav className="w-full bg-[#32A9C7] shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          {/* Logo */}
          <img
            src="/oxymoranewlogo.png"
            alt="OXYMORA Logo"
            className="h-11"
          />

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-6 text-sm md:text-base font-semibold text-white">
            {menuItems.map((item, i) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={i}>
                  <Link
                    to={item.path}
                    className={`px-4 py-2 rounded-full transition ${
                      isActive
                        ? "bg-white text-[#32A9C7] shadow-md"
                        : "hover:bg-white hover:text-[#32A9C7]"
                    }`}
                  >
                    {item.label}
                    {item.label === "Assign Task" && unreadCount > 0 && (
                      <span className="ml-1 bg-red-600 text-white text-xs rounded-full px-2 py-[2px]">
                        New
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}

            {/* Inventory */}
            <li className="relative">
              <button
                onClick={() => setInventoryDropdownOpen((p) => !p)}
                className="px-4 py-2 rounded-full transition hover:bg-white hover:text-[#32A9C7] text-white"
              >
                Inventory
              </button>

              {inventoryDropdownOpen && (
                <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded shadow-md z-50 w-40 text-sm">
                  

                    {employee?.showStockOption && (
  <button
    onClick={() => {
      navigate("/employeestockmanagementpage");
      setInventoryDropdownOpen(false);
      setMobileMenuOpen(false);
    }}
    className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-black bg-white rounded"
  >
    Stock
  </button>
)}



                  <button
                    onClick={() => {
                      navigate("/employeerequirementform");
                      setInventoryDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-black"
                  >
                    Requirement
                  </button>
                </div>
              )}
            </li>
          </ul>

          {/* Profile dropdown + Mobile Menu button */}
          <div className="flex items-center gap-2">
            {/* Mobile menu button */}
            <button
              className="text-white text-3xl md:hidden"
              onClick={() => setMobileMenuOpen((p) => !p)}
            >
              {mobileMenuOpen ? <MdClose /> : <MdMenu />}
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="text-white text-3xl font-bold px-2 py-1 hover:bg-white hover:text-[#32A9C7] rounded-full transition"
              >
                <MdArrowDropDown />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-md z-50">
                  <button
                    onClick={goToProfile}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={handleLogoutClick}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#32A9C7] px-4 py-3 space-y-2 text-white font-semibold">
            {menuItems.map((item, i) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={i}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded ${
                    isActive
                      ? "bg-white text-[#32A9C7] shadow-md"
                      : "hover:bg-white hover:text-[#32A9C7]"
                  }`}
                >
                  {item.label}
                  {item.label === "Assign Task" && unreadCount > 0 && (
                    <span className="ml-1 bg-red-600 text-white text-xs rounded-full px-2 py-[2px]">
                      New
                    </span>
                  )}
                </Link>
              );
            })}

            <button
              onClick={() => setInventoryDropdownOpen((p) => !p)}
              className="w-full text-left px-3 py-2 rounded hover:bg-white hover:text-[#32A9C7]"
            >
              Inventory
            </button>
            {inventoryDropdownOpen && (
              <div className="pl-4">


               {employee?.showStockOption && (
  <button
    onClick={() => {
      navigate("/employeestockmanagementpage");
      setInventoryDropdownOpen(false);
      setMobileMenuOpen(false);
    }}
    className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-black bg-white rounded"
  >
    Stock
  </button>
)}


                <button
                  onClick={() => {
                    navigate("/employeerequirementform");
                    setInventoryDropdownOpen(false);
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-black bg-white rounded mt-1"
                >
                  Requirement
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Logout Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Are you sure you want to logout?
            </h2>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={confirmLogout}
                className="bg-[#32A9C7] text-white px-4 py-2 rounded hover:bg-[#388294]"
              >
                Yes, Logout
              </button>
              <button
                onClick={cancelLogout}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
