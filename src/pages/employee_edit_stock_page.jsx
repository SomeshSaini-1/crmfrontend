



import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import EmployeeHeader from "../components/employee_header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmployeeEditStockForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { stock } = location.state || {};

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    packages: "",
    totalReel: "",
    totalQty: "",
    usedQty: "",
    addBy: "",
  });

  useEffect(() => {
    if (stock) {
      setFormData({
        name: stock.name || "",
        category: stock.category || "",
        packages: stock.packages?.toString() || "",
        totalReel: stock.total_reel?.toString() || "",
        totalQty: stock.total_qty?.toString() || "",
        usedQty: stock.used_qty?.toString() || "",
        addBy: stock.addBy || "",
      });
    }
  }, [stock]);

  const isFormChanged = () => {
    if (!stock) return false;
    return (
      formData.name !== (stock.name || "") ||
      formData.category !== (stock.category || "") ||
      formData.packages !== (stock.packages?.toString() || "") ||
      formData.totalReel !== (stock.total_reel?.toString() || "") ||
      formData.totalQty !== (stock.total_qty?.toString() || "") ||
      formData.usedQty !== (stock.used_qty?.toString() || "")
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ["packages", "totalReel", "totalQty", "usedQty"];
    if (numericFields.includes(name) && value !== "" && !/^\d*$/.test(value)) {
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormChanged()) {
      toast.warning("You're not updating any data!");
      return;
    }

    try {
      const employeeName = localStorage.getItem("employeeName");

      const payload = {
        _id: stock._id,
        addBy: formData.addBy,
        name: formData.name,
        category: formData.category,
        packages: Number(formData.packages),
        total_reel: Number(formData.totalReel),
        total_qty: Number(formData.totalQty),
        used_qty: Number(formData.usedQty),
        updatedBy: employeeName,
      };

      const res = await axios.post(
        "http://localhost:3004/edit-employee-stock",
        payload
      );

      if (res.data.success) {
        toast.success("Stock updated successfully!");
        setTimeout(() => {
          navigate("/employeestockmanagementpage");
        }, 2000);
      } else {
        toast.error("Update failed: " + res.data.message);
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Something went wrong!");
    }
  };

  const handleCancel = () => {
    navigate("/employeestockmanagementpage");
  };

  return (
    <div className="sticky top-0 z-50">
      <EmployeeHeader />

      <div className="min-h-screen bg-[#CDE6EC] flex items-center justify-center p-4">
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-xl md:max-w-3xl lg:max-w-4xl">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-center">
            Edit Stock
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {[
              { label: "Name", name: "name" },
              { label: "Category", name: "category" },
              { label: "Packages", name: "packages" },
              { label: "Total Reel", name: "totalReel" },
              { label: "Total Quantity", name: "totalQty" },
              { label: "Used Quantity", name: "usedQty" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block font-medium mb-1 text-sm sm:text-base">
                  {field.label}
                </label>
                <input
                  type="text"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  inputMode={
                    ["packages", "totalReel", "totalQty", "usedQty"].includes(
                      field.name
                    )
                      ? "numeric"
                      : "text"
                  }
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm sm:text-base"
                />
              </div>
            ))}

            {/* Buttons */}
            <div className="md:col-span-2 flex flex-col sm:flex-row justify-center gap-3 mt-6">
              <button
                type="submit"
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded"
              >
                Update Stock
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default EmployeeEditStockForm;
