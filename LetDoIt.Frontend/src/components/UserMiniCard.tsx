import { useState, useEffect, useRef } from "react";
import { Crown, Shield, Users } from "lucide-react";
import { getProjectMembers } from "../services/projectService";

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
  const [members, setMembers] = useState<MemberDto[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
              ${isExpanded ? "bg-white pr-4 gap-2.5 z-20 " : "bg-white z-10"}
            `}
            style={{
              marginLeft: index > 0 && !expandedId ? "-8px" : "0px",
              zIndex: isExpanded ? 30 : members.length - index,
            }}
          >
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full shrink-0 overflow-hidden flex items-center justify-center">
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
                overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap
                ${isExpanded ? "max-w-48 opacity-100 my-2  " : "max-w-0 opacity-0"}
              `}
            >
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-bold text-gray-900 truncate max-w-36">
                  {member.username}
                </span>
                <span
                  className={`
                    inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 
                    rounded-full border w-fit mt-0.5
                    ${badge.color}
                  `}
                >
                  {badge.icon}
                  {badge.label}
                </span>
              </div>
            </div>
          </div>
        );
      })}
      {/* Member count indicator */}
      <div className="ml-4 flex items-center gap-1 text-md font-bold text-gray-500 select-none">
        <Users size={24} />
        {members.length}
      </div>
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
