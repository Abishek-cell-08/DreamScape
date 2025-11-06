
import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const { isDark } = useApp();
  
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const successClasses = isDark ? 'border-green-700 text-green-300' : 'border-green-200 text-green-700';
  const errorClasses = isDark ? 'border-red-700 text-red-300' : 'border-red-200 text-red-600';
  const icon = type === 'success' ? '✓' : '✗';

  return (
    <div className={`fixed bottom-8 right-8 z-50 ${
      isDark ? 'bg-gray-800' : 'bg-white'
    } rounded-2xl shadow-2xl p-4 border ${
      type === 'success' ? successClasses : errorClasses
    } flex items-center space-x-3 animate-fade-in`} style={{ animation: 'fadeInUp 0.5s ease-out' }}>
      <span className="text-2xl font-bold">{icon}</span>
      <span className={isDark ? 'text-white' : 'text-gray-800'}>{message}</span>
    </div>
  );
};

export default Toast;
