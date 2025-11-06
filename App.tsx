
import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import AuthPage from './components/AuthPage';
import Navbar from './components/Navbar';
import DiaryPage from './components/DiaryPage';
import AddDreamPage from './components/AddDreamPage';
import TrendsPage from './components/TrendsPage';
import ProfilePage from './components/ProfilePage';
import Toast from './components/Toast';

const AppContent: React.FC = () => {
  const { user, token, isDark, toast, setToast } = useApp();
  const [currentPage, setCurrentPage] = useState('diary');
  const [isLogin, setIsLogin] = useState(true);

  if (!token || !user) {
    return <AuthPage isLogin={isLogin} setIsLogin={setIsLogin} />;
  }

  return (
    <div className={`${isDark ? 'dark' : ''} min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50'} transition-colors duration-300`}>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="pb-8">
        {currentPage === 'diary' && <DiaryPage />}
        {currentPage === 'add-dream' && <AddDreamPage setCurrentPage={setCurrentPage} />}
        {currentPage === 'trends' && <TrendsPage />}
        {currentPage === 'profile' && <ProfilePage />}
      </main>
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
