import { Search, Bell, Settings } from 'lucide-react';
import { Input } from 'antd';
import { useEffect, useState } from 'react';

const TopNav = () => {

  const [Username, setName] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setName('');
          return;
        }

        const response = await fetch('http://localhost:5112/api/user/get', {
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        });

        if (!response.ok) {
          console.error('Failed to fetch user:', response.statusText);
          setName('');
          return;
        }

        const data = await response.json();
        setName(data.username || '');
      } catch (error) {
        console.error('Error fetching user:', error);
        setName('');
      }
    };

    fetchUser();
  }, [])

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
        <p className="text-gray-600"> 
          {Username ? `Hello, ${Username}!` : 'You are not logged in.'}
        </p>
      </div>
    </header>
  );
};

export default TopNav;