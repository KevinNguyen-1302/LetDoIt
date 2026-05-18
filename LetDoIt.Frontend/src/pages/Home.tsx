import { useEffect, useState } from "react";
import { Filter, Plus, SortDesc, Trash2 } from "lucide-react";
import { getColumns, createColumn, deleteColumn,  type Column } from "../services/columnService";
import { toast } from "react-toastify/unstyled";
import { DndContext } from "@dnd-kit/core";
import ColumnContainerDetail from "../components/ColumnContainerDetail";

// import TaskCard from "../components/Taskcard";
import ColumnContainer from "../components/ColumnContainer";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [selectedColumn, setSelectedColumn] = useState<Column | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);

  // Fetch columns on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          toast("User ID not found", {
            style: { fontFamily: '"Cherry Bomb One", cursive' },
          });
          setLoading(false);
          return;
        }

        const columnsResponse = await getColumns(userId);
        const fetchedColumns: Column[] = columnsResponse.data;
        fetchedColumns.sort((a, b) => (a.position || 0) - (b.position || 0));
        setColumns(fetchedColumns);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast("Failed to load data", {
          style: { fontFamily: '"Cherry Bomb One", cursive' },
        });
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
    return () => window.removeEventListener("taskCreated", handleTaskCreated);
  }, []);

  if (loading) return <div className="p-6">Loading tasks...</div>;

  async function createNewColumn() {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast("User ID not found", {
          style: { fontFamily: '"Cherry Bomb One", cursive' },
        });
        return;
      }

      const columnTitle = `New Column ${columns.length + 1}`;
      const response = await createColumn(columnTitle);
      
      const newColumn: Column = response.data;
      setColumns([...columns, newColumn]);
      
      toast("Column created successfully", {
        style: { fontFamily: '"Cherry Bomb One", cursive' },
      });
    } catch (error) {
      console.error("Failed to create column:", error);
      toast("Failed to create column", {
        style: { fontFamily: '"Cherry Bomb One", cursive' },
      });
    }
  }

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
      <DndContext>
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
          <div className="flex gap-4 mb-6 items-stretch overflow-x-auto">
            <div className="flex gap-4 shrink-0">
              {columns && columns.length > 0 ? (
                columns.map((col) => (
                  <div key={col.columnId} className=" " onClick={() => setSelectedColumn(col)}>
                    <ColumnContainer column={col} />
                  </div>
                ))
              ) : (
                <div className="text-gray-500">No columns yet. Create one to get started!</div>
              )}
            </div>
            <div className="flex items-center gap-2 text-gray-400 hover:text-red-500 bg-white border-2 border-black rounded-lg hover:bg-gray-200 transition-colors shadow-sm font-medium w-64 justify-center shrink-0">
              <Trash2 />
            </div>
          </div>
        </div>
      </DndContext>

      {/* Modal for Column Detail */}
      {selectedColumn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full mx-4">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">{selectedColumn.title}</h2>
              <button
                onClick={() => setSelectedColumn(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <ColumnContainerDetail column={selectedColumn} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};  

export default Home;
