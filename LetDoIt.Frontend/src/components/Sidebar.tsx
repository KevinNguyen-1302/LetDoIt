import { useState } from 'react';
import { Calendar, Timer, LineChart, Plus, House } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import CreateTaskModal from './Createtask';

const Sidebar = () => {
  const location = useLocation();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const openTaskModal = () => setIsTaskModalOpen(true);
  const closeTaskModal = () => setIsTaskModalOpen(false);



  return (
    <>
      <aside className="w-64 border-r border-gray-100 flex flex-col p-6 h-auto">
        <button
          onClick={openTaskModal}
          className="w-full bg-[#FF6B4A] text-black py-3 rounded-full flex items-center justify-center gap-2 font-bold my-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black"
        >
          <Plus size={20} />
          Create Task
        </button>
        <nav className="h-fit space-y-2 border-2 border-gray-700 py-2 px-2 rounded-2xl">

          {/* --- MỤC HOME --- */}
          <Link
            to="/home"
            className={clsx(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
              location.pathname === "/home"
                ? "bg-[#a1dafd] text-[#0f1012] text-lg font-bold border border-[#090706]"
                : "text-gray-500 hover:bg-[#f0f0f0] hover:text-gray-900 font-medium"
            )}
          >
            <House size={20} />
            <span>Home</span>

          </Link>

          {/* --- MỤC CALENDAR --- */}
          <Link
            to="/calendar"
            className={clsx(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
              location.pathname === "/calendar"
                ? "bg-[#a1dafd] text-[#0f1012] text-lg font-bold border border-[#090706]"
                : "text-gray-500 hover:bg-[#f0f0f0] hover:text-gray-900 font-medium"
            )}
          >
            <Calendar size={20} />
            <span>Calendar</span>
          </Link>
          {/* --- MỤC FOCUS --- */}
          <Link
            to="/focus"
            className={clsx(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
              location.pathname === "/focus"
                ? "bg-[#a1dafd] text-[#0f1012] text-lg font-bold border border-[#090706]"
                : "text-gray-500 hover:bg-[#f0f0f0] hover:text-gray-900 font-medium"
            )}
          >
            <Timer size={20} />
            <span>Focus</span>
          </Link>

          {/* --- MỤC ANALYTICS --- */}
          <Link
            to="/analytics"
            className={clsx(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
              location.pathname === "/analytics"
                ? "bg-[#a1dafd] text-[#0f1012] text-lg font-bold border border-[#090706]"
                : "text-gray-500 hover:bg-[#f0f0f0] hover:text-gray-900 font-medium"
            )}
          >
            <LineChart size={20} />
            <span>Analytics</span>
          </Link>

        </nav>
      </aside>

      {/* Render CreateTaskModal */}
      <CreateTaskModal isOpen={isTaskModalOpen} onClose={closeTaskModal} />
    </>
  );
};



export default Sidebar;
