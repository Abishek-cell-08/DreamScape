import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import type { TrendsData } from '../types';

const TrendsPage: React.FC = () => {
  const { isDark, token } = useApp(); // ✅ get token from context
  const [trends, setTrends] = useState<TrendsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      if (!token) return; // if user not logged in
      setLoading(true);
      try {
        const data = await api.getTrends(token); // ✅ pass token
        setTrends(data);
      } catch (error) {
        console.error("Failed to fetch trends:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, [token]);

  if (loading || !trends) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-200'} rounded-2xl h-96 animate-pulse`} />
      </div>
    );
  }

  const COLORS = ['#8B5CF6', '#EC4899', '#06B6D4', '#F59E0B', '#10B981', '#EF4444'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-purple-900'} mb-8`}>
        Dream Trends & Insights
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6 border ${isDark ? 'border-gray-700' : 'border-purple-100'}`}>
          <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>Emotion Frequencies</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={trends.emotions} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value">
                {trends.emotions.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF', border: 'none', borderRadius: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6 border ${isDark ? 'border-gray-700' : 'border-purple-100'}`}>
          <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>Lucidity Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trends.lucidityTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#E5E7EB'} />
              <XAxis dataKey="date" stroke={isDark ? '#9CA3AF' : '#6B7280'} />
              <YAxis stroke={isDark ? '#9CA3AF' : '#6B7280'} />
              <Tooltip contentStyle={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF', border: 'none', borderRadius: '12px' }} />
              <Legend />
              <Line type="monotone" dataKey="lucidity" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6 border ${isDark ? 'border-gray-700' : 'border-purple-100'}`}>
        <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>Popular Dream Themes</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={trends.themes}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#E5E7EB'} />
            <XAxis dataKey="name" stroke={isDark ? '#9CA3AF' : '#6B7280'} />
            <YAxis stroke={isDark ? '#9CA3AF' : '#6B7280'} />
            <Tooltip contentStyle={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF', border: 'none', borderRadius: '12px' }} />
            <Bar dataKey="count" fill="#EC4899" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendsPage;
