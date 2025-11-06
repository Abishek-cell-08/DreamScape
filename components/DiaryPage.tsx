
import React, { useState } from 'react';
import { Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import DreamCard from './DreamCard';
import DreamDetailModal from './DreamDetailModal';
import type { Dream } from '../types';

const DiaryPage: React.FC = () => {
  const { isDark, dreams } = useApp();
  const [loading, setLoading] = useState(false); // Can be used if dreams are fetched here
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className={`${isDark ? 'bg-gray-800' : 'bg-gray-200'} rounded-2xl h-48 animate-pulse`} />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-purple-900'}`}>
            Your Dream Journal
          </h2>
          <span className={`px-4 py-2 rounded-full ${isDark ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700'} font-semibold`}>
            {dreams.length} Dreams
          </span>
        </div>
        
        <div className="space-y-6">
          {dreams.map(dream => (
            <DreamCard
              key={dream.id}
              dream={dream}
              onClick={() => setSelectedDream(dream)}
            />
          ))}
        </div>
        
        {dreams.length === 0 && !loading && (
          <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <Moon size={64} className="mx-auto mb-4 opacity-50" />
            <p className="text-xl">No dreams yet. Start capturing your dreams!</p>
          </div>
        )}
      </div>
      
      {selectedDream && (
        <DreamDetailModal
          dream={selectedDream}
          onClose={() => setSelectedDream(null)}
        />
      )}
    </>
  );
};

export default DiaryPage;
