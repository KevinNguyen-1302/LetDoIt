import { useState, useEffect, useRef } from "react";
import { Crown, Shield, Users, DoorOpen } from "lucide-react";
import {
  getProjectMembers,
  removeMemberFromProject,
} from "../services/projectService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface MemberDto {
  userId: string;
  username: string;
  role: string;
  avatarUrl?: string;
}

interface UserMiniCardProps {
  projectId: string;
}

const roleBadge: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  Manager: {
    label: "Manager",
    color: "bg-amber-100 text-amber-800 border-amber-300",
    icon: <Crown size={12} />,
  },
  Member: {
    label: "Member",
    color: "bg-sky-100 text-sky-800 border-sky-300",
    icon: <Shield size={12} />,
  },
};

const UserMiniCard = ({ projectId }: UserMiniCardProps) => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<MemberDto[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    member: MemberDto | null;
  }>({ isOpen: false, member: null });

  // Fetch members on mount
  useEffect(() => {
    if (!projectId) return;
    const fetchMembers = async () => {
      try {
        setIsLoading(true);
        const data = await getProjectMembers(projectId);
        if (Array.isArray(data)) {
          setMembers(data);
        } else if (data && Array.isArray(data.data)) {
          setMembers(data.data);
        } else {
          setMembers([]);
        }
      } catch (error) {
        console.error("Failed to fetch project members:", error);
        setMembers([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMembers();

    // Listen for member changes (e.g. after adding a collaborator)
    const handleRefresh = () => fetchMembers();
    window.addEventListener("memberUpdate", handleRefresh);
    return () => window.removeEventListener("memberUpdate", handleRefresh);
  }, [projectId]);

  // Close expanded card when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setExpandedId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleExpand = (userId: string) => {
    setExpandedId((prev) => (prev === userId ? null : userId));
  };

  const confirmRemove = async () => {
    if (!confirmModal.member) return;
    const member = confirmModal.member;
    const isSelf = member.userId === localStorage.getItem("userId");

    try {
      await removeMemberFromProject(projectId, member.userId);
      toast.success(
        isSelf
          ? "Rời khỏi dự án thành công!"
          : `Đã xóa thành viên ${member.username} khỏi dự án!`,
      );

      setConfirmModal({ isOpen: false, member: null });

      if (isSelf) {
        // Quay lại Home và cập nhật lại trạng thái trang Home
        window.dispatchEvent(new Event("projectCreated"));
        navigate("/");
      } else {
        // Tải lại danh sách thành viên và các task (đã bị xóa/hủy gán)
        window.dispatchEvent(new Event("memberUpdate"));
        window.dispatchEvent(new Event("taskUpdate"));
      }
    } catch (error: any) {
      console.error("Failed to remove member:", error);
      toast.error(
        error.response?.data?.message || "Không thể thực hiện hành động này.",
      );
      setConfirmModal({ isOpen: false, member: null });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-400 text-sm font-medium animate-pulse">
        <Users size={18} />
        Loading members...
      </div>
    );
  }

  if (members.length === 0) return null;

  return (
    <div ref={containerRef} className="flex items-center gap-1">
      {/* Stacked avatars with expand-on-click */}
      {members.map((member, index) => {
        const isExpanded = expandedId === member.userId;
        const badge = roleBadge[member.role] || roleBadge.Member;

        const loggedInUserId = localStorage.getItem("userId");
        const loggedInUserMember = members.find(
          (m) => m.userId === loggedInUserId,
        );
        const isSelf = loggedInUserId === member.userId;
        const canRemove =
          member.role !== "Manager" &&
          (isSelf || loggedInUserMember?.role === "Manager");

        return (
          <div
            key={member.userId}
            onClick={() => toggleExpand(member.userId)}
            className={`
              relative flex items-center cursor-pointer
              transition-all duration-300 ease-in-out
              rounded-full border-2 border-black
              shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
              hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none
              ${isExpanded ? (canRemove ? "bg-white pr-0 gap-2.5 z-20 pl-1 overflow-hidden" : "bg-white pr-4 gap-2.5 z-20 pl-1") : "bg-white z-10"}
            `}
            style={{
              marginLeft: index > 0 && !expandedId ? "-8px" : "0px",
              zIndex: isExpanded ? 30 : members.length - index,
            }}
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full shrink-0 overflow-hidden flex items-center justify-center">
              {member.avatarUrl ? (
                <img
                  src={member.avatarUrl}
                  alt={member.username}
                  className="w-full h-full object-cover rounded-full "
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center font-black text-sm uppercase "
                  style={{
                    backgroundColor: stringToColor(member.username),
                    color: "#000",
                  }}
                >
                  {member.username?.charAt(0) || "?"}
                </div>
              )}
            </div>

            {/* Expanded Info */}
            <div
              className={`
                overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap bg-white
                ${isExpanded ? "max-w-48 opacity-100 my-1" : "max-w-0 opacity-0"}
              `}
            >
              <div className="flex flex-col leading-tight">
                <span className="text-sm text-gray-900 truncate max-w-36">
                  {member.username}
                </span>
                <span
                  className={`
                    inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 
                    rounded-full border w-fit mt-0.5
                    ${badge.color}
                  `}
                >
                  {badge.icon}
                  {badge.label}
                </span>
              </div>
            </div>

            {/* Remove/Leave Button (Nửa hình tròn, màu đỏ, có icon DoorOpen) */}
            {isExpanded && canRemove && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmModal({ isOpen: true, member });
                }}
                className="h-10 w-10 mr-1 bg-red-500 hover:bg-red-600 text-white border-2 border-black flex items-center justify-center shrink-0 transition-colors duration-200 cursor-pointer rounded-full"
                title={isSelf ? "Leave this project" : "Remove member"}
                aria-label={isSelf ? "Leave this project" : "Remove member"}
              >
                <DoorOpen size={22} />
              </button>
            )}
          </div>
        );
      })}
      {/* Member count indicator */}
      <div className="ml-4 flex items-center gap-1 text-md text-gray-500 select-none">
        <Users size={24} />
        {members.length}
      </div>

      {/* Neo-brutalist Confirmation Modal */}
      {confirmModal.isOpen && confirmModal.member && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#eff759] rounded-[30px] px-2 py-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black text-black">
            <h3 className="text-2xl font-black text-center mb-4 uppercase tracking-wide">
              {confirmModal.member.userId === localStorage.getItem("userId")
                ? "Leave this project?"
                : "Remove member?"}
            </h3>
            <p className="text-center text-lg mb-6 leading-relaxed">
              {confirmModal.member.userId === localStorage.getItem("userId")
                ? "Are you sure you want to leave this project? Because once you leave, all tasks you created will be deleted ."
                : `Are you sure you want to remove "${confirmModal.member.username}" from this project?`}
            </p>
            <div className="flex items-center justify-center gap-6">
              <button
                type="button"
                onClick={() => setConfirmModal({ isOpen: false, member: null })}
                className="bg-white text-black px-6 py-2 rounded-full border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer"
              >
                Nah!
              </button>
              <button
                type="button"
                onClick={confirmRemove}
                className="bg-[#d73b3b] text-white px-6 py-2 rounded-full border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer"
              >
                Yeah! Sure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 70%, 80%)`;
}

export default UserMiniCard;
