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

import  { 
  type TaskResponse,
  updateTask,
  getMyCategories,
  getMyTasks,
  getTasksByUserId, 
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
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { createPortal } from "react-dom";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [selectedColumn, setSelectedColumn] = useState<Column | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
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
    if (event.active.data.current?.type === "column") {
      setActiveColumn(event.active.id as string);
      return;
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveColumn(null);

    if (!over) {
      return;
    }

    const activeColumnId = active.id as string;
    const overColumnId = over.id as string;

    // Check if column is dropped on trash bin
    if (overColumnId === "trash-bin") {
      await deleteExistingColumn(activeColumnId);
      return;
    }

    if (activeColumnId === overColumnId) {
      return;
    }

    const activeIndex = columns.findIndex(
      (col) => col.columnId === activeColumnId,
    );
    const overIndex = columns.findIndex((col) => col.columnId === overColumnId);

    if (activeIndex === -1 || overIndex === -1) {
      setActiveColumn(null);
      return;
    }

    const newColumns = arrayMove([...columns], activeIndex, overIndex);
    setColumns(newColumns);
    setActiveColumn(null);

    // Find new position of the active column after reordering
    const newPosition = newColumns.findIndex(
      (col) => col.columnId === activeColumnId,
    );

    try {
      await changeColumnPosition(activeColumnId, newPosition);
      toast("Column position updated");
    } catch (error) {
      console.error("Failed to update column position:", error);
      toast("Failed to update column position");
      // Revert state if API fails
      setColumns(columns);
    }
  };

  

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
          <div className="flex gap-4 mb-6 items-stretch overflow-x-auto px-4 py-10">
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
            <TrashBin isActive={activeColumn !== null} />
          </div>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={columns.find((col) => col.columnId === activeColumn)!}
                updateColumnTitle={updateColumnTitle}
                tasks={getTasksForColumn(activeColumn)}
              />
            )}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </div>
  );
};

export default Home;
