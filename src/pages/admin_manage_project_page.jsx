

import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminHeader from "../components/admin_header";
import { MdOutlineDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { FcInfo } from "react-icons/fc";

import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


export default function AdminManageProjectPage() {
  //  State for project list
  const [projects, setProjects] = useState([]);

  //  State for search input
  const [search, setSearch] = useState("");

  //  State for Add Project
  const [showAddProjectForm, setShowAddProjectForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(false);

  //  State for Edit Project
  const [editProject, setEditProject] = useState(null);
  const [editProjectName, setEditProjectName] = useState("");
  const [editProjectDescription, setEditProjectDescription] = useState("");
  const [editAttachment, setEditAttachment] = useState(null);

  // state for info icon 
  const [showModal, setShowModal] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");


  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [projectIdToDelete, setProjectIdToDelete] = useState(null);


  //  Fetch projects from backend
  const fetchProjects = async () => {
    try {
      const res = await axios.post("http://localhost:3004/view-project");
      if (res.data.success) {
        setProjects(res.data.data);
      } else {
        setProjects([]);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };


  useEffect(() => {
    fetchProjects();
  }, []);
  

  //  Add Project Handler
  const handleAddProject = async () => {
    if (!newProject.name.trim()) {
      toast.error("Project name is required", {position: "top-center", autoClose: 2000});
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("project_name", newProject.name);
      formData.append("description", newProject.description);
      if (attachment) {
        formData.append("attachment", attachment);
      }

      const response = await axios.post(
        "http://localhost:3004/add-project",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        toast.success("Project added successfully!", {autoClose: 2000});
        setNewProject({ name: "", description: "" });
        setAttachment(null);
        setShowAddProjectForm(false);
        fetchProjects();
      } else {
        toast.error(response.data.message || "Failed to add project.");
      }
    } catch (error) {
      console.error("Add Project Error:", error);
      toast.error("Something went wrong while adding project.");
    } finally {
      setLoading(false);
    }
  };





 // Step 1: Trigger this to show the modal
const handleDeleteClick = (id) => {
  setProjectIdToDelete(id);
  setShowDeleteConfirm(true);
};

// Step 2: Called when "Delete" is confirmed in the modal
const confirmDeleteProject = async () => {
  try {
    const res = await axios.post("http://localhost:3004/delete-project", {
      _id: projectIdToDelete,
    });

    if (res.data.success) {
      toast.success("Project deleted successfully!", { autoClose: 2000 });
      fetchProjects();
    } else {
      toast.error("Failed to delete project.");
    }
  } catch (error) {
    console.error("Delete Project Error:", error);
    toast.error("Something went wrong while deleting the project.");
  } finally {
    setShowDeleteConfirm(false);
    setProjectIdToDelete(null);
  }
};



  

  //  Edit Project Save Handler
  const handleEditProject = async () => {
    try {
      const formData = new FormData();
      formData.append("_id", editProject._id);
      formData.append("project_name", editProjectName);
      formData.append("description", editProjectDescription);
      if (editAttachment) {
        formData.append("attachment", editAttachment);
      }

      const res = await axios.post("http://localhost:3004/edit-project", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Project updated successfully!", { autoClose:2000});
        setEditProject(null);
        fetchProjects();
      } else {
        toast.error(res.data.message || "Update failed", {position:"top-center", autoClose:2000});
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Something went wrong");
    }
  };

  //  Filter search results
  const filteredProjects = projects.filter((proj) =>
    proj.project_name?.toLowerCase().includes(search.toLowerCase())
  );


  // for info icon 
   const openModal = (description) => {
    setSelectedDescription(description);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDescription("");
  };


  return (
    <div className="h-screen bg-[#CDE6EC] flex flex-col">
      <AdminHeader/>

          
      

      {/* Header and Search */}
      <div className="bg-white sticky top-0 z-10 shadow px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Manage Project</h1>
        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by Project Name..."
            className="px-4 py-2 border rounded-md w-full md:w-80"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={() => setShowAddProjectForm(true)}
            className="bg-[#32A9C7] hover:bg-[#2b97b1] text-white px-4 py-2 rounded">
            Add Project
          </button>

        </div>
      </div>

      {/* Project Table */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg border border-gray-300">

            <thead className="bg-[#5ed9de] text-gray-700">
              <tr>
                <th className="px-4 py-2 text-left border-r">S.N.</th>
                <th className="px-4 py-2 text-left border-r">Project Name</th>
                <th className="px-4 py-2 text-left border-r">Description</th>
                <th className="px-4 py-2 text-left border-r">Attachment</th>
                <th className="px-4 py-2 text-left border-r">Date</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredProjects.map((proj, index) => (

                <tr key={proj._id || index} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 border-r">{index + 1}</td>
                  <td className="px-4 py-2 border-r">{proj.project_name}</td>
      
                  {/*  Description */}
                  <td className="p-3 border text-left">

                    {!proj.description || proj.description.trim() === "" ? (
                      <span className="text-2xl flex justify-center">-</span> // empty ho to dash dikhao
                  ) : proj.description.split(" ").length > 10 ? ( //  condition for >10 words
                    <div className="flex items-center space-x-2">

                    <span>{proj.description.split(" ").slice(0, 10).join(" ")}...</span> {/*  show first 10 words */}
                   <button
                      onClick={() => openModal(proj.description)}     //  open popup with full reason
                      className="text-blue-600 hover:text-blue-800">
                      <FcInfo size={18} />
                   </button>
                   </div>
               ) : (
                   <span>{proj.description}</span>
                      )}
                  </td>

                  {/*  Attachment - show download/view link */}
                  <td className="px-4 py-2 border-r">
                       {proj.attachment ? (
                        <a
                           href={`http://localhost:3004/uploads/${proj.attachment}`}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="text-blue-600 flex justify-center">View
                        </a>
                    ) : (
                        <div className="flex justify-center items-center h-full">
                        <span className="text-2xl">-</span>
                        </div>
                         )}
                  </td>

                  <td className="px-4 py-2 border-r">
                     {new Date(proj.createdAt).toLocaleDateString("en-IN")}
                  </td>

                  <td className="px-8 py-3 flex gap-3">
                    <button
                       onClick={() => {
                       setEditProject(proj);
                       setEditProjectName(proj.project_name);
                       setEditProjectDescription(proj.description || "");
                       }}
                       className="text-green-600 hover:text-green-800 text-[22px]"
                       title="Edit" 
                    >
                      <FaRegEdit />
                    </button>

                    <button
                       onClick={() => handleDeleteClick(proj._id)}
                       className="text-red-600 hover:text-red-800 text-[25px]"
                       title="Delete">
                    <MdOutlineDelete />
                    </button>

                  </td>
                </tr>
               ))}


              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center px-4 py-4 text-gray-500">
                    No projects found.
                  </td>
                </tr>
               )}
            </tbody>

          </table>

        </div>
      </div>
      

      {/* Add Project Popup */}
      {showAddProjectForm && (

        // <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        //   <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
        //     <h2 className="text-xl font-bold mb-4 flex justify-center">Add New Project</h2>

        //     <input
        //       type="text"
        //       placeholder="Project Name"
        //       className="w-full border p-2 mb-4 rounded"
        //       value={newProject.name}
        //       onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
        //     />

        //     <textarea
        //       placeholder="Description"
        //       className="w-full border p-2 mb-4 rounded"
        //       value={newProject.description}
        //       onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
        //     ></textarea>


        //     <label className="font-semibold">Attachment</label>
        //     <input
        //       type="file"
        //       accept="image/*,.pdf,.xls,.xlsx,.mp4,.mov,.avi"
        //       className="w-full border p-2 mb-4 rounded"
        //       onChange={(e) => setAttachment(e.target.files[0])}
        //     />

        //     <div className="flex justify-between">
        //       <button
        //         onClick={handleAddProject}
        //         disabled={loading}
        //         className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        //       >
        //         {loading ? "Saving..." : "Save"}
        //       </button>
        //       <button
        //         onClick={() => setShowAddProjectForm(false)}
        //         className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        //       >
        //         Cancel
        //       </button>
        //     </div>
        //   </div>
        // </div>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
       <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Add New Project</h2>

    {/* Project Name */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
      <input
        type="text"
        placeholder="Enter project name"
        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={newProject.name}
        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
      />
    </div>

    {/* Description */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
      <textarea
        placeholder="Brief description of the project"
        className="w-full border border-gray-300 rounded-lg p-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={newProject.description}
        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
      ></textarea>
    </div>

    {/* Attachment */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">Attachment</label>
      <div className="w-full border border-gray-300 rounded-lg p-1 h-25">
        <input
          type="file"
          accept="image/*,.pdf,.xls,.xlsx,.mp4,.mov,.avi"
          className="w-full text-sm  text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 "
          onChange={(e) => setAttachment(e.target.files[0])}
        />
      </div>
    </div>

    {/* Buttons */}
    <div className="flex justify-end gap-3 mt-6">
      <button
        onClick={() => setShowAddProjectForm(false)}
        className="px-7 py-2 rounded-lg text-sm bg-gray-200 hover:bg-gray-300 text-gray-800"
      >
        Cancel
      </button>
      <button
        onClick={handleAddProject}
        disabled={loading}
        className="px-7 py-2 rounded-lg text-sm bg-[#32A9C7] hover:bg-[#2b97b1] text-white disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  </div>
      </div>
  
      )}



      {/* Edit Project Popup */}
      {editProject && (
        // <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        //   <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
        //     <h2 className="text-xl font-bold mb-4">Edit Project</h2>

        //     <input
        //       type="text"
        //       className="w-full border p-2 mb-4 rounded"
        //       value={editProjectName}
        //       onChange={(e) => setEditProjectName(e.target.value)}
        //     />

        //     <textarea
        //       placeholder="Description"
        //       className="w-full border p-2 mb-4 rounded"
        //       value={editProjectDescription}
        //       onChange={(e) => setEditProjectDescription(e.target.value)}
        //     ></textarea>

        //     <input
        //       type="file"
        //       accept="image/*,.pdf,.xls,.xlsx,.mp4,.mov,.avi"
        //       className="w-full border p-2 mb-4 rounded"
        //       onChange={(e) => setEditAttachment(e.target.files[0])}
        //     />

        //     <div className="flex justify-between">
        //       <button
        //         onClick={handleEditProject}
        //         className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        //       >
        //         Save
        //       </button>
        //       <button
        //         onClick={() => setEditProject(null)}
        //         className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        //       >
        //         Cancel
        //       </button>
        //     </div>
        //   </div>
        // </div>

        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
  <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in">
    <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Edit Project</h2>

    {/* Project Name */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
      <input
        type="text"
        placeholder="Enter project name"
        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={editProjectName}
        onChange={(e) => setEditProjectName(e.target.value)}
      />
    </div>

    {/* Description */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
      <textarea
        placeholder="Brief description of the project"
        className="w-full border border-gray-300 rounded-lg p-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={editProjectDescription}
        onChange={(e) => setEditProjectDescription(e.target.value)}
      ></textarea>
    </div>

    {/* Attachment */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">Attachment</label>
      <div className="w-full border border-gray-300 rounded-lg p-1 h-25">
        <input
          type="file"
          accept="image/*,.pdf,.xls,.xlsx,.mp4,.mov,.avi"
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          onChange={(e) => setEditAttachment(e.target.files[0])}
        />
      </div>
    </div>

    {/* Buttons */}
    <div className="flex justify-end gap-3 mt-6">
      <button
        onClick={() => setEditProject(null)}
        className="px-7 py-2 rounded-lg text-sm bg-gray-200 hover:bg-gray-300 text-gray-800"
      >
        Cancel
      </button>
      <button
        onClick={handleEditProject}
        className="px-7 py-2 rounded-lg text-sm bg-green-600 hover:bg-green-700 text-white"
      >
        Save
      </button>
    </div>
  </div>
</div>


      )}




      {/* All info Icon popup  */}
      {showModal && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
             <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-xl w-full transition-all duration-300 scale-100">
        {/* Close Button */}
             <button
                 onClick={closeModal}
                 className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl"
                 aria-label="Close"
              >
                  &times;
              </button>

        {/* Header */}
    <div className="flex items-center space-x-2 mb-4">
      <div className="w-2 h-6 bg-blue-500 rounded-sm"></div>
      <h2 className="text-xl font-semibold text-gray-800 tracking-wide">
        Task Description
      </h2>
    </div>

    {/* Task Content */}
    <div className="max-h-72 overflow-y-auto pr-1">
      <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
        {selectedDescription}
      </p>
    </div>
   </div>
         </div>
      )}


    {/* delete confirmatio  */}
      {showDeleteConfirm && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg animate-fade-in">
      <h2 className="text-lg font-bold mb-4 text-center">Confirm Deletion</h2>
      <p className="text-center text-gray-700 mb-6">
        Are you sure you want to delete this project? This action cannot be undone.
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setShowDeleteConfirm(false)}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
        >
          Cancel
        </button>
        <button
          onClick={confirmDeleteProject}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}


    </div> 
  );
}