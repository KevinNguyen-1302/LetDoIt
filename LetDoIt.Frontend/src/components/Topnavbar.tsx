import { Search, Bell, Settings, LogOut } from "lucide-react";
import { Input } from "antd";
import { useEffect, useState } from "react";

const TopNav = () => {
  const [Username, setName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setName("");
          return;
        }

        const response = await fetch("http://localhost:5112/api/user/get", {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });

        if (!response.ok) {
          console.error("Failed to fetch user:", response.statusText);
          setName("");
          return;
        }

        const data = await response.json();
        setName(data.data?.username || "");
      } catch (error) {
        console.error("Error fetching user:", error);
        setName("");
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.clear(); // Dọn sạch kho chứa
    window.location.href = "/login";
  };

  return (
    <header className="h-16 md:h-20 border-b border-gray-100 flex items-center justify-between px-4 md:px-8 bg-white backdrop-blur-sm z-10 sticky top-0">
      <div className="flex items-center gap-2 md:gap-6">
        <div>
          <a href="/">
            <h2 className="font-bold text-2xl md:text-4xl">
              Let's{" "}
              <span className="bg-[#eff759] text-black px-2 rounded-md">
                DoIt
              </span>
            </h2>
          </a>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
        <div className="relative w-32 sm:w-48 md:w-64">
          <Input
            prefix={<Search className="text-gray-400 w-4 h-4 mr-2" />}
            placeholder="Quick find..."
            className="bg-gray-100 border-none rounded-full py-2 px-4 font-yomogi hover:bg-gray-200 focus:bg-white focus:ring-2 focus:ring-brand-blue/20 text-xs md:text-sm"
          />
        </div>

        <button className="hidden sm:block text-gray-600 hover:text-brand-blue transition-colors">
          <Bell size={20} />
        </button>
        <button className="hidden sm:block text-gray-600 hover:text-brand-blue transition-colors">
          <Settings size={20} />
        </button>
        {/* Add greeting message */}
        <p className="hidden lg:block text-gray-600 text-sm">
          {Username ? `Hello, ${Username}!` : "You are not logged in."}
        </p>
        <button
          onClick={handleLogout}
          className="px-3 md:px-4 bg-[#f82b2b] text-black py-2 md:py-3 rounded-full flex items-center justify-center gap-1 md:gap-2 font-bold my-4 md:my-8 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black "
        >
          <LogOut size={16} className="md:w-5 md:h-5" />
          <span className="hidden sm:inline text-sm md:text-base">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default TopNav;
