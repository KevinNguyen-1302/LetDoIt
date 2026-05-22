import { useState, useEffect, useRef } from "react";
import { ChevronDown, Plus } from "lucide-react";
import {
  getMyCategories,
  type CategoryResponse,
} from "../services/taskService";
import { toast } from "react-toastify";
import CreateCategoryModal from "./CreateCategoryForm";
import clsx from "clsx";

interface CustomCategorySelectProps {
  value: string;
  onChange: (value: string) => void;
}

const CustomCategorySelect = ({
  value,
  onChange,
}: CustomCategorySelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Modal state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const closeCategoryModal = () => {
    setIsCategoryModalOpen(false);
    fetchCategories(); // Fetch lại danh sách sau khi tạo mới thành công
  };
  const openCategoryModal = () => setIsCategoryModalOpen(true);

  // Fetch categories lần đầu khi component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await getMyCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Không thể tải danh mục");
    } finally {
      setLoadingCategories(false);
    }
  };

  // Đóng dropdown khi click ra ngoài màn hình
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Tìm tên Category hiện tại để hiển thị lên nút
  const selectedCategory = categories.find((cat) => cat.categoryId === value);

  const handleSelect = (val: string) => {
    if (val === "new") {
      openCategoryModal();
    } else {
      // Cập nhật giá trị ra component cha
      onChange(val);
    }
    setIsOpen(false); // Chọn xong thì đóng menu
  };

  return (
    <div className="relative w-full font-bold" ref={dropdownRef}>
      {/* NÚT BẤM CHÍNH */}
      <button
        type="button"
        disabled={loadingCategories}
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "w-full px-4 py-3 rounded-[10px] border-2 border-black bg-white text-left text-black flex justify-between items-center transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
          "shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]",
          loadingCategories && "opacity-50",
        )}
      >
        <span className="truncate">
          {loadingCategories
            ? "Loading..."
            : selectedCategory
              ? selectedCategory.name
              : "Select Category"}
        </span>
        <ChevronDown
          size={20}
          className={clsx(
            "transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {/* DROPDOWN MENU XỔ XUỐNG */}
      {isOpen && (
        <ul className="absolute z-50 w-full mt-2 bg-white border-2 border-black rounded-[10px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-h-40 overflow-y-auto overflow-x-hidden p-1 space-y-1">
          {/* Option mặc định */}
          <li
            onClick={() => handleSelect("")}
            className="px-4 py-2 rounded-md text-gray-400 hover:bg-[#f0f0f0] hover:text-black cursor-pointer transition-colors duration-150 font-medium"
          >
            Select Category
          </li>

          {/* Render danh sách Categories */}
          {categories.map((cat) => (
            <li
              key={cat.categoryId}
              onClick={() => handleSelect(cat.categoryId)}
              className={clsx(
                "px-4 py-2 rounded-md cursor-pointer transition-colors duration-150 text-black",
                value === cat.categoryId
                  ? "bg-[#a1dafd] border border-black"
                  : "hover:bg-[#E8FF46]/50",
              )}
            >
              {cat.name}
            </li>
          ))}

          {/* Đường gạch ngang phân cách mục Tạo mới */}
          <hr className="border-black/10 my-1" />

          {/* Option tạo mới */}
          <li
            onClick={() => handleSelect("new")}
            className="px-2 py-2 flex justify-center items-center gap-2 rounded-md bg-[#E8FF46]/30 text-emerald-700 hover:bg-[#E8FF46] border border-dashed border-emerald-500 cursor-pointer font-bold transition-all duration-150"
          >
            <Plus size={18} /> Create new category
          </li>
        </ul>
      )}

      <CreateCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={closeCategoryModal}
      />
    </div>
  );
};

export default CustomCategorySelect;
