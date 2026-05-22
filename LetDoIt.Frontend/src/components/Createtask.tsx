import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createTask, type CreateTaskRequest } from "../services/taskService";
import CustomCategorySelect from "./CustomCategorySelect";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRIORITY_OPTIONS = [
  { value: 1, label: "Low" },
  { value: 2, label: "Medium" },
  { value: 3, label: "High" },
  { value: 4, label: "Urgent" },
];

const CreateTaskModal = ({ isOpen, onClose }: CreateTaskModalProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    dueTime: "",
    categoryId: "",
    priority: "2",
  });

  // Fetch categories khi modal mở
  useEffect(() => {
    if (isOpen) {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Vui lòng đăng nhập để tạo task");
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
      toast.error("Please enter task name");
      return;
    }

    if (!formData.dueDate) {
      toast.error("Please enter due date");
      return;
    }

    // Kết hợp date và time thành DateTime
    const dateTimeString = formData.dueTime
      ? `${formData.dueDate}T${formData.dueTime}:00`
      : `${formData.dueDate}T23:59:59`;

    if (formData.dueDate < dateTimeString) {
      toast.error("Please choose a time in the future!");
      return;
    }

    // Parse thành Date object rồi convert sang UTC ISO string
    const dueDateTime = new Date(dateTimeString).toISOString();

    try {
      setLoading(true);
      const taskData: CreateTaskRequest = {
        title: formData.title,
        description: formData.description,
        dueDate: dueDateTime,
        categoryId: formData.categoryId ? formData.categoryId : null,
        priority: parseInt(formData.priority),
      };

      await createTask(taskData);
      toast.success("Create new task successfully!");

      // Dispatch event to notify Home component
      window.dispatchEvent(new Event("taskCreated"));

      // Reset form
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        dueTime: "",
        categoryId: "",
        priority: "2",
      });
      onClose();
    } catch (error: any) {
      console.error("Error creating task:", error);
      if (error.response?.status === 401) {
        toast.error("Login session has expired. Please login again");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Cannot create task");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="w-full max-w-lg bg-[#F28C48] rounded-[30px] p-8 shadow-2xl relative border-4 border-black">
        {/* Nút đóng nhanh */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-black hover:scale-110 transition-transform disabled:opacity-50 w-12 h-12 flex items-center justify-center cursor-pointer"
        >
          <X size={32} strokeWidth={3} />
        </button>

        {/* Header */}
        <h2 className="font-cherry text-4xl text-white text-center my-4 tracking-wider drop-shadow-md w-100 m-auto">
          Create a New Task
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-black font-bold mb-1 ml-2">
              Task Name
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

          {/* Date and Time Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-black font-bold mb-1 ml-2">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-[10px] border-2 border-black outline-none focus:ring-4 ring-yellow-300 transition-all bg-white"
              />
            </div>
            <div>
              <label className="block text-black font-bold mb-1 ml-2">
                Due Time
              </label>
              <input
                type="time"
                name="dueTime"
                value={formData.dueTime}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-[10px] border-2 border-black outline-none focus:ring-4 ring-yellow-300 transition-all bg-white"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-black font-bold mb-1 ml-2">
              Description
            </label>
            <textarea
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Task details..."
              className="w-full px-4 py-3 rounded-[10px] border-2 border-black outline-none focus:ring-4 ring-yellow-300 transition-all resize-none bg-white "
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Priority Select */}
            <div>
              <label className="block text-black font-bold mb-1 ml-2">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-[10px] border-2 border-black outline-none appearance-none bg-white"
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {/* Category Select */}
            <div>
              <label className="block text-black font-bold mb-1 ml-2">
                Category
              </label>
              <CustomCategorySelect
                value={formData.categoryId}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, categoryId: val }))
                }
              />
            </div>
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

export default CreateTaskModal;
