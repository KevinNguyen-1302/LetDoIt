import { useState } from 'react';
import { LayoutGrid, Calendar, Timer, LineChart, LogOut, Plus, House } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import CreateTaskModal from './Createtask';

const Sidebar = () => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false); 

  const handleLogout = () => {
  localStorage.clear(); // Dọn sạch kho chứa
  window.location.href = "/login";
};

  return (
    <>
      <aside className="w-64 border-r border-gray-100 flex flex-col p-6 h-full">
        
        <button 
          onClick={openModal}
          className="w-full bg-[#FF6B4A] text-black py-3 rounded-full flex items-center justify-center gap-2 font-bold my-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black"
        >
          <Plus size={20} />
          Create Task
        </button>

      <nav className="flex-1 space-y-2">
        
        {/* --- MỤC HOME --- */}
        <Link
          to="/"
          className={clsx(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
            location.pathname === "/home" 
              ? "bg-[#a1dafd] text-[#0f1012] text-lg font-bold border border-[#090706]" 
              : "text-gray-500 hover:bg-[#f0f0f0] hover:text-gray-900 font-medium"
          )}
        >
          <House size={20} />
          <span>Home</span>
          {location.pathname === "/home" && (
            <span className="ml-auto text-[10px] bg-[#090706] text-white px-2 py-0.5 rounded-md">Select</span>
          )}
        </Link>

        {/* --- MỤC DASHBOARD --- */}
        <Link
          to="/dashboard"
          className={clsx(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
            location.pathname === "/dashboard" 
              ? "bg-[#a1dafd] text-[#0f1012] text-lg font-bold border border-[#090706]" 
              : "text-gray-500 hover:bg-[#f0f0f0] hover:text-gray-900 font-medium"
          )}
        >
          <LayoutGrid size={20} />
          <span>Dashboard</span>
          {location.pathname === "/dashboard" && (
            <span className="ml-auto text-[10px] bg-[#090706] text-white px-2 py-0.5 rounded-md">Select</span>
          )}
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
          {location.pathname === "/calendar" && (
            <span className="ml-auto text-[10px] bg-[#090706] text-white px-2 py-0.5 rounded-md">Select</span>
          )}
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
          {location.pathname === "/focus" && (
            <span className="ml-auto text-[10px] bg-[#090706] text-white px-2 py-0.5 rounded-md">Select</span>
          )}
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
          {location.pathname === "/analytics" && (
            <span className="ml-auto text-[10px] bg-[#090706] text-white px-2 py-0.5 rounded-md">Select</span>
          )}
        </Link>
          {/* --- MỤC LOGOUT --- */}
        <button 
        onClick={handleLogout} 
        className=" min-w-full bg-[#f82b2b] text-black py-3 rounded-full flex items-center justify-center gap-2 font-bold my-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </nav>
    </aside>

    {/* Render CreateTaskModal */}
    <CreateTaskModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};



export default Sidebar;
