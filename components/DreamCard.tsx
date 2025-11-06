import React from 'react';
import { Lock, Globe, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Dream } from '../types';

interface DreamCardProps {
  dream: Dream;
  onClick: () => void;
}

const DreamCard: React.FC<DreamCardProps> = ({ dream, onClick }) => {
  const { isDark } = useApp();
  const privacyIcons = {
    private: <Lock size={16} />,
    public: <Globe size={16} />,
    anonymous: <Users size={16} />
  };

  // ✅ Safely parse insights if it’s a string
  let parsedInsights: any = {};
  try {
    if (typeof dream.insights === 'string' && dream.insights.trim() !== '') {
      parsedInsights = JSON.parse(dream.insights);
    } else if (typeof dream.insights === 'object' && dream.insights !== null) {
      parsedInsights = dream.insights;
    }
  } catch (e) {
    console.warn('Invalid insights JSON:', dream.insights);
  }

  const themes = parsedInsights.themes || [];
  
  return (
    <div
      onClick={onClick}
      className={`${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-100'
      } rounded-2xl shadow-lg hover:shadow-2xl border p-6 cursor-pointer transform hover:scale-105 transition-all duration-300`}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <img
            src={dream.image || '/placeholder.jpg'}
            alt="Dream visualization"
            className="w-24 h-24 rounded-xl object-cover"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {dream.date
                ? new Date(dream.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })
                : 'No date'}
            </span>
            <span className={`flex items-center space-x-1 text-xs ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
              {privacyIcons[dream.privacy] || <Lock size={16} />}
              <span className="capitalize">{dream.privacy || 'private'}</span>
            </span>
          </div>
          
          <p className={`${isDark ? 'text-gray-200' : 'text-gray-700'} line-clamp-3 mb-3`}>
            {dream.text || 'No dream text available.'}
          </p>

          {/* ✅ Only render if themes array exists and not empty */}
          {Array.isArray(themes) && themes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {themes.slice(0, 3).map((theme: string, i: number) => (
                <span
                  key={i}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isDark ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700'
                  }`}
                >
                  {theme}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DreamCard;
