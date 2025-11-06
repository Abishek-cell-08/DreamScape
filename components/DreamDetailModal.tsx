
import React, { useState } from 'react';
import { X, Brain, Heart, Eye, Image as ImageIcon } from 'lucide-react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../context/AppContext';
import type { Dream } from '../types';

interface DreamDetailModalProps {
  dream: Dream | null;
  onClose: () => void;
}

const DreamDetailModal: React.FC<DreamDetailModalProps> = ({ dream, onClose }) => {
  const { isDark } = useApp();
  const [activeTab, setActiveTab] = useState('summary');

  if (!dream) return null;

  const emotionData = dream.insights?.emotions 
    ? Object.entries(dream.insights.emotions).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        // Fix: Explicitly convert value to a number to handle potential 'unknown' type from Object.entries.
        value: Math.round(Number(value) * 100)
      }))
    : [];

  const COLORS = ['#8B5CF6', '#EC4899', '#06B6D4', '#F59E0B', '#10B981', '#EF4444'];

  const tabs = [
    { id: 'summary', label: 'Summary', icon: Brain },
    { id: 'emotions', label: 'Emotions', icon: Heart },
    { id: 'entities', label: 'Entities', icon: Eye },
    { id: 'image', label: 'Image', icon: ImageIcon }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${ isDark ? 'bg-gray-800' : 'bg-white' } rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col`}
      >
        <div className={`flex items-center justify-between p-6 border-b ${isDark ? 'border-gray-700' : 'border-purple-100'}`}>
          <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-purple-900'}`}>Dream Details</h3>
          <button onClick={onClose} className={`p-2 rounded-xl ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
            <X size={24} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
          </button>
        </div>
        
        <div className={`flex border-b ${isDark ? 'border-gray-700' : 'border-purple-100'} px-6`}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-all duration-300 ${ activeTab === tab.id ? `${isDark ? 'border-purple-500 text-purple-400' : 'border-purple-600 text-purple-600'}` : `border-transparent ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}` }`}>
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'summary' && (
            <div className="space-y-6">
              <div>
                <h4 className={`text-lg font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Full Dream</h4>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>{dream.text}</p>
              </div>
              
              {dream.insights && (
                <>
                  <div>
                    <h4 className={`text-lg font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>AI Summary</h4>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{dream.insights.summary}</p>
                  </div>
                  <div>
                    <h4 className={`text-lg font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Themes</h4>
                    <div className="flex flex-wrap gap-2">
                      {dream.insights.themes.map((theme, i) => (
                        <span key={i} className={`px-4 py-2 rounded-full text-sm font-medium ${ isDark ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700' }`}>{theme}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className={`text-lg font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Lucidity Score</h4>
                    <div className="flex items-center space-x-4">
                      <div className={`flex-1 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-4 overflow-hidden`}>
                        <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500" style={{ width: `${(dream.insights.lucidity || 0) * 100}%` }} />
                      </div>
                      <span className={`text-lg font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>{Math.round((dream.insights.lucidity || 0) * 100)}%</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          
          {activeTab === 'emotions' && dream.insights && (
            <div className="space-y-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={emotionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#E5E7EB'} />
                  <XAxis dataKey="name" stroke={isDark ? '#9CA3AF' : '#6B7280'} />
                  <YAxis stroke={isDark ? '#9CA3AF' : '#6B7280'} />
                  <Tooltip contentStyle={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF', border: 'none', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}/>
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {emotionData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          
          {activeTab === 'entities' && dream.insights && (
            <div>
              <h4 className={`text-lg font-semibold mb-4 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Key Elements</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {dream.insights.entities.map((entity, i) => (
                  <div key={i} className={`p-4 rounded-xl text-center ${ isDark ? 'bg-gradient-to-br from-purple-900/30 to-pink-900/30' : 'bg-gradient-to-br from-purple-100 to-pink-100' } border ${isDark ? 'border-purple-800' : 'border-purple-200'}`}>
                    <span className={`text-lg font-medium ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>{entity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'image' && (
            <div className="space-y-4">
              <h4 className={`text-lg font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>AI-Generated Visualization</h4>
              <img src={dream.image} alt="Dream visualization" className="w-full rounded-2xl shadow-2xl" />
              <p className={`text-sm text-center ${isDark ? 'text-gray-400' : 'text-gray-500'} italic`}>This image was generated based on your dream description</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DreamDetailModal;
