import { Search, Bell, Settings } from 'lucide-react';
import { Input } from 'antd';

const TopNav = () => {
  return (
    <header className="h-20 border-b border-gray-100 flex items-center justify-between px-8 bg-white/50 backdrop-blur-sm z-10 sticky top-0">
      <div className="flex items-center gap-6">
        <div>
          <a href="/">
            <h2 className="font-bold text-4xl">
              Let's{" "}
              <span className="bg-[#eff759] text-black px-2 rounded-md">
                DoIt
              </span>
            </h2>
          </a>
        </div>
        <div className="flex gap-4 ml-8 text-sm font-medium text-gray-500">
          <div className="relative">
            <span className="text-brand-blue border-b-2 border-brand-blue pb-1 font-bold">Dashboard</span>
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] bg-brand-blue text-white px-1.5 py-0.5 rounded font-sans whitespace-nowrap">Connected</span>
          </div>
          <span className="hover:text-gray-900 cursor-pointer transition-colors">Calendar</span>
          <span className="hover:text-gray-900 cursor-pointer transition-colors">Focus</span>
          <span className="hover:text-gray-900 cursor-pointer transition-colors">Analytics</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative w-64">
          <Input 
            prefix={<Search className="text-gray-400 w-4 h-4 mr-2" />} 
            placeholder="Quick find..." 
            className="bg-gray-100 border-none rounded-full py-2 px-4 font-yomogi hover:bg-gray-200 focus:bg-white focus:ring-2 focus:ring-brand-blue/20"
          />
        </div>
        
        <button className="text-gray-600 hover:text-brand-blue transition-colors">
          <Bell size={20} />
        </button>
        <button className="text-gray-600 hover:text-brand-blue transition-colors">
          <Settings size={20} />
        </button>
        {/* Add greeting message */}
        
      </div>
    </header>
  );
};

export default TopNav;