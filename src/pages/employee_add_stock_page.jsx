
// import React, { useState } from "react";
// import axios from "axios";
// import EmployeeHeader from "../components/employee_header";
// import { useNavigate } from "react-router-dom";


// import { ToastContainer, toast } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';


// const EmployeeAddStockPage = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     category: "",
//     packages: "",
//     totalReel: "",
//     totalQty: "",
//     usedQty: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//     const navigate = useNavigate();
  

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // Allow only digits for numeric fields
//     const numericFields = ["packages", "totalReel", "totalQty", "usedQty"];
//     if (numericFields.includes(name) && value !== "" && !/^\d+$/.test(value)) {
//       return;
//     }

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   setLoading(true);
//   //   setMessage("");

//   //   try {
//   //     const response = await axios.post("http://otplai.com:4006/add-employee-stock", {
//   //       name: formData.name,
//   //       category: formData.category,
//   //       packages: formData.packages,
//   //       total_reel: formData.totalReel,
//   //       total_qty: formData.totalQty,
//   //       used_qty: formData.usedQty,
//   //     });

//   //     const res = response.data;

//   //     if (res.success) {
//   //       setMessage("✅ Stock added successfully!");
//   //       setFormData({
//   //         name: "",
//   //         category: "",
//   //         packages: "",
//   //         totalReel: "",
//   //         totalQty: "",
//   //         usedQty: "",
//   //       });
//   //     } else {
//   //       setMessage(`❌ ${res.message}`);
//   //     }
//   //   } catch (error) {
//   //     setMessage("❌ Server error while adding stock.");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };



//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);
//   setMessage("");

//   const employeeName = localStorage.getItem("employeeName"); // 👈 fetch addBy

//   try {
//     const response = await axios.post("http://otplai.com:4006/add-employee-stock", {
//       name: formData.name,
//       category: formData.category,
//       packages: formData.packages,
//       total_reel: formData.totalReel,
//       total_qty: formData.totalQty,
//       used_qty: formData.usedQty,
//       addBy: employeeName, // 👈 include addBy
//     });

//     const res = response.data;

//     if (res.success) {
//       // setMessage("✅ Stock added successfully!");
//       setFormData({
//         name: "",
//         category: "",
//         packages: "",
//         totalReel: "",
//         totalQty: "",
//         usedQty: "",
//       });
//       toast.success("Stock Added Successfully")

//       setTimeout(() => {
//         navigate("/employeestockmanagementpage");
//       }, 2000);

      
//     } else {
//       setMessage(`❌ ${res.message}`);
//     }
//   } catch (error) {
//     setMessage("❌ Server error while adding stock.");
//   } finally {
//     setLoading(false);
//   }
// };



//   // const handleCancel = () => {
//   //   setFormData({
//   //     name: "",
//   //     category: "",
//   //     packages: "",
//   //     totalReel: "",
//   //     totalQty: "",
//   //     usedQty: "",
//   //   });
//   //   setMessage("");
//   // };


//   const handleCancel = () => {
//     navigate("/employeestockmanagementpage");
//   };



//   return (
//     <div>
//       <EmployeeHeader />


//       {/* <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-cover bg-center" style={{ backgroundImage: "url('/sensors.jpg')"}}>
//         <div className=" rounded-xl shadow-lg w-full max-w-4xl p-8 bg-transparent-blur border border-white/30"> */}

      

//       <div className="min-h-screen bg-[#DDF1F8] flex items-center justify-center px-4 py-8">
//         <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl p-8">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Stock</h2>

//           {message && (
//             <div
//               className={`mb-4 px-4 py-2 rounded ${
//                 message.startsWith("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//               }`}
//             >
//               {message}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 placeholder="Enter item name"
//                 className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
//                 required
//               />
//             </div>

//             {/* Category */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Category</label>
//               <input
//                 type="text"
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 placeholder="Enter category"
//                 className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
//                 required
//               />
//             </div>

//             {/* Packages */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Packages</label>
//               <input
//                 type="text"
//                 name="packages"
//                 value={formData.packages}
//                 onChange={handleChange}
//                 placeholder="Enter number of packages"
//                 className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
//                 required
//               />
//             </div>

//             {/* Total Reel */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Total Reel</label>
//               <input
//                 type="text"
//                 name="totalReel"
//                 value={formData.totalReel}
//                 onChange={handleChange}
//                 placeholder="Enter total reels"
//                 className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
//                 required
//               />
//             </div>

//             {/* Total Qty */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Total Qty</label>
//               <input
//                 type="text"
//                 name="totalQty"
//                 value={formData.totalQty}
//                 onChange={handleChange}
//                 placeholder="Enter total quantity"
//                 className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
//                 required
//               />
//             </div>

//             {/* Used Qty */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Used Qty</label>
//               <input
//                 type="text"
//                 name="usedQty"
//                 value={formData.usedQty}
//                 onChange={handleChange}
//                 placeholder="Enter used quantity"
//                 className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
//                 required
//               />
//             </div>

//             {/* Buttons */}
//             <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
//               <button
//                 type="button"
//                 onClick={handleCancel}
//                 className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-6 py-2 rounded"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium px-6 py-2 rounded"
//               >
//                 {loading ? "Submitting..." : "Submit"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeeAddStockPage;







import React, { useState } from "react";
import axios from "axios";
import EmployeeHeader from "../components/employee_header";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmployeeAddStockPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    packages: "",
    totalReel: "",
    totalQty: "",
    usedQty: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ["packages", "totalReel", "totalQty", "usedQty"];
    if (numericFields.includes(name) && value !== "" && !/^\d+$/.test(value)) {
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const employeeName = localStorage.getItem("employeeName");

    try {
      const response = await axios.post("http://otplai.com:4006/add-employee-stock", {
        name: formData.name,
        category: formData.category,
        packages: formData.packages,
        total_reel: formData.totalReel,
        total_qty: formData.totalQty,
        used_qty: formData.usedQty,
        addBy: employeeName,
      });

      const res = response.data;

      if (res.success) {
        setFormData({
          name: "",
          category: "",
          packages: "",
          totalReel: "",
          totalQty: "",
          usedQty: "",
        });
        toast.success("Stock Added Successfully");

        setTimeout(() => {
          navigate("/employeestockmanagementpage");
        }, 2000);
      } else {
        setMessage(`❌ ${res.message}`);
      }
    } catch (error) {
      setMessage("❌ Server error while adding stock.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/employeestockmanagementpage");
  };

  return (
    <div>
      <EmployeeHeader />

      <div className="min-h-screen bg-[#DDF1F8] flex items-center justify-center px-3 sm:px-6 py-6 sm:py-10">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-lg sm:max-w-2xl md:max-w-4xl p-4 sm:p-6 md:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6 text-center sm:text-left">
            Add Stock
          </h2>

          {message && (
            <div
              className={`mb-4 px-4 py-2 rounded text-center ${
                message.startsWith("✅")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
          >
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter item name"
                className="mt-1 w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm sm:text-base"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Enter category"
                className="mt-1 w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm sm:text-base"
                required
              />
            </div>

            {/* Packages */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Packages
              </label>
              <input
                type="text"
                name="packages"
                value={formData.packages}
                onChange={handleChange}
                placeholder="Enter number of packages"
                className="mt-1 w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm sm:text-base"
                required
              />
            </div>

            {/* Total Reel */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Total Reel
              </label>
              <input
                type="text"
                name="totalReel"
                value={formData.totalReel}
                onChange={handleChange}
                placeholder="Enter total reels"
                className="mt-1 w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm sm:text-base"
                required
              />
            </div>

            {/* Total Qty */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Total Qty
              </label>
              <input
                type="text"
                name="totalQty"
                value={formData.totalQty}
                onChange={handleChange}
                placeholder="Enter total quantity"
                className="mt-1 w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm sm:text-base"
                required
              />
            </div>

            {/* Used Qty */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Used Qty
              </label>
              <input
                type="text"
                name="usedQty"
                value={formData.usedQty}
                onChange={handleChange}
                placeholder="Enter used quantity"
                className="mt-1 w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm sm:text-base"
                required
              />
            </div>

            {/* Buttons */}
            <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-5 py-2 rounded text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium px-5 py-2 rounded text-sm sm:text-base"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAddStockPage;
