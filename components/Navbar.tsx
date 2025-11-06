
import React, { useState } from 'react';
import { Moon, Sun, LogOut, User, TrendingUp, BookOpen, Plus, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage }) => {
  const { user, setUser, setToken, isDark, setIsDark } = useApp();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    setUser(null);
    setToken(null);
  };

  const navItems = [
    { id: 'diary', label: 'Diary', icon: BookOpen },
    { id: 'add-dream', label: 'Add Dream', icon: Plus },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
  ];
  
  if (!user) return null;

  return (
    <nav className={`sticky top-0 z-50 ${isDark ? 'bg-gray-900/80' : 'bg-white/70'} backdrop-blur-xl border-b ${isDark ? 'border-gray-800' : 'border-purple-100'} shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className={`text-2xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-900'} flex items-center space-x-2`}>
              <span>DreamScape</span>
              <span>🌙</span>
            </h1>
            
            <div className="hidden md:flex space-x-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    currentPage === item.id
                      ? `${isDark ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-900'} shadow-md`
                      : `${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-purple-50'}`
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-xl ${isDark ? 'bg-gray-800 text-yellow-400' : 'bg-purple-100 text-purple-900'} hover:scale-110 transition-transform duration-300`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-xl ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-purple-100 hover:bg-purple-200'} transition-colors duration-300`}
              >
                <span className="text-2xl">{user.avatar}</span>
                <span className={`hidden sm:inline ${isDark ? 'text-gray-200' : 'text-purple-900'}`}>{user.name}</span>
                <ChevronDown size={16} className={isDark ? 'text-gray-400' : 'text-purple-600'} />
              </button>
              
              {showDropdown && (
                <div onMouseLeave={() => setShowDropdown(false)} className={`absolute right-0 mt-2 w-48 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl border ${isDark ? 'border-gray-700' : 'border-purple-100'} overflow-hidden`}>
                  <button
                    onClick={() => {
                      setCurrentPage('profile');
                      setShowDropdown(false);
                    }}
                    className={`w-full px-4 py-3 text-left flex items-center space-x-2 ${isDark ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-purple-50 text-gray-700'} transition-colors`}
                  >
                    <User size={18} />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className={`w-full px-4 py-3 text-left flex items-center space-x-2 ${isDark ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-red-50 text-red-600'} transition-colors`}
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
