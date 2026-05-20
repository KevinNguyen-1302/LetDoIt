import { useEffect, useState } from "react";
import { Filter, Plus, SortDesc } from "lucide-react";
import {
  getColumns,
  createColumn,
  deleteColumn,
  changeColumnPosition,
  type Column,
  updateColumn,
} from "../services/columnService";

import {
  type TaskResponse,
  getMyTasks,
  getMyCategories,
  type CategoryResponse,
  moveTask,
  deleteTask,
} from "../services/taskService";

import { toast } from "react-toastify";
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
import type { DragEndEvent, DragStartEvent, DragOverEvent } from "@dnd-kit/core";
import { createPortal } from "react-dom";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [selectedColumn, setSelectedColumn] = useState<Column | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<TaskResponse | null>(null);
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [overId, setOverId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );


  // Fetch columns and tasks on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch columns
        const columnsResponse = await getColumns();
        const fetchedColumns: Column[] = columnsResponse.data;
        fetchedColumns.sort((a, b) => (a.position || 0) - (b.position || 0));
        setColumns(fetchedColumns);

        // Fetch categories
        const categoriesResponse = await getMyCategories();
        setCategories(categoriesResponse.data);

        // Fetch tasks
        const tasksResponse = await getMyTasks();
        const fetchedTasks: TaskResponse[] = tasksResponse.data;
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Listen for task creation events
    const handleTaskCreated = () => {
      fetchData();
    };

    // Listen for auth change events (from login)
    const handleAuthChange = () => {
      setLoading(true);
      fetchData();
    };

    window.addEventListener("taskCreated", handleTaskCreated);
    window.addEventListener("authChange", handleAuthChange);
    return () => {
      window.removeEventListener("taskCreated", handleTaskCreated);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  if (loading) return <div className="p-6">Loading tasks...</div>;

  // Helper function to get tasks for a specific column
  const getTasksForColumn = (columnId: string): TaskResponse[] => {
    return tasks.filter((task) => task.columnId === columnId);
  };

  const createNewColumn = async () => {
    try {
      const columnTitle = `New Column ${columns.length + 1}`;
      const response = await createColumn(columnTitle, columns.length);

      const newColumn: Column = response.data;
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
        const activeTask = { ...newTasks[activeIndex], columnId: overIdLocal as string };
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

      const newPosition = newColumns.findIndex((col) => col.columnId === activeId);

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

      const task = tasks[activeIndex];
      try {
        if (task.columnId) {
          await moveTask(task.taskId, overId);
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
        <div>
          <h2 className="font-cherry text-5xl text-[#5E548E] tracking-wide mb-2">
            Today's Flow
          </h2>
          <p className="text-gray-500">
            Organize your thoughts, one tile at a time.
          </p>
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
                        categories={categories}
                        columns={columns}
                        isOverTrash={isTaskOverTrash}
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
                categories={categories}
                columns={columns}
              />
            )}
            {activeTask && (
              <TaskCard task={activeTask} categories={categories} columns={columns} isOverlay />
            )}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </div>
  );
};

export default Home;
