
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../components/admin_header";

import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


export default function AdminAddStockPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    packages: "",
    totalReel: "",
    totalQty: "",
    usedQty: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const currentAdminName = localStorage.getItem("adminName");
   
 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const response = await fetch("http://otplai.com:4006/add-admin-stock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        addBy: currentAdminName || "Admin",
        name: formData.name,
        category: formData.category,
        packages: Number(formData.packages),
        total_reel: Number(formData.totalReel),
        total_qty: Number(formData.totalQty),
        used_qty: Number(formData.usedQty),
        status: true,
        time: new Date().toISOString(),
      }),
    });

    const data = await response.json();

    // ✅ Backend response handle karo
    if (data.success) {
      toast.success("Stock Added Successfully!");
      setTimeout(() => {
        navigate("/adminstockmanagementpage");
      }, 2000);
    } else {
      // ❌ Error message from backend (like "Stock name already exists")
      setError(data.message || "Something went wrong");
    }
  } catch (err) {
    console.error(err);
    setError("❌ Server error while adding stock.");
  } finally {
    setLoading(false);
  }
};


  const handleCancel = () => {
    navigate("/adminstockmanagementpage");
  };

  const preventScroll = (e) => {
    e.target.blur();
  };

  return (
    <div className="min-h-screen bg-[#CDE6EC]">
      <div className="sticky top-0 z-50">
        <AdminHeader />
      </div>

      

      <div className="max-w-3xl mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add Stock</h2>

        {/* {error && <p className="text-red-500 mb-4">{error}</p>} */}

        {error && (
  <div
    className={`mb-4 px-4 py-2 rounded ${
      error.startsWith("✅")
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800"
    }`}
  >
    {error}
  </div>
)}



        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Row 1: Name + Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#32A9C7]"
                placeholder="Enter item name"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#32A9C7]"
                placeholder="Enter category"
                required
              />
            </div>
          </div>

          {/* Row 2: Packages + Total Reel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Packages</label>
              <input
                type="number"
                name="packages"
                value={formData.packages}
                onChange={handleChange}
                onWheel={preventScroll}
                className="w-full border border-gray-300 rounded px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-[#32A9C7]"
                placeholder="Enter number of packages"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Total Reel</label>
              <input
                type="number"
                name="totalReel"
                value={formData.totalReel}
                onChange={handleChange}
                onWheel={preventScroll}
                className="w-full border border-gray-300 rounded px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-[#32A9C7]"
                placeholder="Enter total reels"
                required
              />
            </div>
          </div>

          {/* Row 3: Total Qty + Used Qty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Total Qty</label>
              <input
                type="number"
                name="totalQty"
                value={formData.totalQty}
                onChange={handleChange}
                onWheel={preventScroll}
                className="w-full border border-gray-300 rounded px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-[#32A9C7]"
                placeholder="Enter total quantity"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Used Qty</label>
              <input
                type="number"
                name="usedQty"
                value={formData.usedQty}
                onChange={handleChange}
                onWheel={preventScroll}
                className="w-full border border-gray-300 rounded px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-[#32A9C7]"
                placeholder="Enter used quantity"
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#32A9C7] text-white px-6 py-2 rounded hover:bg-[#2a90a8] transition"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
