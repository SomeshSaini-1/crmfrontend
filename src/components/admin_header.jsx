
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { MdArrowDropDown } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


export default function AdminHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // const [unread, setUnread] = useState(false);

  const [inventoryDropdownOpen, setInventoryDropdownOpen] = useState(false);



  const [requirementCount, setRequirementCount] = useState(0);
const [leaveCount, setLeaveCount] = useState(0);


useEffect(() => {
  fetchAdminNotifications();
}, []);






const handleRequirementClick = async () => {
  try {
    await axios.post("http://localhost:3004/mark-admin-notifications-read");
    setRequirementCount(0); 
    navigate("/adminrequirementpage");
    setInventoryDropdownOpen(false); // dropdown close bhi ho
  } catch (err) {
    console.error(err);
  }
};







  useEffect(() => {
    fetchAdminNotifications();
  }, []);



const fetchAdminNotifications = async () => {
  try {
    const res = await axios.post("http://localhost:3004/get-admin-notifications");
    if (res.data.success) {
      const notifications = res.data.data;

      // Requirement
      const requirementNotifications = notifications.filter(
        (n) => n.type === "requirement" && !n.isRead
      );
      setRequirementCount(requirementNotifications.length);

      // Leave
      const leaveNotifications = notifications.filter(
        (n) => n.type === "leave" && !n.isRead
      );
      setLeaveCount(leaveNotifications.length);
    }
  } catch (err) {
    console.error("Failed to fetch admin notifications:", err);
  }
};



  const toggleInventoryDropdown = () => {
  setInventoryDropdownOpen((prev) => !prev);
};

const goToStock = () => {
  navigate("/adminstockmanagementpage");
  setInventoryDropdownOpen(false);
};

const goToRequirements = () => {
  navigate("/adminrequirementpage");
  setInventoryDropdownOpen(false);
};




  //  Logout logic
  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

 const confirmLogout = () => {
  localStorage.removeItem("adminEmail");
  localStorage.removeItem("adminId");
  localStorage.removeItem("adminToken");
  localStorage.removeItem("rememberAdminEmail");
  localStorage.removeItem("rememberAdminPassword");

  toast.success("Logout Successfully!", {autoClose:2000});
  setTimeout(() => {
    navigate("/adminloginpage");
  }, 2000)
};


  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };


// for dropdown 
  const toggleDropdown = () => {
  setDropdownOpen((prev) => !prev);
};

const goToProfile = () => {
  navigate("/adminprofile");
  setDropdownOpen(false);
};



  const menuItems = [
    // { label: "Dashboard", path: "/admindashboardpage" },

    { label: "Timesheet", path: "/admintimesheetspage" },
    { label: "Manage Project", path: "/adminmanageprojectpage" },
    { label: "Leave Request", path: "/adminleaverequestpage", showBadge: leaveCount > 0 },
    { label: "Assign Task", path: "/admintasksendpage" },
    // { label: "Suggestions", path: "/adminsuggestionspage" },

  ];

  return (
    <>
    <nav className="w-full bg-[#32A9C7] shadow-md sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-4 flex items-center h-14">
        <div className="flex items-center">
          <img src="/oxymoranewlogo.png" alt="OXYMORA Logo" className="h-11" />
        </div>
        <ul className="flex items-center gap-3 md:gap-6 text-sm md:text-base font-semibold text-white ps-[50px]">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={index} className="relative">

                <Link
                  to={item.path}
                  className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full transition duration-200 ${
                    isActive
                      ? "bg-white text-[#32A9C7] shadow-md"
                      : "hover:bg-white hover:text-[#32A9C7]"
                  }`}
                >
                  {item.label}
                  {item.showBadge && (
                    <span className="ml-1 bg-red-600 text-white text-xs rounded-full px-2 py-[2px]">
                      New
                    </span>
                  )}
                </Link>
              </li>
            );
          })}


          {/* Inventory dropdown button */}
    <li className="relative">
  <button
    onClick={toggleInventoryDropdown}
    className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full transition duration-200 flex items-center gap-1 ${
      location.pathname.includes("/admininventory")
        ? "bg-white text-[#32A9C7] shadow-md"
        : "hover:bg-white hover:text-[#32A9C7]"
    }`}
  >
    Inventory
    {requirementCount > 0 && (
      <span className="ml-1 bg-red-600 text-white text-xs rounded-full px-2 py-[2px]">
        New
      </span>
    )}
  </button>

  {/* Dropdown menu */}
  {inventoryDropdownOpen && (
    <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-300 rounded shadow-md z-50">
      <button
        onClick={goToStock}
        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-black"
      >
        Stock
      </button>
     <button
  onClick={handleRequirementClick} // ← yahan update karna
  className=" w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-black flex justify-between items-center"
>
  Requirements
  {requirementCount > 0 && (
    <span className="ml-2 bg-red-600 text-white text-xs rounded-full px-2 py-[1px]">
      New
    </span>
  )}
</button>
    </div>
  )}
</li>





        </ul>


           <div className="ml-auto relative">

                  <button
                     onClick={toggleDropdown}
                     className="text-white text-4xl font-bold px-3 py-1 hover:bg-white hover:text-[#32A9C7] rounded-full transition">
                     <MdArrowDropDown />
                  </button>

                     {dropdownOpen && (
               <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-md z-50">
                   <button
                       onClick={goToProfile}
                       className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                          My Profile

                  </button>

                   <button
                       onClick={handleLogoutClick}
                       className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                          Logout
                   </button>

              </div>
               )}
           </div>



      </div>
    </nav>


      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Are you sure you want to logout?</h2>
            <div className="flex justify-center gap-4 mt-4">

              <button
                onClick={confirmLogout}
                className="bg-[#32A9C7] text-white px-4 py-2 rounded hover:bg-[#388294]">
                Yes, Logout
              </button>

              <button
                onClick={cancelLogout}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">
                Cancel
              </button>

            </div>
          </div>
        </div>
      )}
      </>
  )
}

