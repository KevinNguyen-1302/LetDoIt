import React from 'react';
import { LayoutGrid, Calendar, Timer, LineChart, HelpCircle, LogOut, Plus } from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
  return (
    <aside className="w-64 border-r border-gray-100 flex flex-col p-6 h-full">
      {/* Logo Area */}
      

      {/* Create Button */}
      <button className="w-full bg-[#FF6B4A] hover:bg-[#ff5530] text-black py-3 rounded-xl flex items-center justify-center gap-2 font-bold my-8 transition-colors shadow-sm">
        <Plus size={20} />
        Create Task
      </button>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        <NavItem icon={<LayoutGrid size={20} />} label="Dashboard" active />
        <NavItem icon={<Calendar size={20} />} label="Calendar" active={undefined} />
        <NavItem icon={<Timer size={20} />} label="Focus" active={undefined} />
        <NavItem icon={<LineChart size={20} />} label="Analytics" active={undefined} />
      </nav>

      {/* Bottom Actions */}
      <div className="space-y-2 mt-auto">
        <NavItem icon={<HelpCircle size={20} />} label="Help" active={undefined} />
        <NavItem icon={<LogOut size={20} />} label="Logout" active={undefined} />
      </div>
    </aside>
  );
};

const NavItem = ({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) => {
  return (
    <a
      href="#"
      className={clsx(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
        active 
          ? "bg-[#fdb0a1] text-[#0f1012] font-bold border border-[#090706]" 
          : "text-gray-500 hover:bg-[#f0f0f0] hover:text-gray-900 font-medium"
      )}
    >
      <div className={clsx("flex items-center justify-center", active ? "text-brand-blue" : "")}>
        {icon}
      </div>
      <span className={clsx(active && "text-brand-blue")}>{label}</span>
      {active && (
        <span className="ml-auto text-[10px] bg-brand-blue text-[#500303] px-2 py-0.5 rounded-md font-sans">
          Select
        </span>
      )}
    </a>
  );
};

export default Sidebar;
