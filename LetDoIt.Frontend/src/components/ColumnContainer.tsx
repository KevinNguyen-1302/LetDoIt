import type { Column } from "../services/columnService";
import type { TaskResponse } from "../services/taskService";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import TaskCard from "./Taskcard";

interface Props {
  column: Column;
  updateColumnTitle: (columnId: string, newTitle: string) => void;
  tasks: TaskResponse[];
}

const ColumnContainer = (props: Props) => {
  const { column, updateColumnTitle, tasks } = props;
  const [editMode, setEditMode] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.columnId,
    data: {
      type: "column",
      column,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-full bg-[#c6c6c6] rounded-lg w-64 opacity-50 "
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="h-90 bg-[#fffadf] rounded-lg w-64 border-2 border-black cursor-grab relative flex flex-col"
    >
      <div
        {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}
        className="bg-amber-200 rounded-t-lg p-4 border-b-2 border-black flex items-center gap-2 shrink-0"
      >
        <div className="text-sm text-white bg-[#824900] w-fit px-2 py-1 rounded-full font-medium">
          {tasks.length}
        </div>
        <h3 className=" text-lg text-gray-800 ">{!editMode && column.title}</h3>
        {editMode && (
          <input
            value = {column.title}
            onChange = {(e) => {
              updateColumnTitle(column.columnId, e.target.value);
            }}
            className = "w-full rounded-md h-7 px-2 border text-md outline-[#258ff8] bg-white outline-3 "
            autoFocus
            onBlur={() => setEditMode(false)}
          />
        )}
      </div>
      {/* Tasks Container */}
      <div className="px-3 pt-3 pb-2 overflow-y-auto flex-1">
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard key={task.taskId} task={task} />
          ))
        ) : (
          <div className="text-md text-gray-400 text-center py-4">No tasks yet</div>
        )}
      </div>
    </div>
  );
};

export default ColumnContainer;
