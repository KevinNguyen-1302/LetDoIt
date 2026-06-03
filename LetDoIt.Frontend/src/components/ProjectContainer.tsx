import React, { useState } from "react";
import { Calendar, Pen, Trash2, Users, Check, X } from "lucide-react";
import {
  updateProject,
  changeProjectAuthor,
  getProjectMembers,
  deleteProject,
} from "../services/projectService";
import { getUserByUsername } from "../services/authService";
import { toast } from "react-toastify";
import DeleteCheck from "./DeleteCheck";

interface ProjectContainerProps {
  projectId: string;
  title: string;
  createdAt: string;
  numberOfMembers: number;
  authorName?: string;
  onUpdate?: () => void;
  onOpen?: (projectId: string) => void;
}

const ProjectContainer: React.FC<ProjectContainerProps> = ({
  projectId,
  title,
  createdAt,
  numberOfMembers,
  authorName,
  onUpdate,
  onOpen,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editAuthor, setEditAuthor] = useState(authorName || "");
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Format date to readable format
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editTitle.trim()) {
      toast.error("Project title cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      let isUpdated = false;
      // Update Title
      if (editTitle !== title) {
        await updateProject(projectId, editTitle);
        isUpdated = true;
      }

      // Update Author
      if (editAuthor !== authorName && editAuthor.trim()) {
        try {
          const selectedMember = members.find(
            (m) => m.username === editAuthor.trim(),
          );
          if (selectedMember && selectedMember.userId) {
            await changeProjectAuthor(projectId, selectedMember.userId);
            isUpdated = true;
          } else {
            const users = await getUserByUsername(editAuthor.trim());
            const userDto = Array.isArray(users) ? users[0] : users;
            if (userDto && userDto.userId) {
              await changeProjectAuthor(projectId, userDto.userId);
              isUpdated = true;
            }
          }
        } catch (err) {
          toast.error("User not found or you don't have permission");
        }
      }

      if (isUpdated) {
        toast.success("Project updated successfully!");
        if (onUpdate) onUpdate();
      }
      setEditMode(false);
    } catch (error) {
      toast.error("Failed to update project");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditTitle(title);
    setEditAuthor(authorName || "");
    setEditMode(false);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProject(projectId);
      toast.success("Project deleted successfully!");
      setShowDeleteConfirm(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error("Failed to delete project");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div>
      <DeleteCheck
        projectTitle={title}
        isOpen={showDeleteConfirm}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      <div
        className={`group relative bg-white border-2 border-black rounded-xl p-5 transition-all duration-300 ease-in-out flex flex-col justify-between cursor-pointer ${
          editMode
            ? "scale-105 z-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] min-h-50"
            : "hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] min-h-40"
        }`}
        onClick={() => {
          if (!editMode && onOpen) {
            onOpen(projectId);
          }
        }}
      >
        {/* Top Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col pr-4 flex-1">
            {editMode ? (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="text-lg text-black border-2 border-black rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Project Title"
                  disabled={isLoading}
                />
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-sm text-gray-500">By @</span>
                  {isLoadingMembers ? (
                    <span className="text-sm text-gray-500">Loading...</span>
                  ) : (
                    <select
                      value={editAuthor}
                      onChange={(e) => setEditAuthor(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="text-sm font-bold text-gray-500 border-2 border-black rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                      disabled={isLoading}
                    >
                      {!members.find((m) => m.username === authorName) &&
                        authorName && (
                          <option value={authorName}>{authorName}</option>
                        )}
                      {members.map((member) => (
                        <option key={member.userId} value={member.username}>
                          {member.username}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            ) : (
              <>
                <h4 className="text-lg font-bold text-black line-clamp-2">
                  {title}
                </h4>
                {authorName && (
                  <p className="text-sm font-bold text-gray-500 mt-1">
                    By @{authorName}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="flex gap-2 shrink-0 ml-2">
            {editMode ? (
              <>
                <button
                  className="p-1.5 border-2 border-transparent hover:border-black rounded-md hover:bg-emerald-400 transition-all hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                  onClick={handleSave}
                  disabled={isLoading}
                  title="Save Changes"
                >
                  <Check className="w-4 h-4 text-black" strokeWidth={2.5} />
                </button>
                <button
                  className="p-1.5 border-2 border-transparent hover:border-black rounded-md hover:bg-red-400 transition-all hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                  onClick={handleCancel}
                  disabled={isLoading}
                  title="Cancel"
                >
                  <X className="w-4 h-4 text-black" strokeWidth={2.5} />
                </button>
              </>
            ) : (
              <>
                <button
                  className="p-1.5 border-2 border-transparent hover:border-black rounded-md hover:bg-yellow-300 transition-all hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  onClick={async (e) => {
                    e.stopPropagation();
                    setEditMode(true);
                    setIsLoadingMembers(true);
                    try {
                      const data = await getProjectMembers(projectId);
                      // Extract the array correctly if it is nested inside an object (e.g. { data: [...] })
                      const membersList = Array.isArray(data)
                        ? data
                        : data?.data || [];
                      setMembers(membersList);
                    } catch (err) {
                      toast.error("Failed to load project members");
                    } finally {
                      setIsLoadingMembers(false);
                    }
                  }}
                  title="Edit Project"
                >
                  <Pen className="w-4 h-4 text-black" strokeWidth={2.5} />
                </button>
                <button
                  className="p-1.5 border-2 border-transparent hover:border-black rounded-md hover:bg-red-400 transition-all hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  onClick={handleDeleteClick}
                  title="Delete Project"
                >
                  <Trash2 className="w-4 h-4 text-black" strokeWidth={2.5} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Bottom Meta Data */}
        <div className="mt-auto pt-4 border-t-2 border-black border-dashed flex flex-wrap items-center justify-between gap-3 text-sm font-bold text-black">
          <div className="flex items-center gap-1.5 bg-yellow-300 px-3 py-1.5 rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Calendar className="w-4 h-4" strokeWidth={2.5} />
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-400 px-3 py-1.5 rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Users className="w-4 h-4" strokeWidth={2.5} />
            <span>
              {numberOfMembers} {numberOfMembers > 1 ? "members" : "member"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectContainer;
