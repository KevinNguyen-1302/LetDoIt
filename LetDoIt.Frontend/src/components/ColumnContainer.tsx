import type { Column } from "../services/columnService";
import type { TaskResponse } from "../services/taskService";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import TaskCard from "./TaskCard";

import { Plus } from "lucide-react";

interface Props {
  column: Column;
  updateColumnTitle: (columnId: string, newTitle: string) => void;
  tasks: TaskResponse[];
  columns: Column[];
  isOverTrash?: boolean;
  onAddTask: (columnId: string) => void;
}

const ColumnContainer = (props: Props) => {
  const { column, updateColumnTitle, tasks, columns, isOverTrash, onAddTask } =
    props;
  const [editMode, setEditMode] = useState(false);
  const [inputTitle, setInputTitle] = useState(column.title);

  const handleSaveTitle = () => {
    setEditMode(false);
    const trimmedTitle = inputTitle.trim();
    if (trimmedTitle && trimmedTitle !== column.title) {
      updateColumnTitle(column.columnId, trimmedTitle);
    } else {
      setInputTitle(column.title);
    }
  };

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
    transform: CSS.Translate.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-full min-h-48 border-2 border-dashed border-black bg-[#c6c6c6] rounded-lg w-64 opacity-50 "
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="h-full bg-[#fffadf] rounded-lg w-64 border-2 border-black cursor-grab relative flex flex-col"
    >
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          setEditMode(true);
          setInputTitle(column.title);
        }}
        className="bg-amber-200 rounded-t-lg p-4 border-b-2 border-black flex items-center gap-2 shrink-0"
      >
        <div className="text-sm text-white bg-[#824900] w-fit px-2 py-1 rounded-full font-medium">
          {tasks.length}
        </div>
        <h3 className=" text-lg text-gray-800 ">{!editMode && column.title}</h3>
        {editMode && (
          <input
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
            className="w-full rounded-md h-7 px-2 border text-md outline-[#258ff8] bg-white outline-3 "
            autoFocus
            onBlur={handleSaveTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveTitle();
              if (e.key === "Escape") {
                setEditMode(false);
                setInputTitle(column.title);
              }
            }}
          />
        )}
      </div>
      {/* Tasks Container */}
      <SortableContext items={tasks.map((task) => task.taskId)}>
        <div className="px-3 pt-3 pb-2 overflow-y-auto flex-1">
          {tasks && tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard
                key={task.taskId}
                task={task}
                columns={columns}
                isOverTrash={isOverTrash}
              />
            ))
          ) : (
            <div className="text-md text-gray-400 text-center py-4">
              No tasks yet
            </div>
          )}
        </div>
      </SortableContext>
      {/* Add Task Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAddTask(column.columnId);
        }}
        className="mx-3 mb-3 p-2 border-2 border-black rounded-lg bg-[#E8FF46] hover:bg-yellow-200 flex items-center justify-center gap-2 font-bold cursor-pointer transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] shrink-0 text-black text-sm"
      >
        <Plus size={16} />
        <span>Add Task</span>
      </button>
    </div>
  );
};

export default ColumnContainer;
