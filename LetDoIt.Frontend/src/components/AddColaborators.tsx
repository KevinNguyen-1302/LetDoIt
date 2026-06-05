import { useState, useRef, useEffect } from "react";
import { UserPlus, CircleUser, Plus } from "lucide-react";
import { getUserByUsername } from "../services/authService";
import { addMemberToProject } from "../services/projectService";
import { toast } from "react-toastify";

interface UserDto {
  userId: string;
  username: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
}

interface AddColaboratorsProps {
  projectId: string;
}

const AddColaborators = ({ projectId }: AddColaboratorsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState<UserDto[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search value
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchValue.trim()) {
        fetchUsers(searchValue);
      } else {
        setUsers([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchValue]);

  const fetchUsers = async (username: string) => {
    try {
      setIsSearching(true);
      const data = await getUserByUsername(username);
      // Handle different possible response structures safely
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (data && Array.isArray(data.data)) {
        setUsers(data.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Lỗi dòng đời xô đẩy khi tìm user:", error);
      setUsers([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    } else {
      setSearchValue("");
      setUsers([]);
    }
  };

  const handleAddMember = async (userId: string) => {
    try {
      await addMemberToProject(projectId, userId);
      toast.success("User added to project successfully!");
      setIsOpen(false);
      setSearchValue("");
      setUsers([]);
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to add user to project.",
      );
    }
  };

  return (
    <div className="relative">
      <form
        action=""
        onSubmit={(e) => e.preventDefault()}
        // 1. CHỈNH Ở ĐÂY: Đổi bg-white thành động. Khi đóng (isOpen = false) thì cho nó bg-black luôn để nuốt trọn phần viền bị lệch.
        className={`relative h-11 rounded-full transition-all duration-300 ease-in-out flex items-center shadow-lg border-black ${
          isOpen ? "w-72 px-4 bg-white" : "w-11 bg-black cursor-pointer"
        }`}
        onClick={() => !isOpen && handleToggle()}
      >
        {/* Ô Input gõ nội dung tìm kiếm */}
        <input
          ref={inputRef}
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          // Thêm flex-1 khi mở để ô input chiếm trọn không gian trống một cách tự động
          className={`bg-transparent border-none outline-none h-full text-black text-base transition-all duration-300 ${
            isOpen
              ? "flex-1 opacity-100 pr-10"
              : "w-0 opacity-0 pointer-events-none"
          }`}
          placeholder="Search Collaborators Here..."
        />

        {/* Nút tròn chứa Icon */}
        <button
          type="button"
          onClick={(e) => {
            if (isOpen) {
              e.stopPropagation();
              handleToggle();
            }
          }}
          // 2. CHỈNH Ở ĐÂY: Thêm `top-1/2 -translate-y-1/2` cố định để nút luôn nằm chính giữa tâm dọc của form, bất kể độ phân giải màn hình.
          className="absolute w-10 h-10 rounded-full bg-black flex items-center justify-center text-white transition-all duration-300 active:scale-120 cursor-pointer right-0 top-1/2 -translate-y-1/2  wobble-button"
        >
          <UserPlus size={20} />
        </button>
      </form>

      {/* Render dropdown users */}
      {isOpen && (searchValue.trim() !== "" || users.length > 0) && (
        <div className="absolute top-14 left-0 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-80 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-gray-500 font-medium">
              Searching...
            </div>
          ) : users.length > 0 ? (
            <div className="flex flex-col py-2">
              {users.map((user) => (
                <div
                  key={user.userId}
                  className="flex items-center justify-between p-3 mx-2 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.username}
                        className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-200"
                      />
                    ) : (
                      <CircleUser
                        strokeWidth={1.5}
                        className="w-10 h-10 text-gray-400 shrink-0"
                      />
                    )}
                    <div className="flex flex-col overflow-hidden">
                      <span
                        className="font-semibold text-sm text-gray-800 truncate"
                        title={user.username}
                      >
                        {user.username}
                      </span>
                      <span
                        className="text-xs text-gray-500 truncate"
                        title={user.email}
                      >
                        {user.email}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddMember(user.userId)}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white hover:bg-green-600 transition-all shrink-0 shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100 scale-90 group-hover:scale-100"
                    title="Add Member"
                  >
                    <Plus size={18} strokeWidth={2.5} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            searchValue.trim() !== "" && (
              <div className="p-4 text-center text-gray-500 font-medium">
                No users found.
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default AddColaborators;
