import { useEffect, useState } from "react";
import { ArrowLeft, Filter, Plus, SortDesc } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import {
  getColumnsByProject,
  createColumn,
  deleteColumn,
  changeColumnPosition,
  type Column,
  updateColumn,
} from "../services/columnService";

import {
  type TaskResponse,
  getTasksByProject,
  moveTask,
  deleteTask,
} from "../services/taskService";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";

import ColumnContainer from "../components/ColumnContainer";
import TrashBin from "../components/TrashBin";
import TaskCard from "../components/TaskCard";
import CreateTaskModal from "./Createtask";
import type {
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import { createPortal } from "react-dom";

interface KanbanBoardProps {
  projectId: string;
  projectTitle?: string;
}

const KanbanBoard = ({ projectId, projectTitle }: KanbanBoardProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedColumn, setSelectedColumn] = useState<Column | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<TaskResponse | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [targetColumnId, setTargetColumnId] = useState<string | undefined>(
    undefined,
  );
  const [dragOriginalColumnId, setDragOriginalColumnId] = useState<
    string | null
  >(null);
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [overId, setOverId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  // Fetch columns and tasks for the specific project
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch columns by projectId
        const fetchedColumns = await getColumnsByProject(projectId);
        fetchedColumns.sort((a, b) => (a.position || 0) - (b.position || 0));
        setColumns(fetchedColumns);

        // Fetch tasks by projectId
        const fetchedTasks = await getTasksByProject(projectId);
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Failed to fetch project data:", error);
        toast("Failed to load project data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Listen for task creation events
    const handleTaskCreated = () => {
      fetchData();
    };

    window.addEventListener("taskCreated", handleTaskCreated);
    return () => {
      window.removeEventListener("taskCreated", handleTaskCreated);
    };
  }, [projectId]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#5E548E] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading board...</p>
        </div>
      </div>
    );

  // Helper function to get tasks for a specific column
  const getTasksForColumn = (columnId: string): TaskResponse[] => {
    return tasks.filter((task) => task.columnId === columnId);
  };

  const createNewColumn = async () => {
    try {
      const columnTitle = `New Column ${columns.length + 1}`;
      const newColumn = await createColumn(
        columnTitle,
        columns.length,
        projectId,
      );
      setColumns([...columns, newColumn]);
      toast("Column created successfully");
    } catch (error) {
      console.error("Failed to create column:", error);
      toast("Failed to create column");
    }
  };

  const deleteExistingColumn = async (columnId: string) => {
    try {
      await deleteColumn(columnId);
      setColumns(columns.filter((col) => col.columnId !== columnId));
      toast("Column deleted successfully");
    } catch (error) {
      console.error("Failed to delete column:", error);
      toast("Failed to delete column");
    }
  };

  const updateColumnTitle = async (columnId: string, newTitle: string) => {
    try {
      await updateColumn(columnId, newTitle);
      setColumns(
        columns.map((col) =>
          col.columnId === columnId ? { ...col, title: newTitle } : col,
        ),
      );
      toast("Column title updated successfully");
    } catch (error) {
      console.error("Failed to update column title:", error);
      toast("Failed to update column title");
    }
  };

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setOverId(null);
    if (active.data.current?.type === "column") {
      setActiveColumn(active.id as string);
      return;
    }
    if (active.data.current?.type === "task") {
      setActiveTask(active.data.current.task);
      setDragOriginalColumnId(active.data.current.task?.columnId ?? null);
      return;
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    setOverId(over ? (over.id as string) : null);
    if (!over) return;

    const activeId = active.id;
    const overIdLocal = over.id;

    if (activeId === overIdLocal) return;

    const isActiveATask = active.data.current?.type === "task";
    const isOverATask = over.data.current?.type === "task";

    if (!isActiveATask) return;

    // Case 1: Dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((prevTasks) => {
        const activeIndex = prevTasks.findIndex((t) => t.taskId === activeId);
        const overIndex = prevTasks.findIndex((t) => t.taskId === overIdLocal);

        if (activeIndex === -1 || overIndex === -1) return prevTasks;

        const newTasks = [...prevTasks];
        const activeTask = { ...newTasks[activeIndex] };
        const overTask = newTasks[overIndex];

        if (activeTask.columnId !== overTask.columnId) {
          activeTask.columnId = overTask.columnId;
          newTasks[activeIndex] = activeTask;
          return arrayMove(newTasks, activeIndex, overIndex);
        }

        return arrayMove(newTasks, activeIndex, overIndex);
      });
    }

    // Case 2: Dropping a Task over a Column container
    const isOverAColumn = over.data.current?.type === "column";
    if (isActiveATask && isOverAColumn) {
      setTasks((prevTasks) => {
        const activeIndex = prevTasks.findIndex((t) => t.taskId === activeId);
        if (activeIndex === -1) return prevTasks;

        const newTasks = [...prevTasks];
        const activeTask = {
          ...newTasks[activeIndex],
          columnId: overIdLocal as string,
        };
        newTasks[activeIndex] = activeTask;

        return arrayMove(newTasks, activeIndex, activeIndex);
      });
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveColumn(null);
    setActiveTask(null);
    setOverId(null);
    const savedOriginalColumnId = dragOriginalColumnId;
    setDragOriginalColumnId(null);

    if (!over) {
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Column Drag Drops
    if (active.data.current?.type === "column") {
      if (overId === "trash-bin") {
        await deleteExistingColumn(activeId);
        return;
      }

      if (activeId === overId) {
        return;
      }

      const activeIndex = columns.findIndex((col) => col.columnId === activeId);
      const overIndex = columns.findIndex((col) => col.columnId === overId);

      if (activeIndex === -1 || overIndex === -1) {
        return;
      }

      const newColumns = arrayMove([...columns], activeIndex, overIndex);
      setColumns(newColumns);

      const newPosition = newColumns.findIndex(
        (col) => col.columnId === activeId,
      );

      try {
        await changeColumnPosition(activeId, newPosition);
        toast("Column position updated");
      } catch (error) {
        console.error("Failed to update column position:", error);
        toast("Failed to update column position");
      }
      return;
    }

    // Task Drag Drops
    if (active.data.current?.type === "task") {
      const activeIndex = tasks.findIndex((t) => t.taskId === activeId);
      if (activeIndex === -1) return;

      if (overId === "trash-bin") {
        try {
          await deleteTask(activeId);
          setTasks(tasks.filter((t) => t.taskId !== activeId));
          toast.success("Task deleted successfully");
        } catch (error) {
          console.error("Failed to delete task:", error);
          toast.error("Failed to delete task");
        }
        return;
      }

      // Resolve the actual target columnId
      let targetColumnId: string;
      if (over.data.current?.type === "column") {
        targetColumnId = overId;
      } else if (over.data.current?.type === "task") {
        targetColumnId =
          over.data.current.task?.columnId ??
          tasks.find((t) => t.taskId === overId)?.columnId ??
          overId;
      } else {
        targetColumnId = overId;
      }

      try {
        if (savedOriginalColumnId && savedOriginalColumnId !== targetColumnId) {
          await moveTask(tasks[activeIndex].taskId, targetColumnId);
          toast.success("Task moved successfully");
        }
      } catch (error) {
        console.error("Failed to move task:", error);
        toast.error("Failed to move task");
      }
    }
  };

  const isTaskOverTrash = activeTask !== null && overId === "trash-bin";

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col p-6">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-black rounded-xl hover:bg-yellow-300 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 font-medium"
            title="Back to Home"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Back to Home</span>
          </button>
          <div>
            <h2 className="font-cherry text-5xl text-[#5E548E] tracking-wide mb-1">
              {projectTitle || "Project Board"}
            </h2>
            <p className="text-gray-500">
              Organize your thoughts, one tile at a time.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm font-medium">
            <Filter size={18} />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm font-medium">
            <SortDesc size={18} />
            Sort
          </button>
        </div>
      </div>

      {/* Kanban Columns */}
      <DndContext
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        sensors={sensors}
      >
        <div>
          <button
            onClick={() => {
              createNewColumn();
            }}
            className="mb-6 px-4 py-2 w-52 bg-[#548e76] flex text-white rounded-lg font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black"
          >
            <Plus className=" size-6" />
            Add Column
          </button>
          <div className="flex gap-4 mb-6 items-stretch overflow-x-auto px-4 py-5">
            <SortableContext items={columns.map((col) => col.columnId)}>
              <div className="flex gap-4 shrink-0">
                {columns && columns.length > 0 ? (
                  columns.map((col) => (
                    <div
                      key={col.columnId}
                      className=" "
                      onClick={() => setSelectedColumn(col)}
                    >
                      <ColumnContainer
                        column={col}
                        updateColumnTitle={updateColumnTitle}
                        tasks={getTasksForColumn(col.columnId)}
                        columns={columns}
                        isOverTrash={isTaskOverTrash}
                        onAddTask={(columnId) => {
                          setTargetColumnId(columnId);
                          setIsTaskModalOpen(true);
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">
                    No columns yet. Create one to get started!
                  </div>
                )}
              </div>
            </SortableContext>
            <TrashBin isActive={activeColumn !== null || activeTask !== null} />
          </div>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={columns.find((col) => col.columnId === activeColumn)!}
                updateColumnTitle={updateColumnTitle}
                tasks={getTasksForColumn(activeColumn)}
                columns={columns}
                onAddTask={() => {}}
              />
            )}
            {activeTask && (
              <TaskCard task={activeTask} columns={columns} isOverlay />
            )}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        columnId={targetColumnId}
      />
    </div>
  );
};

export default KanbanBoard;
