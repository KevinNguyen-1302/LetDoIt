import React from "react";
import { Calendar, Pen, Trash2, Users } from "lucide-react";

interface ProjectContainerProps {
  title: string;
  createdAt: string;
  numberOfMembers: number;
}

const ProjectContainer: React.FC<ProjectContainerProps> = ({
  title,
  createdAt,
  numberOfMembers,
}) => {
  // Format date to readable format
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="group relative bg-white border-2 border-black rounded-xl p-5 transition-all duration-200 ease-in-out hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between min-h-[160px] cursor-pointer">
      {/* Top Header */}
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-lg text-black line-clamp-2 pr-4">{title}</h4>
        <div className="flex gap-2 shrink-0">
          <button
            className="p-1.5 border-2 border-transparent hover:border-black rounded-md hover:bg-yellow-300 transition-all hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            onClick={(e) => {
              e.stopPropagation();
              // Add edit logic here
            }}
            title="Edit Project"
          >
            <Pen className="w-4 h-4 text-black" strokeWidth={2.5} />
          </button>
          <button
            className="p-1.5 border-2 border-transparent hover:border-black rounded-md hover:bg-red-400 transition-all hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            onClick={(e) => {
              e.stopPropagation();
              // Add delete logic here
            }}
            title="Delete Project"
          >
            <Trash2 className="w-4 h-4 text-black" strokeWidth={2.5} />
          </button>
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
  );
};

export default ProjectContainer;
