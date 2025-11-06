
import React from 'react';
import { useApp } from '../context/AppContext';

const ProfilePage: React.FC = () => {
  const { user, isDark, setUser, setToken, dreams } = useApp();

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      setUser(null);
      setToken(null);
    }
  };
  
  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-2xl p-8 border ${isDark ? 'border-gray-700' : 'border-purple-100'}`}>
        <div className="text-center mb-8">
          <div className="inline-block text-6xl mb-4">{user.avatar}</div>
          <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-purple-900'}`}>
            {user.name}
          </h2>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2`}>{user.email}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className={`${isDark ? 'bg-gradient-to-br from-purple-900/30 to-pink-900/30' : 'bg-gradient-to-br from-purple-100 to-pink-100'} rounded-2xl p-6 text-center border ${isDark ? 'border-purple-800' : 'border-purple-200'}`}>
            <div className={`text-3xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'} mb-2`}>
              {dreams.length}
            </div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Dreams Logged</div>
          </div>
          
          <div className={`${isDark ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30' : 'bg-gradient-to-br from-blue-100 to-purple-100'} rounded-2xl p-6 text-center border ${isDark ? 'border-blue-800' : 'border-blue-200'}`}>
            <div className={`text-3xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'} mb-2`}>45%</div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Avg Lucidity</div>
          </div>
          
          <div className={`${isDark ? 'bg-gradient-to-br from-pink-900/30 to-purple-900/30' : 'bg-gradient-to-br from-pink-100 to-purple-100'} rounded-2xl p-6 text-center border ${isDark ? 'border-pink-800' : 'border-pink-200'}`}>
            <div className={`text-3xl font-bold ${isDark ? 'text-pink-400' : 'text-pink-600'} mb-2`}>30</div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Day Streak</div>
          </div>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={handleDeleteAccount}
            className={`w-full py-3 rounded-xl ${
              isDark ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'bg-red-50 text-red-600 hover:bg-red-100'
            } font-semibold transition-all duration-300`}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
