import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import AppRoutes from './routes/AppRoutes';

const pageMeta = {
  '/': { title: 'Dashboard', subtitle: 'Welcome back to your business overview' },
  '/expenses': { title: 'Expenses', subtitle: 'Track and manage your business expenses' },
  '/sales': { title: 'Sales', subtitle: 'Record and track your salad sales' },
  '/inventory': { title: 'Inventory', subtitle: 'Track stock levels and monitor low stock items' },
  '/reminders': { title: 'Reminders', subtitle: 'Manage your tasks and to-dos' },
};

const App = () => {
  const location = useLocation();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const currentMeta = pageMeta[location.pathname] || pageMeta['/'];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#F8FAFC]">
        {/* Sidebar - Desktop Only */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="lg:ml-64">
          {/* Top Navbar - Desktop Only */}
          <Navbar
            title={currentMeta.title}
            subtitle={currentMeta.subtitle}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />

          {/* Page Content */}
          <main className="pt-0 lg:pt-16 pb-20 lg:pb-8 px-4 sm:px-6 py-6 lg:px-8 max-w-7xl mx-auto">
            <AppRoutes />
          </main>
        </div>

        {/* Bottom Navigation - Mobile Only */}
        <BottomNav />
      </div>
    </ToastProvider>
  );
};

export default App;
