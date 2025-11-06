
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

interface AuthPageProps {
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ isLogin, setIsLogin }) => {
  const { setUser, setToken } = useApp();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = isLogin 
        ? await api.login(formData.email, formData.password)
        : await api.signup(formData.name, formData.email, formData.password);
      
      setToken(result.token);
      setUser(result.user);
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 via-pink-100 to-blue-200 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold text-purple-900 mb-2">DreamScape 🌙</h1>
          <p className="text-purple-600">Your sanctuary for dreams and insights</p>
        </div>
        
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
          <h2 className="text-2xl font-semibold text-purple-900 mb-6 text-center">
            {isLogin ? 'Welcome Back' : 'Begin Your Journey'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="relative">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  onFocus={() => setFocusedInput('name')}
                  onBlur={() => setFocusedInput('')}
                  className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-300 bg-white/50"
                  placeholder=" "
                  required
                />
                <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                  formData.name || focusedInput === 'name' 
                    ? '-top-2.5 text-xs bg-white px-1 text-purple-600' 
                    : 'top-3 text-gray-500'
                }`}>
                  Full Name
                </label>
              </div>
            )}
            
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput('')}
                className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-300 bg-white/50"
                placeholder=" "
                required
              />
              <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                formData.email || focusedInput === 'email'
                  ? '-top-2.5 text-xs bg-white px-1 text-purple-600'
                  : 'top-3 text-gray-500'
              }`}>
                Email Address
              </label>
            </div>
            
            <div className="relative">
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput('')}
                className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-300 bg-white/50"
                placeholder=" "
                required
              />
              <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                formData.password || focusedInput === 'password'
                  ? '-top-2.5 text-xs bg-white px-1 text-purple-600'
                  : 'top-3 text-gray-500'
              }`}>
                Password
              </label>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>
          
          <p className="mt-6 text-center text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
