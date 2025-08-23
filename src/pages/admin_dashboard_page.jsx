
import React from 'react';
import {
  FaClock,
  FaProjectDiagram,
  FaSignOutAlt,
  FaTasks,
  FaBoxes,
  FaInfoCircle,
} from 'react-icons/fa';
import AdminHeader from '../components/admin_header';

const AdminDashboardPage = () => {
  const timesheetData = [
    {
      employee: 'John Doe',
      date: '03/08/2025',
      login: '10:35',
      logout: '09:40',
      hours: '11:05',
      project: 'IOT Lorem',
      task: 'Working on backend API integration.',
      attachment: '-',
      suggestions: '-',
      nextDayTask: 'Refactor code and test modules.',
    },
    {
      employee: 'Jane Smith',
      date: '03/08/2025',
      login: '09:35',
      logout: '06:20',
      hours: '08:45',
      project: 'CRM',
      task: 'Fixed validation bugs.',
      attachment: <FaInfoCircle className="text-blue-500 cursor-pointer" />,
      suggestions: '-',
      nextDayTask: 'Test entire login flow.',
    },
  ];

  const cards = [
    { title: 'Timesheets', icon: <FaClock />, color: 'from-cyan-400 to-blue-500' },
    { title: 'Manage Project', icon: <FaProjectDiagram />, color: 'from-pink-400 to-red-500' },
    { title: 'Leave Request', icon: <FaSignOutAlt />, color: 'from-yellow-400 to-orange-500' },
    { title: 'Assign Task', icon: <FaTasks />, color: 'from-green-400 to-emerald-500' },
    { title: 'Inventory', icon: <FaBoxes />, color: 'from-purple-400 to-indigo-500', isInventory: true },
  ];

  return (
    <div>
      <AdminHeader />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#32A9C7] to-[#12687E] text-white px-8 py-10 shadow-lg flex flex-col lg:flex-row items-center lg:items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold">Welcome Back, Admin 👋</h1>
          <p className="mt-3 text-lg opacity-90 max-w-lg">
            Here’s a quick overview of today’s activities, reports, and performance.
          </p>
        </div>
        {/* <img
          src="/oxymoranewlogo.png"
          alt="Dashboard Illustration"
          className="w-40 mt-6 lg:mt-0 drop-shadow-lg"
        /> */}
      </div>

      <div className="p-6 bg-[#F3FAFB] min-h-screen">
        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {cards.map((card, i) => (
            <div
              key={i}
              className={`bg-gradient-to-br ${card.color} text-white rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center backdrop-blur-md bg-opacity-70 border border-white/30 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
              style={{ animation: `floatCard ${2 + i * 0.2}s ease-in-out infinite alternate` }}
            >
              <div className="text-5xl mb-3 drop-shadow-md">{card.icon}</div>
              <h2 className="text-lg font-semibold">{card.title}</h2>

              {card.isInventory && (
                <div className="mt-4 w-full flex flex-col gap-2">
                  <div className="bg-white/30 rounded-lg p-2 text-sm text-center shadow-sm">
                    Stock
                  </div>
                  <div className="bg-white/30 rounded-lg p-2 text-sm text-center shadow-sm">
                    Requirements
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Timesheet Table */}
        <div className="bg-white rounded-xl shadow-2xl p-6 overflow-x-auto">
          <h2 className="text-2xl font-bold mb-4 text-[#0E4C5F]">Recent Timesheets</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center border-collapse">
              <thead className="bg-[#8ad5ea] text-[#003640] sticky top-0 shadow-sm">
                <tr>
                  <th className="p-3">Employee Name</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Login</th>
                  <th className="p-3">Logout</th>
                  <th className="p-3">Hours</th>
                  <th className="p-3">Project</th>
                  <th className="p-3">Task</th>
                  <th className="p-3">Attachment</th>
                  <th className="p-3">Suggestions</th>
                  <th className="p-3">Next Day Task</th>
                </tr>
              </thead>
              <tbody>
                {timesheetData.map((entry, index) => (
                  <tr
                    key={index}
                    className={`hover:bg-[#f0fafd] transition-all ${
                      index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    }`}
                  >
                    <td className="p-3 border">{entry.employee}</td>
                    <td className="p-3 border">{entry.date}</td>
                    <td className="p-3 border">{entry.login}</td>
                    <td className="p-3 border">{entry.logout}</td>
                    <td className="p-3 border">{entry.hours}</td>
                    <td className="p-3 border">{entry.project}</td>
                    <td className="p-3 border">{entry.task}</td>
                    <td className="p-3 border">{entry.attachment}</td>
                    <td className="p-3 border">{entry.suggestions}</td>
                    <td className="p-3 border">{entry.nextDayTask}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Floating Card Animation */}
      <style>
        {`
          @keyframes floatCard {
            0% { transform: translateY(0); }
            100% { transform: translateY(-6px); }
          }
        `}
      </style>
    </div>
  );
};

export default AdminDashboardPage;
