

import { useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from "../components/admin_header";

export default function AdminDetails() {
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const email = localStorage.getItem("adminEmail"); // Or use auth context if you have
        if (!email) return;

        const response = await axios.post("http://localhost:3004/admin-profile", { email });
        if (response.data.success) {
          setAdminData(response.data.data);
        } else {
          console.error("Failed to fetch admin profile");
        }
      } catch (error) {
        console.error("API error:", error);
      }
    };

    fetchAdminProfile();
  }, []);

  const Field = ({ label, value }) => (
    <div>
      <label className="block text-sm font-medium text-gray-600">{label}</label>
      <p className="mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-700">
        {value || "N/A"}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <AdminHeader />
      <div className="min-h-screen bg-[#CDE6EC] p-6">
        <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl p-8 border-l-4 border-[#32A9C7]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#32A9C7]">Admin Profile</h2>
            {/* <img src="/oxymoralogo.png" alt="Admin Profile" className="h-11" /> */}

             <div className="flex items-center">
          <img src="/oxymoranewlogo.png" alt="OXYMORA Logo" className="h-11" />
        </div>

          </div>

          {adminData ? (
            <div className="grid grid-cols-1 gap-6">
              <Field label="Full Name" value={adminData.name} />
              <Field label="Email" value={adminData.email} />
              <Field label="Password" value={adminData.password ? "********" : "N/A"} />
              <Field label="Role" value={adminData.role} />

              <div className="flex justify-end mt-6">
                <a
                  href="/admintimesheetspage"
                  className="inline-block bg-[#32A9C7] hover:bg-[#2795B0] text-white text-sm font-semibold py-2 px-6 rounded-md transition"
                >
                  Back
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
