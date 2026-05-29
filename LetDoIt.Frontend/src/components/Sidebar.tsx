import { useState } from "react";
import { Calendar, Timer, LineChart, House, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import CreateTaskModal from "./Createtask";

const Sidebar = () => {
  const location = useLocation();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  //const openTaskModal = () => setIsTaskModalOpen(true);
  const closeTaskModal = () => setIsTaskModalOpen(false);

  const getLinkClasses = (path: string) =>
    clsx(
      "flex items-center py-3 rounded-xl transition-all duration-500",
      isExpanded ? "gap-3 px-3" : "justify-center px-2",
      location.pathname === path
        ? "bg-[#a1dafd] text-[#0f1012] text-base md:text-lg font-bold border border-[#090706]"
        : "text-gray-500 hover:bg-[#f0f0f0] hover:text-gray-900 font-medium text-sm md:text-base",
    );

  return (
    <>
      <aside
        className={clsx(
          "border-r border-gray-100 flex flex-col p-3 md:p-6 transition-all duration-500 sticky top-20 h-screen",
          isExpanded ? " md:w-64 lg:w-64" : "w-20 md:w-30 lg:w-30",
        )}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={clsx(
            "mb-4 text-gray-500 hover:text-black p-2 rounded-lg hover:bg-gray-100 transition-colors mx-auto",
            isExpanded ? "" : "mx-auto",
          )}
        >
          <Menu size={24} />
        </button>

        <nav className="h-fit space-y-2 border-2 border-gray-700 py-2 px-2 rounded-2xl flex flex-col">
          <Link to="/home" className={getLinkClasses("/home")}>
            <House size={20} className="min-w-[20px]" />
            {isExpanded && <span>Home</span>}
          </Link>
          <Link to="/calendar" className={getLinkClasses("/calendar")}>
            <Calendar size={20} className="min-w-[20px]" />
            {isExpanded && <span>Calendar</span>}
          </Link>
          <Link to="/focus" className={getLinkClasses("/focus")}>
            <Timer size={20} className="min-w-[20px]" />
            {isExpanded && <span>Focus</span>}
          </Link>
          <Link to="/analytics" className={getLinkClasses("/analytics")}>
            <LineChart size={20} className="min-w-[20px]" />
            {isExpanded && <span>Analytics</span>}
          </Link>
        </nav>
      </aside>

      <CreateTaskModal isOpen={isTaskModalOpen} onClose={closeTaskModal} />
    </>
  );
};

export default Sidebar;
