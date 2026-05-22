import { useState } from "react";
import { createCategory, type CategoryResponse } from "../services/taskService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateCategoryModal = ({ isOpen, onClose }: CreateCategoryModalProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    color: "#000000",
    icon: "",
  });

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
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }
    try {
      setLoading(true);
      const categoryData: CategoryResponse = {
        categoryId: "",
        name: formData.name,
        colorCode: formData.color,
        iconName: formData.icon,
      };
      await createCategory(categoryData);
      toast.success("Create new category successfully!");
      onClose();
    } catch (error: any) {
      console.error("Error creating category:", error);
      if (error.response?.status === 401) {
        toast.error("Login session has expired. Please login again");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Cannot create category");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white p-6 rounded-xl">
        <div>Create Category</div>
        {/* Implement category form here */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-800"
        >
          <X size={20} />
        </button>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Create Category</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label className="text-gray-700 font-medium">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Personal"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]"
              required
            />
          </div>

          {/* Color */}
          <div className="space-y-2">
            <label className="text-gray-700 font-medium">Color</label>
            <input
              type="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Icon */}
          <div className="space-y-2">
            <label className="text-gray-700 font-medium">Icon</label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              placeholder="e.g. star"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className="px-6 py-2 bg-[#FF6B4A] text-white rounded-lg hover:bg-[#d95a3f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCategoryModal;
