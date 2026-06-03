import { useState } from "react";
import TaskCardDetail from "./TaskCardDetail";
import { Check, User } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Column } from "../services/columnService";
import type { TaskResponse } from "../services/taskService";

interface Props {
  task: TaskResponse;
  columns: Column[];
  isOverlay?: boolean;
  isOverTrash?: boolean;
}

const TaskCard = ({
  task,
  columns,
  isOverlay = false,
  isOverTrash = false,
}: Props) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.taskId,
    data: {
      type: "task",
      task,
    },
    disabled: isOverlay,
  });

  const style = isOverlay
    ? {}
    : {
        transform: CSS.Translate.toString(transform),
        transition: isDragging ? "none" : transition,
      };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return " text-blue-800 "; // Low
      case 2:
        return " text-yellow-800 "; // Medium
      case 3:
        return " text-orange-800 "; // High
      case 4:
        return " text-red-800 "; // Urgent
      default:
        return " text-gray-800 ";
    }
  };

  const getCardColor = (priority: number) => {
    switch (priority) {
      case 1:
        return "bg-[#A2D2FF]"; // Low
      case 2:
        return "bg-[#FFF9A6]"; // Medium
      case 3:
        return "bg-[#FFD166]"; // High
      case 4:
        return "bg-[#FFADAD]"; // Urgent
      default:
        return "bg-gray-100 hover:bg-gray-200";
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1:
        return "Low";
      case 2:
        return "Medium";
      case 3:
        return "High";
      case 4:
        return "Urgent";
      default:
        return "Medium";
    }
  };

  // Find Category info

  const isDraggingOrOverlay = isDragging || isOverlay;
  const hoverClasses = isDraggingOrOverlay
    ? ""
    : "hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-[transform,background-color,border-color,box-shadow] duration-150";

  const showTrashPlaceholder = isDragging && isOverTrash;

  const cardClasses = showTrashPlaceholder
    ? "opacity-0 bg-transparent border-transparent shadow-none pointer-events-none"
    : isDragging
      ? "opacity-30 border-dashed bg-gray-200 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
      : `${getCardColor(task.priority)} border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`;

  return (
    <>
      <div
        ref={isOverlay ? undefined : setNodeRef}
        style={style}
        {...(isOverlay ? {} : attributes)}
        {...(isOverlay ? {} : listeners)}
        onClick={isOverlay ? undefined : () => setIsDetailOpen(true)}
        className={`rounded-xl p-3 mb-3 border-2 ${
          isOverlay ? "cursor-grabbing" : "cursor-grab"
        } ${hoverClasses} ${cardClasses}`}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4
            className={`text-sm font-bold text-black flex-1 line-clamp-2 leading-snug ${task.isCompleted ? "line-through text-gray-500 opacity-60" : ""}`}
          >
            {task.title}
          </h4>
          <div
            className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${getPriorityColor(
              task.priority,
            )}`}
          >
            {getPriorityLabel(task.priority)}
          </div>
        </div>

        {task.description && (
          <p
            className={`text-xs text-gray-700 line-clamp-2 mb-2 ${task.isCompleted ? "opacity-50" : ""}`}
          >
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-black/10 text-[13px]">
          {/* Assignee info */}
          {task.assigneeName ? (
            <div className="flex items-center gap-1.5 bg-black/5 pl-0.5 pr-2 py-0.5 rounded-full border border-black/10">
              {task.assigneeAvatarUrl ? (
                <img
                  src={task.assigneeAvatarUrl}
                  alt={task.assigneeName}
                  className="w-6 h-6 rounded-full border border-black"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-[#E8FF46] border border-black flex items-center justify-center text-[12px] font-black uppercase text-black">
                  {task.assigneeName.charAt(0)}
                </div>
              )}
              <span className=" text-black truncate max-w-20">
                {task.assigneeName}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-gray-500 font-semibold italic">
              <User size={10} className="opacity-60" />
              <span>Unassigned</span>
            </div>
          )}

          {/* Due date / Completed state */}
          {task.isCompleted ? (
            <span className="flex items-center gap-0.5 text-green-700 font-extrabold bg-green-100 px-1.5 py-0.5 rounded-full border border-green-300">
              <Check size={10} strokeWidth={3} />
              Done
            </span>
          ) : task.dueDate ? (
            <span className="text-gray-600 font-bold">
              Due:{" "}
              {new Date(task.dueDate).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </span>
          ) : null}
        </div>
      </div>

      {/* Detail Modal Component */}
      <TaskCardDetail
        task={task}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        columns={columns}
      />
    </>
  );
};

export default TaskCard;
