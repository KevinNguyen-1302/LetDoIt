import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createProject, type CreateProjectRequest } from "../services/projectService";
interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateProjectModal = ({ isOpen, onClose }: CreateProjectModalProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
  });

  useEffect(() => {
    if (isOpen) {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Log in to create project");
        navigate("/login");
        onClose();
        return;
      }
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error("Please enter project name");
      return;
    }

    try {
      setLoading(true);
      const projectData: CreateProjectRequest = {
        title: formData.title,
      };
      await createProject(projectData);
      toast.success("Create new project successfully!");

      // Dispatch event to notify Home component
      window.dispatchEvent(new Event("projectCreated"));

      // Reset form
      setFormData({
        title: "",
      });
      onClose();
    } catch (error: any) {
      console.error("Error creating project:", error);
      if (error.response?.status === 401) {
        toast.error("Login session has expired. Please login again");
        navigate("/login");
      } else {
        // Response được wrap bởi middleware: { result, error, message, data }
        const message =  "Cannot create project";
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="w-full max-w-lg bg-[#7af471] rounded-[30px] p-8 shadow-2xl relative border-4 border-black">
        {/* Nút đóng nhanh */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-black hover:scale-110 transition-transform disabled:opacity-50 w-12 h-12 flex items-center justify-center cursor-pointer"
        >
          <X size={32} strokeWidth={3} />
        </button>

        {/* Header */}
        <h2 className="font-cherry text-4xl text-white text-center my-4 tracking-wider drop-shadow-lg w-100 m-auto">
          Create a New Project
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-black font-bold mb-1 ml-2">
              Project Name
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              className="w-full px-4 py-3 rounded-[10px] border-2 border-black outline-none focus:ring-4 ring-yellow-300 transition-all text-lg bg-white"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-center gap-8 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="bg-[#ff5f46] text-black px-10 py-3 rounded-full font-cherry text-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#E8FF46] text-black px-10 py-3 rounded-full font-cherry text-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Confirm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CreateProjectModal;
