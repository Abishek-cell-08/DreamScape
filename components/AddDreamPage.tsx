
import React, { useState } from 'react';
import { Sparkles, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Dream } from '../types';

interface AddDreamPageProps {
  setCurrentPage: (page: string) => void;
}

const AddDreamPage: React.FC<AddDreamPageProps> = ({ setCurrentPage }) => {
  const { isDark, addDream, setToast } = useApp();
  const [formData, setFormData] = useState<Omit<Dream, 'id' | 'insights' | 'image'>>({
    text: '',
    date: new Date().toISOString().split('T')[0],
    privacy: 'private'
  });
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Saving Dream...');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      setLoadingMessage('Saving dream...');
      await new Promise(res => setTimeout(res, 500));
      setLoadingMessage('Generating insights & visualization...');
      await addDream(formData);
      setToast({ show: true, message: 'Dream saved successfully! ✨', type: 'success' });
      setTimeout(() => {
        setCurrentPage('diary');
      }, 1000);
    } catch (error) {
      setToast({ show: true, message: 'Failed to save dream', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-2xl p-8 border ${isDark ? 'border-gray-700' : 'border-purple-100'}`}>
        <div className="flex items-center space-x-3 mb-6">
          <Sparkles className={`${isDark ? 'text-purple-400' : 'text-purple-600'}`} size={32} />
          <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-purple-900'}`}>Capture Your Dream</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
              Dream Description
            </label>
            <textarea
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' 
                  : 'bg-white border-purple-200 focus:border-purple-400'
              } focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-300 resize-none`}
              rows="8"
              placeholder="Describe your dream in as much detail as you remember..."
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Date</label>
              <div className="relative">
                <Calendar className={`absolute left-3 top-3 ${isDark ? 'text-gray-400' : 'text-purple-400'}`} size={20} />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' 
                      : 'bg-white border-purple-200 focus:border-purple-400'
                  } focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-300`}
                  required
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Privacy</label>
              <div className="relative">
                <select
                  value={formData.privacy}
                  onChange={(e) => setFormData({ ...formData, privacy: e.target.value as 'private' | 'public' | 'anonymous' })}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' 
                      : 'bg-white border-purple-200 focus:border-purple-400'
                  } focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-300 appearance-none`}
                >
                  <option value="private">🔒 Private</option>
                  <option value="public">🌍 Public</option>
                  <option value="anonymous">👤 Anonymous</option>
                </select>
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>{loadingMessage}</span>
            ) : (
              <>
                <Sparkles size={20} />
                <span>Save Dream</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDreamPage;
