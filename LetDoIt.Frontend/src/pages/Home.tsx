import { useEffect, useState, useRef } from "react";
import { Filter, Plus, SortDesc, Trash2 } from "lucide-react";
import { getMyTasks, type TaskResponse } from "../services/taskService";
import { getColumns } from "../services/columnService";
import { getCurrentUserId } from "../services/authService";
import { toast } from "react-toastify/unstyled";
import { DndContext } from "@dnd-kit/core";
import ColumnContainerDetail from "../components/ColumnContainerDetail";

// import TaskCard from "../components/Taskcard";
import ColumnContainer from "../components/ColumnContainer";

const Home = () => {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedColumn, setSelectedColumn] = useState<Column | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Enable horizontal scrolling with mouse wheel
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      const onWheel = (e: WheelEvent) => {
        if (e.deltaY !== 0) {
          e.preventDefault();
          el.scrollLeft += e.deltaY;
        }
      };
      el.addEventListener("wheel", onWheel, { passive: false });
      return () => el.removeEventListener("wheel", onWheel);
    }
  }, []);

  // Get grid size based on priority

  // Fetch tasks and columns on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksResponse = await getMyTasks();
        setTasks(tasksResponse.data);

        const userId = getCurrentUserId();
        if (userId) {
          const columnsResponse = await getColumns(userId);
          const fetchedColumns: Column[] = columnsResponse.data.map((col) => ({
            id: col.columnId,
            title: col.title,
            position: col.position,
          }));
          fetchedColumns.sort((a, b) => (a.position || 0) - (b.position || 0));
          setColumns(fetchedColumns);
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast("Failed to load data", {
          style: { fontFamily: '"Cherry Bomb One", cursive' },
        });
        setLoading(false);
      }
    };

    fetchData();

    // Listen for task creation events
    const handleTaskCreated = () => {
      fetchData();
    };

    window.addEventListener("taskCreated", handleTaskCreated);
    return () => window.removeEventListener("taskCreated", handleTaskCreated);
  }, []);

  if (loading) return <div className="p-6">Loading tasks...</div>;

  function createNewColumn() {
    const newColumn: Column = {
      id: `col-${Date.now()}`,
      title: `New Column ${columns.length + 1}`,
    };
    setColumns([...columns, newColumn]);
    console.log("Created new column:", newColumn);
  }

  return (
    <div className="max-w-8xl h-full flex flex-col p-6">
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
      <DndContext>
        <div>
          <button
            onClick={() => {
              createNewColumn();
            }}
            className="mb-6 px-4 py-2 w-52 bg-[#548e76] flex text-white rounded-lg font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black"
          >
            <Plus className=" size-6" />
            Add Collumn
          </button>
          <div
            ref={scrollContainerRef}
            className="flex gap-4 mb-6 items-stretch overflow-x-auto pb-4"
          >
            <div className="flex gap-4 shrink-0">
              {columns.map((col) => (
                <div
                  key={col.id}
                  className=" "
                  onClick={() => setSelectedColumn(col)}
                >
                  <ColumnContainer column={col} />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 text-gray-400 hover:text-red-500 bg-white border-2 border-black rounded-lg hover:bg-gray-200 transition-colors shadow-sm font-medium w-64 justify-center shrink-0">
              <Trash2 />
            </div>
          </div>
        </div>
      </DndContext>

      {/* Modal for Column Detail */}
    </div>
  );
};

export default Home;

export type Id = string;
export type Column = {
  id: Id;
  title: string;
  position?: number;
};
