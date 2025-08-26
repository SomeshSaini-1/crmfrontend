

import React, { useState, useEffect } from "react";
import EmployeeHeader from "../components/employee_header";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

import { MdKeyboardArrowDown } from "react-icons/md";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// for pdf and excel
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { FaRegFilePdf } from "react-icons/fa6";
import { GrDocumentExcel } from "react-icons/gr";

const EmployeeStockManagementPage = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [selectedStockHistory, setSelectedStockHistory] = useState([]);
  const [showHistoryPopup, setShowHistoryPopup] = useState(false);

  const handleShowHistory = (history) => {
    setSelectedStockHistory(history);
    setShowHistoryPopup(true);
  };

  // Fetch data
  const fetchStockData = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3004/view-admin-stock");
      if (response.data.success) {
        setStockData(response.data.data);
      } else {
        setStockData([]);
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  const confirmDeleteStock = async () => {
    try {
      const response = await axios.post("http://localhost:3004/delete-admin-stock", { _id: deleteId });
      if (response.data && response.data.success) {
        setStockData((prev) => prev.filter((item) => item._id !== deleteId));
        toast.success("Stock deleted successfully!", { autoClose: 2000 });
      } else {
        toast.error(response.data.message || "Failed to delete stock.");
      }
    } catch (error) {
      console.error("Error deleting stock:", error);
      toast.error("Something went wrong while deleting the stock.");
    } finally {
      setShowDeleteConfirm(false);
      setDeleteId(null);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...new Set(stockData.map((item) => item.category))];

  const filteredData = stockData.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddStock = () => {
    navigate("/employeeaddstockpage");
  };

  const exportToExcel = () => {
    if (stockData.length === 0) {
      toast.error("No data available to export");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(
      stockData.map((item, index) => ({
        "S.N.": index + 1,
        Date: new Date(item.createdAt).toLocaleDateString("en-IN"),
        "Stock Added By": item.addBy,
        Name: item.name,
        Category: item.category,
        Packages: item.packages,
        "Total Reel": item.total_reel,
        "Total Qty": item.total_qty,
        "Used Qty": item.used_qty,
        "Total Balance": item.total_qty - item.used_qty,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Stock Data");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, "StockData.xlsx");
    toast.success("Excel file downloaded successfully!");
  };

  const exportToPDF = () => {
    if (stockData.length === 0) {
      toast.error("No data available to export");
      return;
    }
    const doc = new jsPDF();
    doc.text("Stock Data", 14, 10);
    const tableColumn = [
      "S.N.",
      "Date",
      "Stock Added By",
      "Name",
      "Category",
      "Packages",
      "Total Reel",
      "Total Qty",
      "Used Qty",
      "Total Balance",
    ];
    const tableRows = stockData.map((item, index) => [
      index + 1,
      new Date(item.createdAt).toLocaleDateString("en-IN"),
      item.addBy,
      item.name,
      item.category,
      item.packages,
      item.total_reel,
      item.total_qty,
      item.used_qty,
      item.total_qty - item.used_qty,
    ]);
    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20 });
    doc.save("StockData.pdf");
    toast.success("PDF file downloaded successfully!");
  };

  return (
    <div className="h-screen bg-[#CDE6EC] flex flex-col">
      <EmployeeHeader />

      {/* Top Bar */}
      <div className="bg-white sticky top-0 z-10 shadow px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-center md:text-left">Stock Management</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by Product Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full sm:w-60"
          />

          {/* <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full sm:w-48"
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat === "All" ? "All Categories" : cat}
              </option>
            ))}
          </select> */}



          <div className="relative w-full sm:w-48">
  <select
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
    className="border border-gray-300 rounded px-3 py-2 pr-8 w-full appearance-none bg-white"
  >
    {categories.map((cat, idx) => (
      <option key={idx} value={cat}>
        {cat === "All" ? "All Categories" : cat}
      </option>
    ))}
  </select>

  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl text-gray-500 pointer-events-none">
    <MdKeyboardArrowDown />
  </span>
</div>




          <div className="flex flex-wrap gap-2">
            <button
              onClick={exportToExcel}
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm w-full sm:w-auto"
            >
              <GrDocumentExcel /> Excel
            </button>

            <button
              onClick={exportToPDF}
              className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm w-full sm:w-auto"
            >
              <FaRegFilePdf /> PDF
            </button>

            <button
              onClick={handleAddStock}
              className="bg-[#04b6d6] hover:bg-[#039bb6] text-white px-3 py-2 rounded text-sm w-full sm:w-auto"
            >
              Add Stock
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1 px-2 py-2">
        <table className="min-w-full bg-white border border-gray-200 text-xs sm:text-sm text-center">
          <thead>
            <tr className="bg-[#6ee0f0] text-black">
              <th className="px-2 py-2 border">S.N.</th>
              <th className="px-2 py-2 border">Date</th>
              <th className="px-2 py-2 border">Stock Added By</th>
              <th className="px-2 py-2 border">Product Name</th>
              <th className="px-2 py-2 border">Category</th>
              <th className="px-2 py-2 border">Packages</th>
              <th className="px-2 py-2 border">Total Reel</th>
              <th className="px-2 py-2 border">Total Qty</th>
              <th className="px-2 py-2 border">Used Qty</th>
              <th className="px-2 py-2 border">Total Balance</th>
              <th className="px-2 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="12" className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-2 py-2 border">{index + 1}</td>
                  <td className="p-2 border">{new Date(item.createdAt).toLocaleDateString("en-IN")}</td>
                  <td
                    className="px-2 py-2 border text-blue-600 hover:underline cursor-pointer"
                    onClick={() => handleShowHistory(item.updateHistory || [])}
                  >
                    {item.addBy}
                  </td>
                  <td className="px-2 py-2 border">{item.name}</td>
                  <td className="px-2 py-2 border">{item.category}</td>
                  <td className="px-2 py-2 border">{item.packages}</td>
                  <td className="px-2 py-2 border">{item.total_reel}</td>
                  <td className="px-2 py-2 border">{item.total_qty}</td>
                  <td className="px-2 py-2 border">{item.used_qty}</td>
                  <td className="px-2 py-2 border">{item.total_qty - item.used_qty}</td>
                  <td className="px-2 py-2 border space-x-2">
                    <button
                      onClick={() => navigate("/employeeeditstockform", { state: { stock: item } })}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => {
                        setDeleteId(item._id);
                        setShowDeleteConfirm(true);
                      }}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="text-center p-4">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirm Popup */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-center">Confirm Deletion</h2>
            <p className="text-center text-gray-700 mb-6">
              Are you sure you want to delete this stock entry? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteStock}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Popup */}
      {showHistoryPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl shadow-2xl p-6 w-full max-w-md relative">
            <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800 flex items-center justify-center gap-2">
              Update History
            </h2>

            {selectedStockHistory.length > 0 ? (
              <ul className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {[...selectedStockHistory].reverse().map((entry, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded-lg bg-white shadow-sm border border-gray-200 hover:shadow-md transition"
                  >
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-blue-600">{entry.updatedBy}</span>
                      <span className="ml-1">updated on</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(entry.updatedAt).toLocaleString("en-IN")}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-8">No update history available.</p>
            )}

            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowHistoryPopup(false)}
                className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeStockManagementPage;
