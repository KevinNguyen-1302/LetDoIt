import type { TaskResponse } from "../services/taskService";

interface Props {
  task: TaskResponse;
}

const TaskCard = ({ task }: Props) => {
  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return " text-blue-800"; // Low
      case 2:
        return " text-yellow-800"; // Medium
      case 3:
        return " text-orange-800"; // High
      case 4:
        return " text-red-800"; // Urgent
      default:
        return " text-gray-800";
    }
  };

  const getCardColor = (priority: number) => {
    switch (priority) {
      case 1:
        return "bg-blue-200 "; // Low
      case 2:
        return "bg-yellow-200 "; // Medium
      case 3:
        return "bg-orange-200 "; // High
      case 4:
        return "bg-red-200 "; // Urgent
      default:
        return "bg-gray-200 ";
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
        return "Unknown";
    }
  };

  return (
    <div className={`${getCardColor(task.priority)} rounded-md p-2 mb-2 border border-gray-200 cursor-grab hover:shadow-md hover:scale-105 transition-shadow`}>
      <div className="flex items-start justify-between gap-2 mb-1">
        <h4 className="text-md font-medium text-gray-800 flex-1 line-clamp-2">
          {task.title}
        </h4>
        <div
          className={`text-xs px-2 py-0.5 rounded whitespace-nowrap font-semibold ${getPriorityColor(
            task.priority,
          )}`}
        >
          {getPriorityLabel(task.priority)}
        </div>
      </div>
      {task.description && (
        <p className="text-xs text-gray-500 line-clamp-1 mb-1">{task.description}</p>
      )}
      {task.dueDate && (
        <div className="text-xs text-gray-600">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
