import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Expenses from '../pages/Expenses';
import Sales from '../pages/Sales';
import Inventory from '../pages/Inventory';
import Reminders from '../pages/Reminders';

const pageTitles = {
  '/': { title: 'Dashboard', subtitle: 'Welcome back to your business overview' },
  '/expenses': { title: 'Expenses', subtitle: 'Track and manage your business expenses' },
  '/sales': { title: 'Sales', subtitle: 'Record and track your salad sales' },
  '/inventory': { title: 'Inventory', subtitle: 'Track stock levels and monitor low stock items' },
  '/reminders': { title: 'Reminders', subtitle: 'Manage your tasks and to-dos' },
};

export const usePageTitle = () => {
  const location = useLocation();
  return pageTitles[location.pathname] || pageTitles['/'];
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/expenses" element={<Expenses />} />
      <Route path="/sales" element={<Sales />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/reminders" element={<Reminders />} />
    </Routes>
  );
};

export default AppRoutes;
